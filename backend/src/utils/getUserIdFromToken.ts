import { JwtPayload } from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import { Types } from "mongoose";

const getUserIdFromToken = (token: string): Types.ObjectId => {
    const decode = jwtDecode<{ userId: Types.ObjectId }>(token) as JwtPayload;
    return decode.userId;
};

export default getUserIdFromToken;
