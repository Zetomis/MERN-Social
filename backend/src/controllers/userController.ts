import { Request, Response } from "express";
import User from "../models/userModel";
import { comparePassword, generatePassword } from "./../utils/passwordFunction";
import {
    generateAccessToken,
    generateRefreshToken,
} from "./../utils/tokenUtils";
import { Types } from "mongoose";
import getTokenFromHeaders from "../utils/getTokenFromHeaders";
import getUserIdFromToken from "../utils/getUserIdFromToken";
import isCorrectUser from "../utils/isCorrectUser";

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
                .json({ error: "Incorrect userEmail or userName" });
        }
        const isMatch = await comparePassword(userPassword, user.userPassword);
        if (!isMatch) {
            return res.status(401).json({ error: "Incorrect userPassword" });
        }
        const accessToken = generateAccessToken(user._id as Types.ObjectId);
        const refreshToken = generateRefreshToken(user._id as Types.ObjectId);
        return res.status(200).json({ accessToken, refreshToken });
    } catch {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const userRegister = async (req: Request, res: Response) => {
    const { userEmail, userName, userPassword } = req.body;
    const userAvatar = req.file?.filename;

    try {
        const user = await User.findOne({ $or: [{ userEmail }, { userName }] });
        if (user) {
            return res.status(401).json({ error: "User already existed" });
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
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const userRefreshAccessToken = async (req: Request, res: Response) => {
    try {
        const token = getTokenFromHeaders(req.headers);
        const userId = getUserIdFromToken(token);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User is not found" });
        }
        const accessToken = generateAccessToken(userId);
        return res.status(200).json({ accessToken });
    } catch {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const userFollow = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const currentUser = await User.findById(req.userId);
        const userToFollow = await User.findById(userId);
        if (!currentUser || !userToFollow) {
            return res.status(404).json({ error: "User is not found" });
        }
        if (
            !userToFollow.userFollowers.includes(currentUser._id) &&
            !currentUser.userFollowing.includes(userToFollow._id)
        ) {
            userToFollow.userFollowers.push(currentUser._id);
            currentUser.userFollowing.push(userToFollow._id);
        } else {
            userToFollow.userFollowers = userToFollow.userFollowers.filter(
                (user) => isCorrectUser(user._id, req.userId)
            );
            currentUser.userFollowing = currentUser.userFollowing.filter(
                (user) => isCorrectUser(user._id, userToFollow._id)
            );
        }

        await currentUser.save();
        await userToFollow.save();
        return res.sendStatus(200);
    } catch {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
