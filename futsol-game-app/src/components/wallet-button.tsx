"use client";

import dynamic from "next/dynamic";
import React from "react";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export default function WalletButton() {
  return (
    <div className="relative z-[98] rounded-lg bg-primary-gradient hover:!bg-secondary">
      <WalletMultiButtonDynamic className="wallet-connection-button flex w-full items-center justify-center break-keep  rounded-[120px]  px-[36px] py-[18px] text-sm  text-white" />
    </div>
  );
}
