import { Position, STAT_TEMPLATES, Stats } from "@/types/player";
import { DAS } from "helius-sdk";

export const extractPlayerStats = (nft: DAS.GetAssetResponse): Stats => {
    const positionAttribute = nft.content!.metadata.attributes?.find(attr => (attr as any).trait === 'Position')?.value;

    const position = Position[positionAttribute as keyof typeof Position];
    const statsTemplate = STAT_TEMPLATES[position];
    const stats: Stats = { ...statsTemplate };

    for (const key in stats) {
        const statValue = nft.content?.metadata.attributes?.find(attr => (attr as any).trait === key)?.value;
        if (statValue) {
            (stats as any)[key] = parseInt(statValue, 10);
        }
    }

    return stats;
};