import { signIn } from "@/api/signIn";
import { getUser } from "@/api/user/get";
import { getTeam } from "@/api/team/get";
import { getPlayers } from "@/api/players/get";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { useCookies } from "react-cookie";
import nacl from "tweetnacl";

interface AuthContextType {
  authToken?: string;
  user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const wallet = useWallet();
  const [cookies, setCookie, removeCookie] = useCookies(["auth"]);
  const [user, setUser] = useState<any>();

  const [authToken, setAuthToken] = useState<string>();
  const [isAuthenticating, setAuthenticating] = useState(false);

  const login = async () => {
    if (wallet.publicKey && wallet.signMessage && !isAuthenticating) {
      setAuthenticating(true);

      if (cookies["auth"]) {
        try {
          const {
            token,
            message,
          }: {
            token: string;
            message: string;
          } = cookies["auth"];

          //Above should be replaced with verify by back-end
          const verified = nacl.sign.detached.verify(
            new TextEncoder().encode(message),
            bs58.decode(token),
            bs58.decode(wallet.publicKey.toBase58())
          );

          if (verified) {
            console.log("VERIFIED USER!");
            setAuthToken(token);

            // const user = await getUser(token);
            // const team = await getTeam(token);
            // const players = await getPlayers(token);

            // console.log({
            //   user,
            //   team,
            //   players,
            // });
            return;
          } else {
            removeCookie("auth");
          }
        } catch (err: any) {
          console.log(cookies);
          console.log(err.toString());
          removeCookie("auth");
        }
      }

      try {
        const nonceMessage = Date.now();
        const message = new TextEncoder().encode(nonceMessage.toString());

        const signature = await wallet.signMessage(message);
        const serializedSignature = bs58.encode(signature);

        const jwtToken = await signIn({
          walletAddress: wallet.publicKey.toBase58(),
          signature: serializedSignature,
          timestamp: nonceMessage,
        });

        setCookie(
          "auth",
          {
            token: jwtToken,
            message: nonceMessage,
          },
          {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 4), //4 hours
          }
        );

        // const user = await getUser(jwtToken);
        // const team = await getTeam(jwtToken);
        // const players = await getPlayers(jwtToken);

        // console.log({
        //   user,
        //   team,
        //   players,
        // });

        setAuthToken(jwtToken);
      } catch (err: any) {
        console.log(err);
        wallet.disconnect();
      } finally {
        setAuthenticating(false);
      }
    }
  };

  useEffect(() => {
    if (wallet.connected && !authToken) {
      login();
    }
    if (authToken) {
      getUser(authToken).then((user) => {
        setUser(user);
      });
    }
  }, [wallet.connected, authToken]);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
