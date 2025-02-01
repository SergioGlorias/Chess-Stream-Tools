new Vue({
  el: "#app",
  data: {
    torneio: null,
    leaders: [],
  },
  created() {
    // Verifica se há um usuário na URL
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");
    let nbParam = urlParams.get("nb") ?? "10";
    nbParam = parseInt(nbParam) >= 1 ? `?nb=${nbParam}` : "";
    if (idParam) {
      this.torneio = idParam;

      this.leaderborad(nbParam);

      setInterval(() => {
        this.leaderborad(nbParam);
      }, 30000);
    }
  },
  methods: {
    leaderborad: function (nb) {
      fetch(
        "https://lichess.org/api/tournament/" + this.torneio + "/results" + nb
      )
        .then((response) => response.text())
        .then((d) => d.split(/\r?\n/).filter((i) => i.length).map((m) => JSON.parse(m)).map((j) => j.username))
        .then((d) => fetch("https://lichess.org/api/users", {
          method:"POST",
          body: d.join(",")
        }))
        .then((response) => response.json())
        .then(j => j.map(m => {
          return {
            username: m.username,
            realName: m.profile.realName,
            title: m.title
          }
        })).then(j => {
          this.leaders = j
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
});
