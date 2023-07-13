import { Schema, Types, model } from "mongoose";

interface commentInterface {
    commentContent: string;
    commentCreator: Types.ObjectId;
    _id?: Types.ObjectId;
}

interface postInterface {
    postCaption: string;
    postImage: string;
    postCreator: Types.ObjectId;
    postLikeUser: Types.ObjectId[];
    postComments: commentInterface[];
}

const commentSchema = new Schema<commentInterface>(
    {
        commentContent: { type: String, required: true },
        commentCreator: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
    },
    { timestamps: true }
);

const postSchema = new Schema<postInterface>(
    {
        postCaption: { type: String, required: true },
        postImage: { type: String },
        postCreator: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        postLikeUser: [{ type: Schema.Types.ObjectId, ref: "User" }],
        postComments: [commentSchema],
    },
    { timestamps: true }
);

const Post = model("Post", postSchema);
export default Post;
