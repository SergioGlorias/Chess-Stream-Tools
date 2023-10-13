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
      this.linkFetch = `https://api.chess.com/pub/player/${this.jogadorSelecionado}/stats`;
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
    soma: function (user) {
      let bullet_win = user.chess_bullet ? user.chess_bullet.record.win : 0;
      let blitz_win = user.chess_blitz ? user.chess_blitz.record.win : 0;
      let rapid_win = user.chess_rapid ? user.chess_rapid.record.win : 0;

      let bullet_draw = user.chess_bullet ? user.chess_bullet.record.draw : 0;
      let blitz_draw = user.chess_blitz ? user.chess_blitz.record.draw : 0;
      let rapid_draw = user.chess_rapid ? user.chess_rapid.record.draw : 0;

      let bullet_loss = user.chess_bullet ? user.chess_bullet.record.loss : 0;
      let blitz_loss = user.chess_blitz ? user.chess_blitz.record.loss : 0;
      let rapid_loss = user.chess_rapid ? user.chess_rapid.record.loss : 0;

      return {
        win: bullet_win + blitz_win + rapid_win,
        draw: bullet_draw + blitz_draw + rapid_draw,
        loss: bullet_loss + blitz_loss + rapid_loss,
      };
    },
    score: function () {
      fetch(this.linkFetch, {
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          let count = this.soma(data);

          this.scoreAll.vitorias = count.win;
          this.scoreAll.empates = count.draw;
          this.scoreAll.derrotas = count.loss;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    atualizaPontuacao: function () {
      fetch(this.linkFetch, {
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          let count = this.soma(data);

          if (count.win !== this.scoreAll.vitorias) {
            let i = count.win - this.scoreAll.vitorias;
            this.pontuacao.vitorias += i;
            this.scoreAll.vitorias = count.win;
          }
          if (count.draw !== this.scoreAll.empates) {
            let i = count.draw - this.scoreAll.empates;
            this.pontuacao.empates += i;
            this.scoreAll.empates = count.draw;
          }
          if (count.loss !== this.scoreAll.derrotas) {
            let i = count.loss - this.scoreAll.derrotas;
            this.pontuacao.derrotas += i;
            this.scoreAll.derrotas = count.loss;
          }
          this.diferenca();
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
