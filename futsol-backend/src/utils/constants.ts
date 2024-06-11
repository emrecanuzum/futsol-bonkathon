import { Position, Stats } from "@prisma/client";

export const PLAYER_NAME_POOL = [
    "Lionel",
    "Cristiano",
    "Neymar",
    "Kylian",
    "Kevin",
    "Virgil",
    "Sergio",
    "Manuel",
    "Robert",
    "Eden",
    "Luka",
    "Harry",
    "Paul",
    "Antoine",
    "Alisson",
    "Thibaut",
    "Ederson",
    "Karim",
    "Sadio",
    "Mohamed"
]

export const PLAYER_LAST_NAME_POOL = [
    "Messi",
    "Ronaldo",
    "Jr",
    "Mbappé",
    "De Bruyne",
    "van Dijk",
    "Ramos",
    "Neuer",
    "Lewandowski",
    "Hazard",
    "Modrić",
    "Kane",
    "Pogba",
    "Griezmann",
    "Becker",
    "Courtois",
    "Moraes",
    "Benzema",
    "Mané",
    "Salah"
]

export const STAT_TEMPLATES: { [position in Position]: Partial<Stats> } = {
    [Position.Goalkeeper]: {
        Catch: 0
    },
    [Position.Attacker
    ]: {
        Pass: 0,
        Shoot: 0,
    },
    [Position.Defender]: {
        Pass: 0,
        Defense: 0,
    },
    [Position.Midfielder]: {
        Pass: 0,
        Defense: 0,
        Shoot: 0,
    }
};