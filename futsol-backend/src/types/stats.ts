export interface GoalkeeperStats {
    Catch: number;
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

export type BaseStats = GoalkeeperStats | DefenderStats | MidfielderStats | AttackerStats;