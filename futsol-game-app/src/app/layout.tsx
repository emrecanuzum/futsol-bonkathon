"use client";
import React, { useState, useEffect } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
require("@solana/wallet-adapter-react-ui/styles.css");

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Futsol Game App",
//   description: "play futsol here",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 700);
    };

    handleResize(); // Check the initial window size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <html lang="en">
      <Providers>
        <body className={inter.className}>
          {isSmallScreen ? (
            <div className="">
              you cant play this game with this browser width
            </div>
          ) : (
            children
          )}
        </body>
      </Providers>
    </html>
  );
}
