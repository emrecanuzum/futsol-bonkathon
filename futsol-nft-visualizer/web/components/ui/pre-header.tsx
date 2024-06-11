'use client';
import React from 'react';
import Logo from '../../public/beyaz-logo.png';
import Image from 'next/image';

const PreHeader = () => {
  const content = (
    <div className="flex items-center m-1 gap-2 ml-8">
      <Image src={Logo} alt="logo" width={24} height={24} />
      <p className="text-xs">$PLAYFUTSOL / USDT</p>
    </div>
  );

  // Increase the duplication to ensure there's always enough content to scroll smoothly.
  const items = Array.from({ length: 20 }).flatMap(() => [content]); // Adjust this based on actual width vs. viewport width

  return (
    <div className="mt-0 h-8 bg-secondary overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee">{items}</div>
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 10s linear infinite;
          display: flex;
        }
      `}</style>
    </div>
  );
};

export default PreHeader;
