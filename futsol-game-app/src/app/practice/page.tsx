"use client";
import React, { useEffect, useState } from "react";
import Game from "./game";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useTeam } from "@/contexts/team-context";

const PracticeGamePage = () => {
  const { authToken } = useAuth();
  const { team } = useTeam();
  const router = useRouter();
  const [convertedTeam, setConvertedTeam] = useState<any[]>([]);

  useEffect(() => {
    if (!authToken) {
      router.push("/");
    } else if (team && team.TeamPlayer) {
      const newTeam = team.TeamPlayer.map((playerData) => ({
        name: playerData.player.name,
        position: parseInt(playerData.position.replace("POSITION_", "")),
        star: playerData.player.stars,
        rating: playerData.player.overall,
      }));
      setConvertedTeam(newTeam);
    }
  }, [authToken, team, router]);

  if (authToken && convertedTeam.length > 0) {
    return (
      <div>
        <Game team={convertedTeam} />
      </div>
    );
  } else {
    return <div>Loading or No team available. Please build your team.</div>;
  }
};

export default PracticeGamePage;
