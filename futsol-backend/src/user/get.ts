import bs58 from "bs58";
import express from "express";
import nacl from "tweetnacl";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../app";
import { createUser } from "./create";

export const queryUser = async (wallet: string) => (await prisma.user.findUnique({
    where: {
        wallet
    }
}));

export const getUser: express.RequestHandler = async (
    request,
    response
) => {
    try {
        const jwtToken = request.get("Authorization")!.split("Bearer ")[1];
        const { wallet } = jwt.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;

        let user = await queryUser(wallet);

        if (!user) {
            user = await createUser(wallet);
        }

        return response.status(200).json(user);
    }
    catch (error: any) {
        console.error(error);
        return response.status(500).send("Internal Server Error: " + error.toString());
    }
}