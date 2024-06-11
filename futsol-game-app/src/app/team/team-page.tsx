"use client";
import React, { useEffect } from "react";
import { useTeam } from "@/contexts/team-context";
import Link from "next/link";

const positions = [
  {
    label: "Forward 1",
    position: "POSITION_10",
    gridColumn: "col-start-2 col-end-3",
  },
  {
    label: "Forward 2",
    position: "POSITION_11",
    gridColumn: "col-start-4 col-end-5",
  },
  {
    label: "Midfielder 1",
    position: "POSITION_6",
    gridColumn: "col-start-1 col-end-2",
  },
  {
    label: "Midfielder 2",
    position: "POSITION_7",
    gridColumn: "col-start-2 col-end-3",
  },
  {
    label: "Midfielder 3",
    position: "POSITION_8",
    gridColumn: "col-start-4 col-end-5",
  },
  {
    label: "Midfielder 4",
    position: "POSITION_9",
    gridColumn: "col-start-5 col-end-6",
  },
  {
    label: "Defender 1",
    position: "POSITION_2",
    gridColumn: "col-start-1 col-end-2",
  },
  {
    label: "Defender 2",
    position: "POSITION_3",
    gridColumn: "col-start-2 col-end-3",
  },
  {
    label: "Defender 3",
    position: "POSITION_4",
    gridColumn: "col-start-4 col-end-5",
  },
  {
    label: "Defender 4",
    position: "POSITION_5",
    gridColumn: "col-start-5 col-end-6",
  },
  {
    label: "Goalkeeper",
    position: "POSITION_1",
    gridColumn: "col-start-3 col-end-4",
  },
];

const TeamPage = () => {
  const { team } = useTeam();

  useEffect(() => {
    console.log("Current Team:", team);
  }, [team]);

  if (team && team.TeamPlayer.length > 0) {
    let positionCounters: { [key: string]: number } = {
      POSITION_1: 0,
      POSITION_2: 0,
      POSITION_3: 0,
      POSITION_4: 0,
      POSITION_5: 0,
      POSITION_6: 0,
      POSITION_7: 0,
      POSITION_8: 0,
      POSITION_9: 0,
      POSITION_10: 0,
      POSITION_11: 0,
    };

    const playerPositions = positions.map((pos) => {
      const teamPlayers = team.TeamPlayer.filter(
        (p) => p.position === pos.position
      );
      const player = teamPlayers[positionCounters[pos.position]];
      positionCounters[pos.position] += 1;
      return {
        ...pos,
        player: player ? player.player : null,
      };
    });

    return (
      <div className="mx-auto my-auto rounded-xl text-white bg-none p-4">
        <h1 className="text-center text-3xl font-bold mb-4">Your Team</h1>
        <div className="grid w-full grid-cols-5 gap-4">
          {playerPositions.map((pos, posIndex) => (
            <div key={posIndex} className={`grid ${pos.gridColumn}`}>
              <div className="bg-black bg-opacity-50 w-[160px] mt-4 p-2 border border-black border-opacity-60 shadow-md shadow-black rounded text-center">
                <div className="border-b">{pos.label}</div>
                {pos.player ? (
                  <div>
                    <div>{"⭐".repeat(pos.player.stars)}</div>
                    <div>{pos.player.name}</div>
                    <div>{pos.player.overall}</div>
                  </div>
                ) : (
                  <div className="text-gray-500">No player</div>
                )}
              </div>
            </div>
          ))}
        </div>
        <Link
          className="block mt-4 text-center text-white hover:bg-neutral-900 rounded-xl border bg-black px-5 py-2 w-1/4 mx-auto"
          href="/team/team-build"
        >
          Edit Team
        </Link>
      </div>
    );
  } else {
    return (
      <div className="text-center">
        You have no team built yet.
        <Link
          className="px-5 py-2 border border-white rounded-lg"
          href="/team/team-build"
        >
          Build
        </Link>
      </div>
    );
  }
};

export default TeamPage;
