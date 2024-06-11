import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../app";
import { queryTeamForUser } from "./get";
import Joi from "joi";
import { PositionID } from "@prisma/client";
import { getPositionIDFromNumber } from "../utils/helpers";

const SetPositionSchema = Joi.object({
    playerId: Joi.string(),

    positionID: Joi.number().min(1).max(11)
});

export const setPositionForPlayer: express.RequestHandler = async (
    request,
    response
) => {
    try {
        const jwtToken = request.get("Authorization")!.split("Bearer ")[1];
        const { wallet } = jwt.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;

        const payload = SetPositionSchema.validate(request.body);

        if (payload.error) {
            return response.status(400).json(payload.error);
        }
        const { playerId, positionID }: {
            playerId: string,
            positionID: number
        } = payload.value;

        //Fetch user's team;
        const team = await queryTeamForUser(wallet);
        if (!team) {
            return response.status(404).send("User does not have a team.");
        }

        //Fetch team players;
        const teamPlayers = await prisma.teamPlayer.findMany({
            where: {
                teamId: team.id
            }
        });

        //Check if position id in team is already filled
        const positionPlayer = teamPlayers.find(tp => tp.position === getPositionIDFromNumber(positionID));

        let teamPlayer = positionPlayer || teamPlayers.find(tp => tp.playerId === playerId);

        if (!teamPlayer) {
            teamPlayer = await prisma.teamPlayer.create({
                data: {
                    team: {
                        connect: { id: team.id },
                    },
                    player: {
                        connect: { id: playerId },
                    },
                    position: getPositionIDFromNumber(positionID),
                },
            });
        }
        else {
            //Update position if player is already in team
            teamPlayer = await prisma.teamPlayer.update({
                where: {
                    id: teamPlayer.id
                },
                data: {
                    position: getPositionIDFromNumber(positionID)
                }
            });

        }
        return response.status(200).send(teamPlayer);
    }
    catch (error: any) {
        return response.status(500).send("Internal Server Error: " + error.toString());
    }
}