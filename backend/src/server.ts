import express, { Express, Request, Response } from "express";
import { Types, connect } from "mongoose";
import cors from "cors";
import multer, { Multer, StorageEngine } from "multer";
import "dotenv/config";
import path from "path";

import userRouter from "./routers/userRouter";
import postRouter from "./routers/postRouter";

declare global {
    namespace Express {
        interface Request {
            userId: Types.ObjectId;
        }
    }
}

// Init
const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routers
app.use("/user", userRouter);
app.use("/post", postRouter);

// Connect
connect(process.env.MONGO_URL!).then(() => {
    app.listen(3001, () => {
        console.log("Start listening.");
    });
});
