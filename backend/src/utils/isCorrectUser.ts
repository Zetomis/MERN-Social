import { Types } from "mongoose";

const isCorrectUser = (
    userIdFromDb: Types.ObjectId,
    userId: Types.ObjectId
) => {
    return userIdFromDb.toString() !== userId.toString();
};

export default isCorrectUser;
