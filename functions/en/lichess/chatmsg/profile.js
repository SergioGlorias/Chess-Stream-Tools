export async function onRequest(context) {
    const url = new URL(context.request.url);
    const userParam = url.searchParams.get("user");

    if (!userParam) {
        return new Response("You need to provide a player")
    }

    let user = await fetch("https://lichess.org/api/user/" + userParam, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    }).then(res => res.json())

    if (user.error) {
        return new Response("Player Not Found!")
    }

    if (user.tosViolation) {
        return new Response(`${user.username} It has a red mark!`)
    }
    
    return new Response(`${user.username} has ${user.perfs.bullet.rating}${user.perfs.bullet.prov ? "?" : ""} Bullet, ${user.perfs.blitz.rating}${user.perfs.blitz.prov ? "?" : ""} Blitz, ${user.perfs.rapid.rating}${user.perfs.rapid.prov ? "?" : ""} Rapid e ${user.perfs.classical.rating}${user.perfs.classical.prov ? "?" : ""} Classical! https://lichess.org/@/${user.username}`)

}
  