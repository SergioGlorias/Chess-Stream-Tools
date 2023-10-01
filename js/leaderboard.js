new Vue({
    el: "#app",
    data: {
        torneio: null,
        leaders: []
    },
    created() {
        // Verifica se há um usuário na URL
        const urlParams = new URLSearchParams(window.location.search);
        const idParam = urlParams.get("id");
        let nbParam = parseInt(urlParams.get("nb")) ?? 5;
        nbParam = nbParam >= 1 ? `?nb=${nbParam}` : ""
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
            fetch("https://lichess.org/api/tournament/" + this.torneio + "/results" + nb)
                .then((response) => response.text())
                .then((d) => {
                    this.leaders = d.split(/\r?\n/).filter(i => i.length).map(m => JSON.parse(m))
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
});
