import { useEffect, useState, useMemo } from 'react';
import { LuLoader2 } from 'react-icons/lu';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { DAS } from 'helius-sdk';
import { motion } from 'framer-motion';
import { Position, STAT_TEMPLATES, Stats } from '@/types/player';
import { extractPlayerStats } from '@/utils/helpers';

export function WalletNFTs({ walletAddress }: { walletAddress: string }) {
  const [nfts, setNfts] = useState<DAS.GetAssetResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNFTs = useMemo(
    () => async () => {
      if (!walletAddress) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/api/solana/nfts?owner=${walletAddress}`
        );
        setNfts(response.data);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setNfts([]);
      } finally {
        setIsLoading(false);
      }
    },
    [walletAddress]
  );

  useEffect(() => {
    fetchNFTs();
  }, [fetchNFTs]);

  if (isLoading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LuLoader2 className="animate-spin " size={50} color="#103becB0" />
      </motion.div>
    );

  return (
    <div className="flex flex-wrap justify-center items-center gap-6 max-w-[80%]">
      {nfts.map((nft) => (
        <PlayerCard nft={nft} />
      ))}
    </div>
  );
}

export function PlayerCard({ nft }: { nft: DAS.GetAssetResponse }) {
  if (!nft.content) return <></>;

  const imageURL = '/player-unrevealed.webp';
  // nft.content.links?.image ||
  // 'https://arweave.net/IAb76MvbBFZEd2AeXcKoJEaMoiKhl4JgR_GP-6F1F00';

  const nftTitle = nft.content.metadata.attributes
    ? nft.content.metadata.attributes.find(
        (attr) => (attr as any).trait == 'Name'
      )?.value
    : nft.content.metadata.name;

  const position = nft.content!.metadata.attributes?.find(
    (attr) => (attr as any).trait === 'Position'
  )?.value;

  const stats = extractPlayerStats(nft);

  return (
    <div className="bg-white p-1 shadow-lg rounded-lg text-black w-[210px]">
      <div className="p-1 border-black border-4 shadow-lg rounded-lg flex flex-col items-center w-full">
        <div className="bg-white p-2 rounded-t-lg w-full flex justify-between items-center">
          <span className="font-semibold text-lg">{position}</span>
          <div className="flex items-center justify-center bg-yellow-400 text-black rounded-lg px-2 py-0.5">
            {[
              ...Array(
                nft.content.metadata.attributes?.find(
                  (attr) => (attr as any).trait == 'Stars'
                )?.value || 3
              ),
            ].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
        </div>
        <img
          src={imageURL}
          alt={nftTitle}
          className="w-[184px] h-[184px] object-cove rounded-t-lg mt-2"
        />
        <div className="bg-white w-full py-2 rounded-b-lg">
          <h3 className="text-center text-xl font-semibold mb-2 whitespace-nowrap">
            {nftTitle}
          </h3>
          <div className="flex justify-center items-center w-full gap-1">
            {Object.keys(stats).map((statKey, index) => (
              <div key={index} className="flex justify-between items-center">
                {/* <span className="">{statKey.substring(0, 3).toUpperCase()}:</span>
              <span className="">{stats[statKey as keyof Stats]}</span> */}
                <AttributeCard
                  attr={statKey.substring(0, 3).toUpperCase()}
                  value={stats[statKey as keyof Stats]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AttributeCard({ attr, value }: { attr: string; value: any }) {
  return (
    <div className="flex flex-col bg-black rounded-lg text-white justify-center items-center px-2 py-1">
      <span className="font-semibold">{attr}</span>
      <span>{value}</span>
    </div>
  );
}
