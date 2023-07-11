import express, { Express, Request, Response } from "express";
import { connect } from "mongoose";
import cors from "cors";
import multer, { Multer, StorageEngine } from "multer";
import "dotenv/config";
import path from "path";

import userRouter from "./routers/userRouter";

// Init
const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routers
app.use("/user", userRouter);

// Connect
connect(process.env.MONGO_URL!).then(() => {
    app.listen(3001, () => {
        console.log("Start listening.");
    });
});
