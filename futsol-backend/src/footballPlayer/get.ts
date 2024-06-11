import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../app";

export const queryPlayersForUser = async (wallet: string) => (await prisma.user.findUnique({
    where: {
        wallet: wallet,
    },
    include: {
        players: true
    },
}))?.players;

export const getUserPlayers: express.RequestHandler = async (
    request,
    response
) => {
    try {
        const jwtToken = request.get("Authorization")!.split("Bearer ")[1];
        const { wallet } = jwt.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;

        const players = await queryPlayersForUser(wallet);

        if (!players) {
            return response.status(404).send("User does not have any players.");
        }

        return response.status(200).json(players);
    }
    catch (error: any) {
        return response.status(500).send("Internal Server Error: " + error.toString());
    }
}