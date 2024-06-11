'use client';

import { WalletNFTs } from '@/components/WalletNFTs';
import { WalletButton } from '@/components/solana/solana-provider';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { LuLoader2 } from 'react-icons/lu';

export default function Page() {
  const wallet = useWallet();

  const stateComponent = useMemo(() => {
    if (wallet.connecting) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LuLoader2 className="animate-spin " size={50} color="#103becB0" />
        </motion.div>
      );
    } else if (!wallet.connected) {
      return <WalletButton />;
    } else if (wallet.publicKey) {
      return <WalletNFTs walletAddress={wallet.publicKey.toBase58()} />;
    } else {
      return <>Unexpected error occurred!</>;
    }
  }, [wallet.connected, wallet.connecting]);

  return (
    <div className="min-h-[calc(100vh_-_144px)] w-full flex justify-center items-center overflow-scroll my-4">
      {stateComponent}
    </div>
  );
}
