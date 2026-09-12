import ErroBase from "./ErroBase.js";

class NaoEncontrado extends ErroBase {
  constructor(mensagem = "Rota não encontrada. Verifique a URL e tente novamente.") {
    super(mensagem, 404);
  }
}

export default NaoEncontrado;