import { Schema, Types, model } from "mongoose";

interface userInterface {
    userEmail: string;
    userName: string;
    userPassword: string;
    userAvatar: string;
    userBio: string;
    userPosts: Types.ObjectId[];
    userFriends: Types.ObjectId[];
    userFollowers: Types.ObjectId[];
    userFollowing: Types.ObjectId[];
}

const userSchema: Schema = new Schema<userInterface>({
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    userPassword: { type: String, required: true },
    userAvatar: { type: String },
    userBio: { type: String },
    userPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    userFriends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    userFollowers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    userFollowing: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const User = model("User", userSchema);
export default User;
