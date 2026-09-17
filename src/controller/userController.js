import "dotenv/config";
import { User } from "../model/index.js";
import NaoEncontrado from "../erros/NaoEncontrado.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

function usuarioSemSenha(usuario) {
  const dados = usuario.toObject ? usuario.toObject() : { ...usuario };
  delete dados.senha;
  return dados;
}

class UserController {
  static listarusers = async (req, res, next) => {
    try {
      const user = await User.find().select("-senha");
      res.status(200).json(user);
    } catch (erro) {
      next(new NaoEncontrado(erro.message));
    }
  };

  static async listarUsersPorId(req, res, next) {
    try {
      const user = await User.findById(req.params.id).select("-senha");
      if (user !== null) {
        res.status(200).json(user);
      } else {
        next(new NaoEncontrado("User não encontrada"));
      }
    } catch (erro) {
      next(erro);
    }
  }
  
  static async criarUser(req, res, next) {
    try {
      const { nome, email, senha } = req.body;
      const senhaCriptografada = await bcrypt.hash(senha, 10);
      const novoUser = await User.create({
        nome,
        email,
        senha: senhaCriptografada,
        role: "user",
      });
      if (novoUser !== null) {
        res.status(201).json(usuarioSemSenha(novoUser));
      } else {
        next(new NaoEncontrado("User não criado"));
      }
    } catch (erro) {
      next(erro);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      const usuario = await User.findOne({ email });

      if (!usuario) {
        return res.status(401).json({ mensagem: "E-mail ou senha inválidos" });
      }

      let senhaValida = await bcrypt.compare(senha, usuario.senha);

      // Atualiza contas antigas que ainda estavam armazenadas em texto puro.
      if (!senhaValida && usuario.senha === senha) {
        usuario.senha = await bcrypt.hash(senha, 10);
        await usuario.save();
        senhaValida = true;
      }

      if (!senhaValida) {
        return res.status(401).json({ mensagem: "E-mail ou senha inválidos" });
      }

      const token = jwt.sign(
        { id: usuario._id.toString(), role: usuario.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.status(200).json({ token, user: usuarioSemSenha(usuario) });
    } catch (erro) {
      next(erro);
    }
  }

  static async atualizarUser(req, res, next) {
    try {
      const id = req.params.id;
      const dadosAtualizacao = { ...req.body };
      if (dadosAtualizacao.senha) {
        dadosAtualizacao.senha = await bcrypt.hash(dadosAtualizacao.senha, 10);
      }
      const userAtualizado = await User.findByIdAndUpdate(
        id,
        { $set: dadosAtualizacao },
        { new: true }
      );
      if (userAtualizado !== null) {
        res.status(200).json(usuarioSemSenha(userAtualizado));
      } else {
        next(new NaoEncontrado("User não encontrado"));
      }
    } catch (erro) {
      next(erro);
    }
  }

  static async deletarUser(req, res, next) {
    try {
      const id = req.params.id;
      const user = await User.findByIdAndDelete(id);
      if (user !== null) {
        res.status(200).json({ message: "User deletada com sucesso" });
      } else {
        next(new NaoEncontrado("User não encontrada"));
      }
    } catch (erro) {
      next(erro);
    }
  }
}

export default UserController;