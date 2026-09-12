import ErroBase from "./ErroBase.js";

class RequisicaoIncorreta extends ErroBase {
  constructor(mensagem = "Um ou mais dados informados são inválidos. Verifique e tente novamente.") {
    super(mensagem, 400);
  }
}

export default RequisicaoIncorreta;