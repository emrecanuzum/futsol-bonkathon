import bs58 from "bs58";
import express from "express";
import nacl from "tweetnacl";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../app";
import Joi from "joi";

const UserUpdateSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30),

    profileImg: Joi.string().uri().allow(null)
});

export const updateUser: express.RequestHandler = async (
    request,
    response
) => {
    try {
        const jwtToken = request.get("Authorization")!.split("Bearer ")[1];
        const { wallet } = jwt.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;

        let user = await prisma.user.findUnique({
            where: {
                wallet
            }
        });

        if (!user) {
            return response.status(400).json({ error: "User does not exists!" });
        }

        const payload = UserUpdateSchema.validate(request.body);

        if (payload.error) {
            return response.status(400).json(payload.error);
        }

        user = await prisma.user.update({
            where: {
                wallet
            },
            data: {
                username: payload.value.username ? payload.value.username : user.username,
                profileImg: payload.value.profileImg ? payload.value.profileImg : user.profileImg
            }
        })

        return response.status(200).json({
            user
        });
    }
    catch (error: any) {
        return response.status(500).send("Internal Server Error: " + error.toString());
    }
}