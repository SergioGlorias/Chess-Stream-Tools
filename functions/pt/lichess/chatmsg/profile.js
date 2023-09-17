export async function onRequest(context) {
    const url = new URL(context.request.url);
    const userParam = url.searchParams.get("user");

    if (!userParam) {
        return new Response("Você precisa fornecer um jogador")
    }

    let user = await fetch("https://lichess.org/api/user/" + userParam, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    }).then(res => res.json())

    if (user.error) {
        return new Response("Jogador não encontrado!")
    }

    if (user.tosViolation) {
        return new Response(`${user.username} está com uma marca vermelha!`)
    }
    
    return new Response(`${user.username} tem ${user.perfs.bullet.rating}${user.perfs.bullet.prov ? "?" : ""} Bullet, ${user.perfs.blitz.rating}${user.perfs.blitz.prov ? "?" : ""} Rápidas, ${user.perfs.rapid.rating}${user.perfs.rapid.prov ? "?" : ""} Semi-Rápidas e ${user.perfs.classical.rating}${user.perfs.classical.prov ? "?" : ""} Classicas! https://lichess.org/@/${user.username}`)

}
  