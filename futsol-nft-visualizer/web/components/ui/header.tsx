import React from 'react';
import Logo from '../../public/beyaz-logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { BsTwitterX } from 'react-icons/bs';
import { FaMedium } from 'react-icons/fa';
import { WalletButton } from '../solana/solana-provider';

const HeaderComponent = () => {
  return (
    <div className="w-full h-28  bg-primary">
      <div className="w-full px-5 md:px-20 mx-auto">
        <div className="items-center flex justify-between">
          <div className="flex items-center">
            <Image src={Logo} className="h-20 w-20 my-4" alt="logo"></Image>
            <div className="flex gap-5 ml-16 md:text-2xl">
              <Link className="hover:text-aquagreen" href={'/home'}>
                Home
              </Link>
              <p className="hover:text-aquagreen cursor-not-allowed text-2xl opacity-50">
                About
              </p>
              <p className="hover:text-aquagreen cursor-not-allowed text-2xl opacity-50">
                My Team
              </p>
              <p className="hover:text-aquagreen cursor-not-allowed text-2xl opacity-50">
                League
              </p>

              {/* <Link
                className="hover:text-aquagreen cursor-not-allowed opacity-50"
                href={"/about"}
              >
                About
              </Link>
              <Link
                className="hover:text-aquagreen cursor-not-allowed opacity-50"
                href={"/team"}
              >
                My Team
              </Link>
              <Link
                className="hover:text-aquagreen cursor-not-allowed opacity-50"
                href={"/league"}
              >
                League
              </Link> */}
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex gap-3 items-center">
              <Link
                className=" flex items-center"
                href={'https://twitter.com/playfutsol'}
                target="blank"
              >
                <BsTwitterX className="text-aquagreen " size={20} />
              </Link>

              <Link
                className=" flex items-center"
                href={'https://medium.com/@playfutsol'}
                target="blank"
              >
                <FaMedium className=" text-aquagreen" size={24} />
              </Link>
            </div>
            <WalletButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderComponent;
