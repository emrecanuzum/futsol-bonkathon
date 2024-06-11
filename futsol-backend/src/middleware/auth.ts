import express from "express";
import jwt from "jsonwebtoken";

export const authenticationMiddleware: express.RequestHandler = async (
    request,
    response,
    next
) => {
    const jwtToken = request.get("Authorization")?.split("Bearer ")[1];
    if (!jwtToken)
        return response
            .status(401)
            .json({ error: "Missing authentication token." });


    try {
        jwt.verify(jwtToken, process.env.JWT_SECRET!);
        next();
    } catch (error) {
        return response
            .status(401)
            .json({ error: "Unauthorized request" });
    }
}