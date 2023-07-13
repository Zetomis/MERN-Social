import { IncomingHttpHeaders } from "http";

const getTokenFromHeaders = (headers: IncomingHttpHeaders): string => {
    const { authorization } = headers;
    const token = authorization?.split(" ")[1];
    if (!token) {
        throw Error;
    }
    return token;
};

export default getTokenFromHeaders;
