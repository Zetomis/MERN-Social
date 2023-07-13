import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import getTokenFromHeaders from "./../utils/getTokenFromHeaders";
import getUserIdFromToken from "../utils/getUserIdFromToken";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = getTokenFromHeaders(req.headers);
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!);
        req.userId = getUserIdFromToken(accessToken);
        next();
    } catch {
        return res.status(403).json({ error: "Invalid accessToken" });
    }
};

export default isAuthenticated;
