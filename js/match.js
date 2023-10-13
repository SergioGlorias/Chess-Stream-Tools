new Vue({
  el: "#app",
  data: {
    user1: null,
    user2: null,
    linkFetch: null,
    pontuacao: {
      user1: 0,
      user2: 0,
    },
    scoreAll: {
      user1: 0,
      user2: 0,
    },
  },
  created() {
    // Verifica se há um usuário na URL
    const urlParams = new URLSearchParams(window.location.search);
    this.user1 = urlParams.get("user1");
    this.user2 = urlParams.get("user2");
    if (this.user1 && this.user2) {
      this.pontuacao.user1 = Number(urlParams.get("w1") ?? "0");
      this.pontuacao.user2 = Number(urlParams.get("w2") ?? "0");
      this.linkFetch = `https://lichess.org/api/crosstable/${this.user1}/${this.user2}`;
      this.score();
      setInterval(() => {
        this.atualizaPontuacao();
      }, 30000);
    }
  },
  methods: {
    score: function () {
      fetch(this.linkFetch)
        .then((response) => response.json())
        .then((data) => {
          this.scoreAll.user1 = data.users[this.user1.toLowerCase()];
          this.scoreAll.user2 = data.users[this.user2.toLowerCase()];
        })
        .catch((error) => {
          console.error(error);
        });
    },
    atualizaPontuacao: function () {
      fetch(this.linkFetch)
        .then((response) => response.json())
        .then((data) => {
          const user1 = data.users[this.user1.toLowerCase()];
          const user2 = data.users[this.user2.toLowerCase()];

          if (user1 !== this.scoreAll.user1) {
            let i = user1 - this.scoreAll.user1;
            this.pontuacao.user1 += i;
            this.scoreAll.user1 = user1;
          }
          if (user2 !== this.scoreAll.user2) {
            let i = user2 - this.scoreAll.user2;
            this.pontuacao.user2 += i;
            this.scoreAll.user2 = user2;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
