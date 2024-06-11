export const getPlayers = async (token: string) => {
  const response = await fetch(
    `https://futsol-backend.vercel.app/players/get`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status === 200) {
    return await response.json();
  } else {
    throw new Error("Failed to get players‘‘");
  }
};
