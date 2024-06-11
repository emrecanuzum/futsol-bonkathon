export interface Player {
    name: string;
    position: Position;
    stats: Stats;
    stars: number;
    overall: number;
}

export enum Position {
    Goalkeeper = "Goalkeeper",
    Defender = "Defender",
    Midfielder = "Midfielder",
    Attacker = "Attacker",
}

export interface GoalkeeperStats {
    Skill: number;
}

export interface DefenderStats {
    Pass: number;
    Defense: number;
}

export interface MidfielderStats {
    Pass: number;
    Defense: number;
    Shoot: number;
}

export interface AttackerStats {
    Pass: number;
    Shoot: number;
}

export type Stats = GoalkeeperStats | DefenderStats | MidfielderStats | AttackerStats;


export const STAT_TEMPLATES: { [position in Position]: Stats } = {
    [Position.Goalkeeper]: {
        Skill: 0
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

