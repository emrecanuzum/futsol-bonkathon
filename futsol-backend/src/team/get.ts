import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../app";

export const queryTeamForUser = async (wallet: string) => (await prisma.user.findUnique({
    where: {
        wallet: wallet,
    },
    include: {
        team: {
            include: {
                TeamPlayer: {
                    include: {
                        player: true
                    }
                }
            }
        }
    },
}))?.team;

export const getTeam: express.RequestHandler = async (
    request,
    response
) => {
    try {
        const jwtToken = request.get("Authorization")!.split("Bearer ")[1];
        const { wallet } = jwt.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;

        const team = await queryTeamForUser(wallet);

        if (!team) {
            return response.status(404).send("User does not have a team.");
        }

        return response.status(200).json(team);
    }
    catch (error: any) {
        return response.status(500).send("Internal Server Error: " + error.toString());
    }
}