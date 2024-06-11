import { STAT_TEMPLATES } from "./constants";
import { FootballPlayer, Position, PositionID, Stats } from "@prisma/client";
import { PLAYER_LAST_NAME_POOL, PLAYER_NAME_POOL } from "../utils/constants";
import { BaseStats } from "../types/stats";

export function generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomStat(): number {
    return Math.floor(Math.random() * 60) + 30; // Generates a random integer between 0 and 100
}

export function generateStats(position: Position) {
    const template = STAT_TEMPLATES[position];
    const stats = Object.keys(template).reduce((acc, key) => {
        acc[key] = generateRandomStat();
        return acc;
    }, {} as BaseStats);

    return stats;
}

export const generateRandomBasePlayer = (position: Position) => {
    const name = `${PLAYER_NAME_POOL[generateRandomNumber(0, PLAYER_NAME_POOL.length - 1)]} ${PLAYER_LAST_NAME_POOL[generateRandomNumber(0, PLAYER_LAST_NAME_POOL.length - 1)]}`;
    const stats = generateStats(position);
    const stars = generateRandomNumber(1, 3);
    const overall = (Object.values(stats) as Array<number>).reduce((acc, stat) => acc + stat, 0)! / Object.keys(stats).length;

    return {
        name,
        position,
        stats,
        stars,
        overall: Math.floor(overall),
    };
}
export const getPositionIDFromNumber = (position: number): PositionID => {
    switch (position) {
        case 1:
            return PositionID.POSITION_1;
        case 2:
            return PositionID.POSITION_2;
        case 3:
            return PositionID.POSITION_3;
        case 4:
            return PositionID.POSITION_4;
        case 5:
            return PositionID.POSITION_5;
        case 6:
            return PositionID.POSITION_6;
        case 7:
            return PositionID.POSITION_7;
        case 8:
            return PositionID.POSITION_8;
        case 9:
            return PositionID.POSITION_9;
        case 10:
            return PositionID.POSITION_10;
        case 11:
            return PositionID.POSITION_11;
        default:
            throw new Error("Invalid position number");
    }
}