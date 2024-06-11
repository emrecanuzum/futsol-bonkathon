"use client";
import { useEffect, useRef, useState } from "react";
import { opponent } from "./opponent";
import Link from "next/link";

interface GameProps {
  team: any[];
}

export default function Game({ team }: GameProps) {
  const positions = [0, 1, 2, 3, 4];
  const [currentPosition, setCurrentPosition] = useState(3);
  const [attackingTeam, setAttackingTeam] = useState<any>();
  const [defendingTeam, setDefendingTeam] = useState<any>();
  const [isFirstPlayed, setIsFirstPlayed] = useState(false);
  const [minute, setMinute] = useState(0);

  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [teamALogs, setTeamALogs] = useState<string[]>([]);
  const [teamBLogs, setTeamBLogs] = useState<string[]>([]);
  const [minuteLogs, setMinuteLogs] = useState(0);

  const [displayedTeamALogs, setDisplayedTeamALogs] = useState<string[]>([]);
  const [displayedTeamBLogs, setDisplayedTeamBLogs] = useState<string[]>([]);

  const team_a = opponent;
  const team_b = team;

  useEffect(() => {
    if (minute >= 90 && teamAScore !== teamBScore) {
      console.log("Match has ended.");
      return;
    }
  }, [minute, teamAScore, teamBScore]);

  useEffect(() => {
    if (teamALogs.length > displayedTeamALogs.length) {
      const timerId = setTimeout(() => {
        setDisplayedTeamALogs(
          teamALogs.slice(0, displayedTeamALogs.length + 1)
        );
      }, 100);
      return () => clearTimeout(timerId);
    }
  }, [teamALogs, displayedTeamALogs]);

  useEffect(() => {
    if (teamBLogs.length > displayedTeamBLogs.length) {
      const timerId = setTimeout(() => {
        setDisplayedTeamBLogs(
          teamBLogs.slice(0, displayedTeamBLogs.length + 1)
        );
      }, 100);
      return () => clearTimeout(timerId);
    }
  }, [teamBLogs, displayedTeamBLogs]);

  const isFirstPlayedRef = useRef(false);

  useEffect(() => {
    if (!isFirstPlayedRef.current) {
      decideStart();
      isFirstPlayedRef.current = true;
    }
  }, []);

  useEffect(() => {
    setMinuteLogs(minute);
  }, [minute]);

  const decideStart = async () => {
    if (!isFirstPlayed) {
      const selectedTeam = Math.random() < 0.5 ? team_a : team_b;
      setAttackingTeam(selectedTeam);
      if (selectedTeam === team_a) {
        addLog(selectedTeam, `Opponent started the game`);
      } else {
        addLog(selectedTeam, `Your team started the game`);
      }

      MidfieldsGame(selectedTeam);
      setIsFirstPlayed(true);
    }
  };

  useEffect(() => {
    if (minute <= 90) {
      if (currentPosition === 2 && attackingTeam) {
        MidfieldsGame(attackingTeam);
        setMinute(minute + 5);
        console.log(minute);
      }
    } else {
      addLog(attackingTeam, `Match ended`);
    }
  }, [currentPosition, attackingTeam, minute]);

  useEffect(() => {
    if (minute <= 90) {
      if ((currentPosition === 3 || currentPosition === 1) && attackingTeam) {
        AttackersGame(attackingTeam);
        setMinute(minute + 5);
        console.log(minute);
      }
    } else {
      addLog(attackingTeam, `Match ended`);
    }
  }, [currentPosition, minute, attackingTeam]);

  useEffect(() => {
    if ((currentPosition === 4 || currentPosition === 0) && attackingTeam) {
      GoalkeepersGame(attackingTeam);
      setMinute(minute + 5);
      console.log(minute);
    }
  }, [currentPosition, attackingTeam]);

  useEffect(() => {
    setCurrentPosition(2);
    setMinute(minute + 5);
  }, [teamAScore, teamBScore]);

  const rollDice = (star: number) => {
    const max =
      star === 1
        ? 10
        : star === 2
        ? 12
        : star === 3
        ? 14
        : star === 4
        ? 16
        : 18;
    return Math.floor(Math.random() * (max + 1));
  };

  const empty_message = ".  ";
  const addLog = (team: any, message: string) => {
    if (team === team_a) {
      setTeamALogs((prevLogs) => [...prevLogs, message]);
      setTeamBLogs((prevLogs) => [...prevLogs, empty_message]);
    } else {
      setTeamBLogs((prevLogs) => [...prevLogs, message]);
      setTeamALogs((prevLogs) => [...prevLogs, empty_message]);
    }
  };

  const GoalkeepersGame = (attackingTeam: any) => {
    const goalkeeper = (attackingTeam === team_a ? team_b : team_a).find(
      (player: any) => player.position === 1
    );

    if (!goalkeeper) return;

    const defendingTeam = attackingTeam === team_a ? team_b : team_a;
    const defendingPlayer = defendingTeam.find(
      (player: any) => player.position === 2
    );

    if (!defendingPlayer) return;

    addLog(
      attackingTeam,
      `Goalkeeper ${goalkeeper.name} prepares to defend the goal.`
    );

    const saveSuccess = rollDice(goalkeeper.star) > 9;
    if (saveSuccess) {
      addLog(
        attackingTeam,
        `Goalkeeper ${goalkeeper.name} makes an incredible save!`
      );

      setAttackingTeam(defendingTeam);
      addLog(
        defendingTeam,
        `Defender ${defendingPlayer.name} has the ball and is looking to pass.`
      );

      const passSuccess = rollDice(defendingPlayer.star) > 9;
      if (passSuccess) {
        setAttackingTeam(attackingTeam === team_a ? team_b : team_a);
        addLog(
          attackingTeam === team_a ? team_b : team_a,
          `${defendingPlayer.name} makes a successful pass to midfield.`
        );
        setCurrentPosition(2);
        MidfieldsGame(attackingTeam);
      } else {
        setAttackingTeam(attackingTeam === team_a ? team_a : team_b);
        addLog(defendingTeam, `${defendingPlayer.name} fails to make a pass.`);
        setAttackingTeam(attackingTeam === team_a ? team_b : team_a);
        setCurrentPosition(currentPosition);
        AttackersGame(attackingTeam);
      }
      setCurrentPosition(attackingTeam === team_a ? 3 : 1);

      setAttackingTeam(attackingTeam === team_a ? team_b : team_a);
    } else {
      addLog(attackingTeam, `The attacking team scores!`);

      if (attackingTeam === team_a) {
        setTeamAScore((prevScore) => prevScore + 1);
      } else {
        setTeamBScore((prevScore) => prevScore + 1);
      }
      setCurrentPosition(2);

      setAttackingTeam(attackingTeam === team_a ? team_b : team_a);
      addLog(
        attackingTeam === team_a ? team_b : team_a,
        `${
          attackingTeam === team_a ? "Opponent" : "Your team"
        } starts the game!`
      );
    }
  };

  const AttackersGame = (attackingTeam: any) => {
    const defendingTeam = attackingTeam === team_a ? team_b : team_a;
    const defendingPlayer = defendingTeam.find(
      (player: any) => player.position === 2
    );
    const attacker = attackingTeam.find((player: any) => player.position === 4);

    if (!defendingPlayer || !attacker) return;

    addLog(
      attackingTeam,
      `Attacker ${attacker.name} attempts to breach the defense.`
    );

    const attackSuccess = rollDice(attacker.star) > 5;
    if (attackSuccess) {
      addLog(attackingTeam, `${attacker.name} shoots great!`);

      addLog(
        defendingTeam,
        `${defendingPlayer.name} trying to stop ${attacker.name}`
      );
      const defenseRoll = rollDice(defendingPlayer.star);

      if (defenseRoll <= 6) {
        addLog(defendingTeam, `Defense failed`);
        addLog(attackingTeam, "Shoot goes to the goalkeeper");
        setCurrentPosition(attackingTeam === team_a ? 4 : 0);
        GoalkeepersGame(attackingTeam);
      } else {
        addLog(
          defendingTeam,
          `${defendingPlayer.name} successfully defended the ball!`
        );
        setAttackingTeam(defendingTeam);
        addLog(
          defendingTeam,
          `Defender ${defendingPlayer.name} has the ball and is looking to pass.`
        );

        const passSuccess = rollDice(defendingPlayer.star) > 9;
        if (passSuccess) {
          setAttackingTeam(attackingTeam === team_a ? team_b : team_a);
          addLog(
            attackingTeam === team_a ? team_b : team_a,
            `${defendingPlayer.name} makes a successful pass to midfield.`
          );
          setCurrentPosition(2);
        } else {
          setAttackingTeam(attackingTeam === team_a ? team_a : team_b);
          addLog(
            defendingTeam,
            `${defendingPlayer.name} fails to make a pass.`
          );
          setAttackingTeam(attackingTeam === team_a ? team_b : team_a);
          setCurrentPosition(currentPosition);
          AttackersGame(attackingTeam);
        }
      }
    } else {
      addLog(attackingTeam, `${attacker.name} is stopped by the defense.`);
      setAttackingTeam(attackingTeam === team_a ? team_b : team_a);
      const passSuccess = rollDice(defendingPlayer.star) > 9;
      if (passSuccess) {
        addLog(
          defendingTeam,
          `${defendingPlayer.name} makes a successful pass to midfield.`
        );
        setCurrentPosition(2);
        setAttackingTeam(attackingTeam === team_a ? team_b : team_a);
      } else {
        addLog(defendingTeam, `${defendingPlayer.name} fails to make a pass.`);
        setCurrentPosition(currentPosition);
        setAttackingTeam(attackingTeam === team_a ? team_b : team_a);
        AttackersGame(attackingTeam);
      }
    }
  };

  const MidfieldsGame = (attackingTeam: any) => {
    setAttackingTeam(attackingTeam);
    console.log(attackingTeam);
    const defendingTeam = attackingTeam === team_a ? team_b : team_a;
    const attackingPlayer = attackingTeam.find(
      (player: any) => player.position === 3
    );
    const defendingPlayer = defendingTeam.find(
      (player: any) => player.position === 3
    );

    if (!attackingPlayer || !defendingPlayer) return;

    addLog(attackingTeam, `Ball is with ${attackingPlayer.name}!`);

    const passRoll = rollDice(attackingPlayer.star);
    if (passRoll > 5) {
      addLog(
        attackingTeam,
        `${attackingPlayer.name} shoots a great pass! (${passRoll}/${attackingPlayer.star})`
      );

      addLog(
        defendingTeam,
        `${defendingPlayer.name} trying to stop ${attackingPlayer.name}`
      );

      const defenseRoll = rollDice(defendingPlayer.star);
      if (defenseRoll <= 6) {
        addLog(defendingTeam, `Defense failed`);

        addLog(attackingTeam, "The attack continues...");
        setCurrentPosition(attackingTeam === team_a ? 3 : 1);
        AttackersGame(attackingTeam);
      } else {
        addLog(defendingTeam, `${defendingPlayer.name} successfully defended!`);
        setAttackingTeam(defendingTeam);
        setCurrentPosition(
          attackingTeam === team_a ? currentPosition - 1 : currentPosition + 1
        );
      }
    } else {
      addLog(attackingTeam, `${attackingPlayer.name} failed to pass...`);
      setAttackingTeam(defendingTeam);
    }
  };

  if (team.length > 0) {
    return (
      <main className="bg-neutral-500 overflow-hidden h-screen">
        <div className="container mx-auto pt-[10vh]  justify-center">
          <Link
            href={"/"}
            className="border rounded-xl w-min text-center bg-black hover:bg-opacity-70 px-5 py-2 my-2 flex mx-auto"
          >
            Menu
          </Link>
          <div className="border justify-center mx-auto overflow-auto  bg-neutral-900 rounded-lg border-black h-[70vh] w-[90vw] md:w-[60vw]">
            <div className="score-part text-center items-center border-b border-black bg-neutral-900">
              <h1 className="text-xl grid grid-cols-2 ">
                <div className="border-r border-black py-5">
                  {"Opponent"}
                  <p className="font-semibold text-4xl">{teamAScore}</p>
                </div>
                <div className="py-5">
                  {"Your Team"}
                  <p className="font-semibold text-4xl">{teamBScore}</p>
                </div>
              </h1>
            </div>
            <div className="game-part w-full h-[80%]">
              <div className="grid grid-cols-2 w-full h-full">
                <div className="team_a-side border-r border-black h-full">
                  {displayedTeamALogs.map((log, index) => (
                    <p className="text-xs text-center" key={index}>
                      {log}
                    </p>
                  ))}
                </div>
                <div className="team_b-side h-full">
                  {displayedTeamBLogs.map((log, index) => (
                    <p className="text-xs text-center" key={index}>
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } else {
    return <div className="">build team</div>;
  }
}
