import { Request, Response } from "express";
import Post from "../models/postModel";
import isCorrectUser from "./../utils/isCorrectUser";
import User from "../models/userModel";

export const postUpload = async (req: Request, res: Response) => {
    const { postCaption } = req.body;
    const postImage = req.file?.filename;
    const postCreator = req.userId;
    try {
        const post = await Post.create({ postCaption, postImage, postCreator });
        return res.status(200).json({ post });
    } catch {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const postUpdate = async (req: Request, res: Response) => {
    const { postCaption } = req.body;
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post is not found" });
        }
        if (!isCorrectUser(post._id, req.userId)) {
            return res.status(403).json({ error: "You are the impostor" });
        }
        await Post.findByIdAndUpdate(postId, { postCaption });
        return res.sendStatus(200);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const postDelete = async (req: Request, res: Response) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(203).json({ error: "Post is not found" });
        }
        if (!isCorrectUser(post._id, req.userId)) {
            return res.status(403).json({ error: "You are the impostor" });
        }
        await Post.findByIdAndDelete(postId);
        return res.sendStatus(200);
    } catch {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const postGetAll = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find();
        return res.status(200).json({ posts });
    } catch {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const postGetSingle = async (req: Request, res: Response) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post is not found" });
        }
        return res.status(200).json({ post });
    } catch {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const postLike = async (req: Request, res: Response) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);

        if (post?.postLikeUser.includes(req.userId)) {
            post.postLikeUser = post.postLikeUser.filter((user) =>
                isCorrectUser(user, req.userId)
            );
        } else {
            post?.postLikeUser.push(req.userId);
        }

        await post?.save();

        return res.sendStatus(200);
    } catch {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const postCommentGet = async (req: Request, res: Response) => {
    const { postId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post is not found" });
        }
        return res.status(200).json({ postComments: post.postComments });
    } catch {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const postCommentUpload = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const commentCreator = req.userId;
    const { commentContent } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post is not found" });
        }
        if (!isCorrectUser(post._id, req.userId)) {
            return res.status(403).json({ error: "You are the impostor" });
        }
        post.postComments.push({
            commentContent,
            commentCreator,
        });
        await post.save();
        return res.sendStatus(200);
    } catch {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const postCommentUpdate = async (req: Request, res: Response) => {
    const { postId, commentId } = req.params;
    const { commentContent } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post is not found" });
        }
        if (!isCorrectUser(post._id, req.userId)) {
            return res.status(403).json({ error: "You are the impostor" });
        }
        const commentToUpdate = post.postComments.find(
            (comment) => comment._id?.toString() === commentId
        );
        if (!commentToUpdate) {
            return res.status(404).json({ error: "Comment is not found" });
        }
        commentToUpdate.commentContent = commentContent;
        await post.save();
        return res.sendStatus(200);
    } catch {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const postCommentDelete = async (req: Request, res: Response) => {
    const { postId, commentId } = req.params;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post is not found" });
        }
        if (!isCorrectUser(post._id, req.userId)) {
            return res.status(403).json({ error: "You are the impostor" });
        }
        post.postComments = post.postComments.filter(
            (comment) => comment._id?.toString() !== commentId
        );
        await post.save();
        return res.sendStatus(200);
    } catch {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
