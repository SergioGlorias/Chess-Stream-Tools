new Vue({
  el: "#app",
  data: {
    jogadorSelecionado: null,
    ratingNow: {
      bullet: 0,
      blitz: 0,
      rapid: 0,
      classical: 0,
      correspondence: 0,
      puzzle: 0,
    },
    ratingStarting: {
      bullet: 0,
      blitz: 0,
      rapid: 0,
      classical: 0,
      correspondence: 0,
      puzzle: 0,
    },
    ratingDiff: {
      bullet: 0,
      blitz: 0,
      rapid: 0,
      classical: 0,
      correspondence: 0,
      puzzle: 0,
    },
  },
  created() {
    // Verifica se há um usuário na URL
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get("user");
    if (userParam) {
      this.jogadorSelecionado = userParam;

      this.rating();

      setInterval(() => {
        this.atualizaRating();
      }, 30000);
    }
  },
  methods: {
    rating: function () {
      fetch("https://lichess.org/api/user/" + this.jogadorSelecionado)
        .then((response) => response.json())
        .then((data) => {
          this.ratingNow.bullet = data.perfs.bullet.rating;
          this.ratingStarting.bullet = data.perfs.bullet.rating;

          this.ratingNow.blitz = data.perfs.blitz.rating;
          this.ratingStarting.blitz = data.perfs.blitz.rating;

          this.ratingNow.rapid = data.perfs.rapid.rating;
          this.ratingStarting.rapid = data.perfs.rapid.rating;

          this.ratingNow.classical = data.perfs.classical.rating;
          this.ratingStarting.classical = data.perfs.classical.rating;

          this.ratingNow.correspondence = data.perfs.correspondence.rating;
          this.ratingStarting.correspondence = data.perfs.correspondence.rating;

          this.ratingNow.puzzle = data.perfs.puzzle.rating;
          this.ratingStarting.puzzle = data.perfs.puzzle.rating;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    atualizaRating: function () {
      fetch("https://lichess.org/api/user/" + this.jogadorSelecionado)
        .then((response) => response.json())
        .then((data) => {
          this.ratingNow.bullet = data.perfs.bullet.rating;

          this.ratingNow.blitz = data.perfs.blitz.rating;

          this.ratingNow.rapid = data.perfs.rapid.rating;

          this.ratingNow.classical = data.perfs.classical.rating;

          this.ratingNow.correspondence = data.perfs.correspondence.rating;

          this.ratingNow.puzzle = data.perfs.puzzle.rating;

          this.diferenca();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    diferenca: function () {
      this.ratingDiff.bullet =
        this.ratingNow.bullet - this.ratingStarting.bullet;

      this.ratingDiff.blitz = this.ratingNow.blitz - this.ratingStarting.blitz;

      this.ratingDiff.rapid = this.ratingNow.rapid - this.ratingStarting.rapid;

      this.ratingDiff.classical =
        this.ratingNow.classical - this.ratingStarting.classical;

      this.ratingDiff.correspondence =
        this.ratingNow.correspondence - this.ratingStarting.correspondence;

      this.ratingDiff.puzzle =
        this.ratingNow.puzzle - this.ratingStarting.puzzle;
    },
  },
});
