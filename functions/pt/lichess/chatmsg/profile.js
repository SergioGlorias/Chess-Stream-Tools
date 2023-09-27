export async function onRequest(context) {
    const url = new URL(context.request.url);
    const userParam = url.searchParams.get("user");

    if (!userParam) {
        return new Response("Você precisa fornecer um jogador")
    }

    let user = await fetch("https://lichess.org/api/user/" + userParam, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "user-agent": context.env.LICHESS_USER_AGENT
        }
    }).then(res => res.json())

    if (user.error) {
        return new Response("Jogador não encontrado!")
    }

    if (user.tosViolation) {
        return new Response(`${user.username} está com uma marca vermelha!`)
    }

    let bullet      = user.perfs.bullet.games       != 0    ? `${user.perfs.bullet.rating}${user.perfs.bullet.prov ? "?" : ""} Bullet`             : null
    let blitz       = user.perfs.blitz.games        != 0    ? `${user.perfs.blitz.rating}${user.perfs.blitz.prov ? "?" : ""} Rápidas`              : null
    let rapid       = user.perfs.rapid.games        != 0    ? `${user.perfs.rapid.rating}${user.perfs.rapid.prov ? "?" : ""} Semi-Rápidas`         : null
    let classical   = user.perfs.classical.games    != 0    ? `${user.perfs.classical.rating}${user.perfs.classical.prov ? "?" : ""} Classicas`    : null

    let msg = ""

    if (bullet) {
        msg += bullet
    }

    if (blitz) {
        if (msg.length !== 0) {
            if (rapid || classical) {
                msg += ", "
            } else {
                msg += " e "
            }
        }
        msg += blitz
    }

    if (rapid) {
        if (msg.length !== 0) {
            if (classical) {
                msg += ", "
            } else {
                msg += " e "
            }
        }
        msg += rapid
    }

    if (classical) {
        if (msg.length !== 0) {
            msg += " e "
        }
        msg += classical
    }

    return new Response(`${user.username} tem ${msg}! https://lichess.org/@/${user.username}`)

}
  