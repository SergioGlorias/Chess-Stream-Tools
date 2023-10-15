export async function onRequest(context) {
  const url = new URL(context.request.url);
  const userParam = url.searchParams.get("user");

  if (!userParam) {
    return new Response("Você precisa fornecer um jogador");
  }

  let user = await fetch(
    "https://api.chess.com/pub/player/" + userParam + "/stats",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "user-agent": context.env.CHESSCOM_USER_AGENT,
      },
    }
  ).then((res) => res.json());

  if (user.code) {
    return new Response("Jogador não encontrado!");
  }

  let bullet = user.chess_bullet
    ? user.chess_bullet.last.rating + " Bullet"
    : null;
  let blitz = user.chess_blitz
    ? user.chess_blitz.last.rating + " Rapidas"
    : null;
  let rapid = user.chess_rapid
    ? user.chess_rapid.last.rating + " Semi-Rapidas"
    : null;

  if (!bullet && !blitz && !rapid) {
    return new Response(`${userParam} não tem jogos!`);
  }

  let text = "";

  if (bullet) {
    text = text + bullet;
  }

  if (blitz) {
    if (text.length) {
      if (rapid) {
        text = text + ", ";
      } else {
        text = text + " e ";
      }
    }
    text = text + blitz;
  }

  if (rapid) {
    if (text.length) {
      text = text + " e ";
    }
    text = text + rapid;
  }

  return new Response(
    `${userParam} tem ${text}! https://www.chess.com/member/${userParam}`
  );
}
