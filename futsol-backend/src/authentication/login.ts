import bs58 from "bs58";
import express from "express";
import nacl from "tweetnacl";
import jwt, { JwtPayload } from "jsonwebtoken";

export const login: express.RequestHandler = async (
    request,
    response
) => {
    try {
        const { timestamp, signature, walletAddress }: {
            timestamp: number;
            signature: string;
            walletAddress: string;
        } = request.body;


        if (!timestamp || !signature || !walletAddress) {
            response.status(400).send("Invalid request");
            return;
        }

        if (!isTimestampValid(timestamp)) {
            response.status(400).send("Invalid timestamp");
            return;
        }

        const validationResult = await validateMessage(
            signature,
            timestamp.toString(),
            walletAddress
        );

        if (!validationResult) {
            response.status(400).send("Invalid signature");
            return;
        }

        const token = jwt.sign({ wallet: walletAddress }, process.env.JWT_SECRET!, {
            expiresIn: 60 * 60 * 6 //6 hours‘
        });

        return response.status(200).send(token);
    }
    catch (err: any) {
        console.error(err);
        response.status(500).send("Internal server error: " + err.toString());
    }
}

//Check if the timestamp is older than 6 hours
const isTimestampValid = (timestamp: number) => {
    const now = Date.now();
    const timeDifference = now - timestamp;
    const sixHours = 6 * 60 * 60 * 1000;
    //Check if the time difference is less than 6 hours and timestamp is not from the future
    return timeDifference < sixHours && timeDifference > 0;
}

async function validateMessage(
    signature: string,
    message: string,
    walletAddress: string
) {
    const signatureUint8 = bs58.decode(signature);
    const msgUint8 = new TextEncoder().encode(message);
    const pubKeyUint8 = bs58.decode(walletAddress);

    return nacl.sign.detached.verify(msgUint8, signatureUint8, pubKeyUint8);
}