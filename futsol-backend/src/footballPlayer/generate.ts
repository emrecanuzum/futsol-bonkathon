import { FootballPlayer, Position, User } from "@prisma/client";
import { generateRandomBasePlayer } from "../utils/helpers";
import { prisma } from "../../app";


export const generatePlayerForUser = async (position: Position, walletAddress: string) => {
    const basePlayer = generateRandomBasePlayer(position);

    const player = await prisma.footballPlayer.create({
        data: {
            name: basePlayer.name,
            User: {
                connect: {
                    wallet: walletAddress
                }
            },
            stars: basePlayer.stars,
            overall: basePlayer.overall,
            position: basePlayer.position,
            stats: {
                create: {
                    position: basePlayer.position,
                    ...basePlayer.stats
                }
            },
            TeamPlayer: {
                create: [
                ]
            },
        }
    })

    return player;
}

export const generateDraftForUser = async (walletAddress: string) => {
    let GOALKEEPER_COUNT = 1;
    let DEFENSE_COUNT = 4;
    let MIDFIELD_COUNT = 4;
    let ATTACKER_COUNT = 2;

    const basePlayers: ReturnType<typeof generateRandomBasePlayer>[] = [];

    for (let i = 0; i < GOALKEEPER_COUNT; i++) {
        const basePlayer = generateRandomBasePlayer(Position.Goalkeeper);
        basePlayers.push(basePlayer);
    }
    for (let i = 0; i < DEFENSE_COUNT; i++) {
        const basePlayer = generateRandomBasePlayer(Position.Defender);
        basePlayers.push(basePlayer);
    }
    for (let i = 0; i < MIDFIELD_COUNT; i++) {
        const basePlayer = generateRandomBasePlayer(Position.Midfielder);
        basePlayers.push(basePlayer);
    }
    for (let i = 0; i < ATTACKER_COUNT; i++) {
        const basePlayer = generateRandomBasePlayer(Position.Attacker);
        basePlayers.push(basePlayer);
    }

    const draft: FootballPlayer[] = await prisma.$transaction(
        basePlayers.map(basePlayer => {
            return prisma.footballPlayer.create({
                data: {
                    name: basePlayer.name,
                    User: {
                        connect: {
                            wallet: walletAddress
                        }
                    },
                    position: basePlayer.position,
                    stars: basePlayer.stars,
                    overall: basePlayer.overall,
                    stats: {
                        create: {
                            position: basePlayer.position,
                            ...basePlayer.stats
                        }
                    },
                    TeamPlayer: {
                        create: []
                    }
                }
            });
        })
    );

    return draft;
}