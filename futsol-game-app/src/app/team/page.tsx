"use client";
import { useTeam } from "@/contexts/team-context";
import React, { useEffect } from "react";
import TeamPage from "./team-page";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const Team = () => {
  const { team } = useTeam();
  const { authToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authToken) {
      router.push("/");
    }
  }, [authToken]);

  if (team && team.TeamPlayer.length > 0) {
    return (
      <>
        <Link
          href={"/"}
          className="border rounded-xl w-min text-center bg-black hover:bg-opacity-70 px-5 py-2 my-4 flex mx-auto"
        >
          Menu
        </Link>
        <div
          className="w-[900px] mx-auto my-auto rounded-xl  text-black bg-none p-4"
          style={{
            backgroundImage: "url(/field.png)",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          <TeamPage />
        </div>
      </>
    );
  } else {
    return (
      <div className="text-center mt-10 grid ">
        You have no team built yet.
        <Link
          className="px-5 py-2 border w-[200px] mx-auto mt-10 border-white rounded-lg"
          href="/team/team-build"
        >
          Build
        </Link>
      </div>
    );
  }
};

export default Team;
