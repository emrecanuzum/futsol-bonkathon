export const signIn = async ({
  timestamp,
  signature,
  walletAddress,
}: {
  timestamp: number;
  signature: string;
  walletAddress: string;
}) => {
  const response = await fetch(`https://futsol-backend.vercel.app/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timestamp,
      signature,
      walletAddress,
    }),
  });

  if (response.ok) {
    return (await response.text()) as string;
  } else {
    throw new Error("Failed to sign in");
  }
};
