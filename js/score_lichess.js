new Vue({
  el: "#app",
  data: {
    jogadorSelecionado: null,
    linkFetch: null,
    pontuacao: {
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      diferenca: 0,
    },
    scoreAll: {
      vitorias: 0,
      empates: 0,
      derrotas: 0,
    },
  },
  created() {
    // Verifica se há um usuário na URL
    const urlParams = new URLSearchParams(window.location.search);
    this.jogadorSelecionado = urlParams.get("user");
    if (this.jogadorSelecionado) {
      this.linkFetch = `https://lichess.org/api/user/${this.jogadorSelecionado}`;
      this.pontuacao.vitorias = Number(urlParams.get("w") ?? "0");
      this.pontuacao.empates = Number(urlParams.get("d") ?? "0");
      this.pontuacao.derrotas = Number(urlParams.get("l") ?? "0");
      this.diferenca();
      this.score();
      setInterval(() => {
        this.atualizaPontuacao();
      }, 30000);
    }
  },
  methods: {
    diferenca: function () {
      this.pontuacao.diferenca =
        this.pontuacao.vitorias +
        this.pontuacao.empates / 2 -
        this.pontuacao.derrotas;
    },
    score: function () {
      fetch(this.linkFetch)
        .then((response) => response.json())
        .then((data) => {
          this.scoreAll.vitorias = data.count.win;
          this.scoreAll.empates = data.count.draw;
          this.scoreAll.derrotas = data.count.loss;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    atualizaPontuacao: function () {
      fetch(this.linkFetch)
        .then((response) => response.json())
        .then((data) => {
          if (data.count.win !== this.scoreAll.vitorias) {
            let i = data.count.win - this.scoreAll.vitorias;
            this.pontuacao.vitorias += i;
            this.scoreAll.vitorias = data.count.win;
          }
          if (data.count.draw !== this.scoreAll.empates) {
            let i = data.count.draw - this.scoreAll.empates;
            this.pontuacao.empates += i;
            this.scoreAll.empates = data.count.draw;
          }
          if (data.count.loss !== this.scoreAll.derrotas) {
            let i = data.count.loss - this.scoreAll.derrotas;
            this.pontuacao.derrotas += i;
            this.scoreAll.derrotas = data.count.loss;
          }
          this.diferenca();
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
