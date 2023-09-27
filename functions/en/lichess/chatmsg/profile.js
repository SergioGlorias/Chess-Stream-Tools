export async function onRequest(context) {
    const url = new URL(context.request.url);
    const userParam = url.searchParams.get("user");

    if (!userParam) {
        return new Response("You need to provide a player")
    }

    let user = await fetch("https://lichess.org/api/user/" + userParam, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "user-agent": context.env.LICHESS_USER_AGENT
        }
    }).then(res => res.json())

    if (user.error) {
        return new Response("Player Not Found!")
    }

    if (user.tosViolation) {
        return new Response(`${user.username} It has a red mark!`)
    }

    let bullet      = user.perfs.bullet.games       != 0    ? `${user.perfs.bullet.rating}${user.perfs.bullet.prov ? "?" : ""} Bullet`              : null
    let blitz       = user.perfs.blitz.games        != 0    ? `${user.perfs.blitz.rating}${user.perfs.blitz.prov ? "?" : ""} Blitz`                 : null
    let rapid       = user.perfs.rapid.games        != 0    ? `${user.perfs.rapid.rating}${user.perfs.rapid.prov ? "?" : ""} Rapid`                 : null
    let classical   = user.perfs.classical.games    != 0    ? `${user.perfs.classical.rating}${user.perfs.classical.prov ? "?" : ""} Classical`     : null

    let msg = ""

    if (bullet) {
        msg += bullet
    }

    if (blitz) {
        if (msg.length !== 0) {
            if (rapid || classical) {
                msg += ", "
            } else {
                msg += " and "
            }
        }
        msg += blitz
    }

    if (rapid) {
        if (msg.length !== 0) {
            if (classical) {
                msg += ", "
            } else {
                msg += " and "
            }
        }
        msg += rapid
    }

    if (classical) {
        if (msg.length !== 0) {
            msg += " and "
        }
        msg += classical
    }
    
    return new Response(`${user.username} has ${msg}! https://lichess.org/@/${user.username}`)

}
  