new Vue({
    el: "#app",
    data: {
        jogadorSelecionado: null,
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
        const userParam = urlParams.get("user");
        if (userParam) {
            this.jogadorSelecionado = userParam;
            if (urlParams.get("w"))
                this.pontuacao.vitorias = Number(urlParams.get("w"));
            if (urlParams.get("d"))
                this.pontuacao.empates = Number(urlParams.get("d"));
            if (urlParams.get("l"))
                this.pontuacao.derrotas = Number(urlParams.get("l"));
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
            fetch("https://lichess.org/api/user/" + this.jogadorSelecionado)
                .then((response) => response.json())
                .then((data) => {
                    this.scoreAll.vitorias = data.count.win;
                    this.scoreAll.empates = data.count.draw;
                    this.scoreAll.derrotas = data.count.loss;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        atualizaPontuacao: function () {
            fetch("https://lichess.org/api/user/" + this.jogadorSelecionado)
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
                    console.log(error);
                });
        },
    },
});
