export async function onRequest(context) {
  const url = new URL(context.request.url);
  const userParam = url.searchParams.get("user");

  if (!userParam) {
    return new Response("Você precisa fornecer o id num jogador");
  }

  let user = await fetch(
    `https://fide-api.vercel.app/player_info/?fide_id=${userParam}&history=true`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }
  ).then((res) => res.json());

  if (user.error) {
    return new Response("Jogador não encontrado!");
  }

  let ranting = user.history[0];

  let lastName = user.name.split(", ")[0];
  let firstName = user.name.split(", ")[1].split(" ")[0];
  let name = `${lastName}, ${firstName}`;

  return new Response(
    `${name} has ${ranting.blitz_rating} Blitz, ${ranting.rapid_rating} Rapid and ${ranting.classical_rating} Classical! https://ratings.fide.com/profile/${userParam}/chart`
  );
}
