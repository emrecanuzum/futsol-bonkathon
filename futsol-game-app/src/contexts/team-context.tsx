"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { getTeam } from "@/api/team/get";
import { setPosition } from "@/api/team/setPosition";
import { getPlayers } from "@/api/players/get";
import { useAuth } from "./auth-context";

export interface TeamEntity {
  createdAt: string;
  id: string;
  name: string;
  tactic: string;
  updatedAt: string;
  TeamPlayer: TeamPlayerEntity[];
}

export interface TeamPlayerEntity {
  createdAt: string;
  id: string;
  player: PlayerEntity;
  playerId: string;
  position: string;
  teamId: string;
  updatedAt: string;
}

export interface PlayerEntity {
  id: string;
  name: string;
  position: string;
  stars: number;
  overall: number;
}

interface TeamContextType {
  team: TeamEntity | null;
  setTeam: React.Dispatch<React.SetStateAction<TeamEntity | null>>;
  players: PlayerEntity[];
  fetchTeamData: (token: string) => void;
  fetchPlayersData: (token: string) => void;
  updatePlayerPosition: (
    token: string,
    player_id: string,
    player_position: number
  ) => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeam = (): TeamContextType => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};

export const TeamProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { authToken, user } = useAuth();
  const [team, setTeam] = useState<TeamEntity | null>(null);
  const [players, setPlayers] = useState<PlayerEntity[]>([]);
  const [loadingTeamData, setLoadingTeamData] = useState(true);
  const [loadingPlayerData, setLoadingPlayerData] = useState(true);

  const fetchTeamData = useCallback(async (token: string) => {
    try {
      const fetchedTeam = await getTeam(token);
      setTeam(fetchedTeam);
    } catch (error) {
      console.error("Failed to fetch team:", error);
    } finally {
      setLoadingTeamData(false);
    }
  }, []);

  const fetchPlayersData = async (token: string) => {
    console.log("token: " + token);
    try {
      const fetchedPlayers = await getPlayers(token);
      console.log(fetchedPlayers, token);
      setPlayers(fetchedPlayers);
    } catch (error) {
      console.error("Failed to fetch players:", error);
    } finally {
      setLoadingPlayerData(false);
    }
  };

  useEffect(() => {
    if (authToken && user) {
      try {
        getPlayers(authToken).then((players) => {
          console.log(players, authToken);
          setPlayers(players);
        });
        getTeam(authToken).then((team) => {
          console.log(team, authToken);
          setTeam(team);
        });
      } catch (error) {
        console.error("Failed to fetch team or players:", error);
      } finally {
        setLoadingPlayerData(false);
      }
    }
  }, [authToken, user]);

  const updatePlayerPosition = useCallback(
    async (token: string, player_id: string, player_position: number) => {
      try {
        await setPosition(token, player_id, player_position);
        fetchTeamData(token);
      } catch (error) {
        console.error("Failed to set player position:", error);
      }
    },
    [fetchTeamData]
  );

  return (
    <TeamContext.Provider
      value={{
        team,
        setTeam,
        players,
        fetchTeamData,
        fetchPlayersData,
        updatePlayerPosition,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
