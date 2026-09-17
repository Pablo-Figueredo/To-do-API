function apenasAdmin(req, res, next) {
  if (req.usuario?.role !== "admin") {
    return res.status(403).json({
      mensagem: "Acesso permitido somente para administradores",
    });
  }

  next();
}

export default apenasAdmin;