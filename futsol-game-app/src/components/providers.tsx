"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { TeamProvider } from "@/contexts/team-context";
import WalletContextProvider from "@/contexts/wallet-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletContextProvider>
      <AuthProvider>
        <TeamProvider>{children}</TeamProvider>
      </AuthProvider>
    </WalletContextProvider>
  );
}
