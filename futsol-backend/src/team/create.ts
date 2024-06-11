import { FootballPlayer, Position } from "@prisma/client";
import { prisma } from "../../app";
import { generateDraftForUser, generatePlayerForUser } from "../footballPlayer/generate";

export const createTeam = async (walletAddress: string) => {
    const team = await prisma.team.create({
        data: {
            User: {
                connect: {
                    wallet: walletAddress
                }
            },
            TeamPlayer: {
                create: [
                ]
            },
        }
    });

    return team;
}