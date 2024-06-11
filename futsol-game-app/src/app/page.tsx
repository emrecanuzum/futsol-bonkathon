import WalletButton from "@/components/wallet-button";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_LINKS = [
  {
    title: "Practice",
    href: "/practice",
  },
  {
    title: "League",
    href: "/league",
  },
  {
    title: "Team",
    href: "/team",
  },
  {
    title: "Shop",
    href: "/",
  },
];

export default function Home() {
  return (
    <div className="flex mx-auto justify-center my-auto items-center mt-24 h-full">
      <div className="grid gap-6 grid-cols-2">
        {DEFAULT_LINKS.map((link) => (
          <Link
            href={link.href}
            key={link.title}
            className="text-center hover:bg-slate-100 hover:cursor-pointer hover:text-blue-950 text-4xl px-5 py-2 border rounded-lg border-white"
          >
            {link.title}
          </Link>
        ))}

        <div className="col-span-2 text-center">
          <div style={{ display: "inline-block" }}>
            <WalletButton />
          </div>
        </div>
      </div>
    </div>
  );
}
