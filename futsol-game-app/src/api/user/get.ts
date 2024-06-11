export const getUser = async (token: string) => {
  const response = await fetch(`https://futsol-backend.vercel.app/user/get`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    return await response.json();
  } else {
    throw new Error("Failed to get user");
  }
};
