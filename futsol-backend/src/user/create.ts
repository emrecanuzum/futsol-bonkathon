import bs58 from "bs58";
import express from "express";
import nacl from "tweetnacl";
import jwt from "jsonwebtoken";
import { prisma } from "../../app";
import { generateDraftForUser } from "../footballPlayer/generate";
import { createTeam } from "../team/create";
import { User } from "@prisma/client";

export const createUser = async (wallet: string): Promise<User> => {
    let user = await prisma.user.findUnique({
        where: {
            wallet
        }
    });

    if (user) {
        return user;
    }

    user = await prisma.user.create({
        data: {
            wallet
        }
    });

    //Create default draft and team for user
    await createTeam(wallet);
    await generateDraftForUser(wallet);


    if (!user) {
        throw new Error("User could not be created for an unknown reason!");
    }

    return user;
}