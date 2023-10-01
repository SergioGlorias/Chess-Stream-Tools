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
        let nbParam = urlParams.get("nb") ?? "5";
        nbParam = nbParam !== "0" ? `?nb=${nbParam}` : ""
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
                    let array = d.split(/\r?\n/).filter(i => i.length)
                    let le = []
                    console.log(array)
                    for (const i of array) {
                        let json = JSON.parse(i)

                        le.push(json)
                    }

                    this.leaders = le
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
});
