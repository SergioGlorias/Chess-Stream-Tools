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
        if (idParam) {
            this.torneio = idParam;

            this.leaderborad();

            setInterval(() => {
                this.leaderborad();
            }, 30000);
        }
    },
    methods: {
        leaderborad: function () {
            fetch("https://lichess.org/api/tournament/" + this.torneio + "/results?nb=5")
                .then((response) => response.text())
                .then((data) => {
                    let array = data.split(/\r?\n/)
                    let le = []
                    for (const i of array) {
                        let json = JSON.parse(i)

                        le.push({
                            rank: json.rank + "º",
                            score: json.score,
                            user: `${json.title ?? ""} ${json.username}`.trim()
                        })
                    }

                    this.leaders = le
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
});
