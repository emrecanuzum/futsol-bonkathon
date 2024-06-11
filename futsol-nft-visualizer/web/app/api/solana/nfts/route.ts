import axios from "axios";
import { DAS } from "helius-sdk";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const owner = url.searchParams.get('owner');

    const assetsResponse = await axios.post(
        process.env.NEXT_PUBLIC_RPC_URL!,
        {
            jsonrpc: "2.0",
            id: "my-id",
            method: "getAssetsByOwner",
            params: {
                ownerAddress: owner,
                page: 1, // Starts at 1
                limit: 1000,
            },
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    const { items } = (assetsResponse.data.result as DAS.GetAssetResponseList);

    const futsolNFTs = items.filter(item => {
        return item.authorities && item.authorities.find(auth => auth.address == "HQxRUAWUdGE9JDS9GcP7y8seejeixJT8UyypHAV55PqG")
    });

    return NextResponse.json(futsolNFTs);
}
