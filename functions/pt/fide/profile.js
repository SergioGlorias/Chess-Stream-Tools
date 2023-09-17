export async function onRequest(context) {
    const url = new URL(context.request.url);
    const userParam = url.searchParams.get("user");

    if (!userParam) {
        return new Response("Você precisa fornecer o id num jogador")
    }

    let user = await fetch(`https://fide-api.vercel.app/player_info/?fide_id=${userParam}&history=true`, {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    }).then(res => res.json())

    if (user.error) {
        return new Response("Jogador não encontrado!")
    }
    
    let ranting = user.history[0]

    return new Response(`${user.name} tem ${ranting.blitz_rating} Rápidas, ${ranting.rapid_rating} Semi-Rápidas e ${ranting.classical_rating} Classicas! https://ratings.fide.com/profile/${userParam}/chart`)

}
  