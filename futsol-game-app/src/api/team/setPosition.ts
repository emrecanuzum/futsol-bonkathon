export const setPosition = async (
  token: string,
  player_id: string,
  player_position: number
) => {
  const response = await fetch(
    `https://futsol-backend.vercel.app/team/set-position`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerId: player_id,
        positionID: player_position,
      }),
    }
  );

  if (response.status === 200) {
    return await response.json();
  } else {
    throw new Error("Failed to set position player‘‘");
  }
};
