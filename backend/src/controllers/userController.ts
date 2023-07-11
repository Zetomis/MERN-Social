import { Request, Response } from "express";
import User from "../models/userModel";
import { comparePassword, generatePassword } from "./../utils/passwordFunction";
import {
    generateAccessToken,
    generateRefreshToken,
} from "./../utils/tokenUtils";
import { Types } from "mongoose";

export const userLogin = async (req: Request, res: Response) => {
    const { userEmailOrName, userPassword } = req.body;
    try {
        const user = await User.findOne({
            $or: [
                { userEmail: userEmailOrName },
                { userName: userEmailOrName },
            ],
        });
        if (!user) {
            return res
                .status(401)
                .json({ error: "Incorrect userEmail or userName." });
        }
        const isMatch = await comparePassword(userPassword, user.userPassword);
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect userPassword." });
        }
        const accessToken = generateAccessToken(user._id as Types.ObjectId);
        const refreshToken = generateRefreshToken(user._id as Types.ObjectId);
        return res.status(200).json({ accessToken, refreshToken });
    } catch {
        return res.status(500).json({ error: "Internal Server Error." });
    }
};

export const userRegister = async (req: Request, res: Response) => {
    const { userEmail, userName, userPassword } = req.body;
    const userAvatar = req.file?.filename;

    try {
        const user = await User.findOne({ $or: [{ userEmail }, { userName }] });
        if (user) {
            return res.status(401).json({ error: "User already existed." });
        }
        const hashedPassword = await generatePassword(userPassword);
        const newUser = await User.create({
            userEmail,
            userName,
            userPassword: hashedPassword,
            userAvatar,
        });
        const accessToken = generateAccessToken(newUser._id as Types.ObjectId);
        const refreshToken = generateRefreshToken(
            newUser._id as Types.ObjectId
        );
        return res.status(200).json({ accessToken, refreshToken });
    } catch {
        return res.status(500).json({ error: "Internal Server Error." });
    }
};
