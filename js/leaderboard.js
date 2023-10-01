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
        const nbParam = urlParams.get("nb") ?? "5";
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
            fetch("https://lichess.org/api/tournament/" + this.torneio + "/results?nb=" + nb)
                .then((response) => response.text())
                .then((data) => {
                    let array = data.split(/\r?\n/).filter(i => i.length)
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
