import { Types } from "mongoose";
import { sign } from "jsonwebtoken";

export const generateAccessToken = (userId: Types.ObjectId) => {
    const accessToken = sign(
        { userId: userId },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "15m" }
    );
    return accessToken;
};

export const generateRefreshToken = (userId: Types.ObjectId) => {
    const refreshToken = sign(
        { userId: userId },
        process.env.REFRESH_TOKEN_SECRET!
    );
    return refreshToken;
};
