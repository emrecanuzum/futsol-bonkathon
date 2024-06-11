"use client";
import React, { useEffect, useState } from "react";
import { useTeam } from "@/contexts/team-context";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { VscLoading } from "react-icons/vsc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const positions = [
  { label: "Attacker 1", position: 10, gridColumn: "col-start-2 col-end-3" },
  { label: "Attacker 2", position: 11, gridColumn: "col-start-4 col-end-5" },
  { label: "Midfielder 1", position: 6, gridColumn: "col-start-1 col-end-2" },
  { label: "Midfielder 2", position: 7, gridColumn: "col-start-2 col-end-3" },
  { label: "Midfielder 3", position: 8, gridColumn: "col-start-4 col-end-5" },
  { label: "Midfielder 4", position: 9, gridColumn: "col-start-5 col-end-6" },
  { label: "Defender 1", position: 2, gridColumn: "col-start-1 col-end-2" },
  { label: "Defender 2", position: 3, gridColumn: "col-start-2 col-end-3" },
  { label: "Defender 3", position: 4, gridColumn: "col-start-4 col-end-5" },
  { label: "Defender 4", position: 5, gridColumn: "col-start-5 col-end-6" },
  { label: "Goalkeeper", position: 1, gridColumn: "col-start-3 col-end-4" },
];

const positionMap: Record<string, number> = {
  Goalkeeper: 1,
  Defender: 2,
  Midfielder: 3,
  Attacker: 4,
};

const TeamBuildForm = () => {
  const { players, updatePlayerPosition, setTeam } = useTeam();
  const { authToken } = useAuth();

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>(
    new Array(11).fill("")
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (index: number, value: string) => {
    const updatedPlayers = [...selectedPlayers];
    updatedPlayers[index] = value;
    setSelectedPlayers(updatedPlayers);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedPlayers.includes("")) {
      setError("Please fill all positions.");
      return;
    }

    const uniquePlayers = new Set(selectedPlayers);
    if (uniquePlayers.size !== selectedPlayers.length) {
      setError("Each player can only be selected once.");
      return;
    }

    const team = selectedPlayers.map((id, index) =>
      players.find((player) => player.id === id)
    );

    if (authToken) {
      setLoading(true);
      for (let i = 0; i < team.length; i++) {
        const player = team[i];
        if (player) {
          await updatePlayerPosition(
            authToken,
            player.id,
            positions[i].position
          );
        }
      }
      setLoading(false);
      setSuccess(true);
    }

    setTeam(team as any);
    console.log(team);
  };

  const getPlayersByPosition = (
    positionCode: number,
    selectedPlayers: string[]
  ) => {
    return players.filter(
      (player) =>
        positionMap[player.position] === positionCode &&
        !selectedPlayers.includes(player.id)
    );
  };

  return (
    <div className="text-black">
      {loading && (
        <div className="w-[900px] h-screen absolute bg-black bg-opacity-50">
          <VscLoading
            color="white"
            size={80}
            className=" animate-spin flex mx-auto mt-24 "
          />
        </div>
      )}
      {success && (
        <div className="w-[900px] border pt-10 h-screen absolute bg-black bg-opacity-50">
          <div className="border mx-auto p-4 rounded-xl bg-green-100 w-[300px] h-[200px]">
            {/* <div
              onClick={() => setSuccess(false)}
              className="absolute top-10 w-[300px] right-10 text-black"
              style={{ contain: "content" }}
            >
              <p>X</p>
            </div> */}

            <div className="grid">
              <p className="mt-10 text-center">Team successfully updated</p>
              <Link
                className=" text-center mt-10 border rounded-xl bg-black text-white px-5 py-3"
                href={"/team"}
              >
                Go To Team
              </Link>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-4 px-10">
        {error && (
          <div className="text-red-500  mt-4  absolute bg-black px-5 py-2 rounded-xl border col-span-5">
            {error}
          </div>
        )}
        {positions.map((pos, posIndex) => (
          <div
            key={posIndex}
            className={`text-center border bg-black bg-opacity-50 text-white p-4 rounded-lg mt-16 grid ${pos.gridColumn}`}
          >
            <label className="block">{pos.label}</label>
            <select
              value={selectedPlayers[posIndex]}
              onChange={(e) => handleChange(posIndex, e.target.value)}
              className="mt-1 block w-full text-black"
            >
              <option value="">Select Player</option>
              {getPlayersByPosition(
                positionMap[pos.label.split(" ")[0]],
                selectedPlayers
              ).map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          type="submit"
          className="col-span-5 block text-center text-white hover:bg-neutral-900 rounded-xl border bg-black px-5 py-2 w-1/4 mx-auto"
        >
          Save Team
        </button>
      </form>
    </div>
  );
};

export default TeamBuildForm;
