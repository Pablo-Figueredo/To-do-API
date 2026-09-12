class ErroBase extends Error {
  constructor(mensagem = "Erro interno no servidor.", status = 500) {
    super(mensagem);
    this.message = mensagem;
    this.status = status;
  }

  enviarResposta(res) {
    res.status(this.status).send({
      mensagem: this.message,
      status: this.status,
    });
  }
}

export default ErroBase;