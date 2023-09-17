export async function onRequest(context) {
    const url = new URL(context.request.url);
    const userParam = url.searchParams.get("user");

    if (!userParam) {
        return new Response("You need to provide a player")
    }

    let user = await fetch("https://api.chess.com/pub/player/" + userParam + "/stats", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "user-agent": "SergioGlorias"
        }
    }).then(res => res.json())

    if (user.code) {
        return new Response("Player Not Found!")
    }

    let bullet = user.chess_bullet ? user.chess_bullet.last.rating + " Bullet": null
    let blitz = user.chess_blitz ? user.chess_blitz.last.rating + " Blitz": null
    let rapid = user.chess_rapid ? user.chess_rapid.last.rating + " Rapid": null

    if (!bullet && !blitz && !rapid) {
        return new Response(`${userParam} not have game!`)
    }

    let text = ""

    if (bullet) {
        text = text + bullet
    }

    if (blitz) {
        if (text.length) {
            if (rapid) {
                text = text + ", "
            } else {
                text = text + " and "
            }
        }
        text = text + blitz
    }

    if (rapid) {
        if (text.length) {
            text = text + " and "
        }
        text = text + rapid
    }

    return new Response(`${userParam} has ${text}! https://www.chess.com/member/${userParam}`)
}
  