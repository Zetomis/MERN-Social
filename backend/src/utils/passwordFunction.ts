import { genSalt, hash, compare } from "bcrypt";

export const generatePassword = async (password: string) => {
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    return hashedPassword;
};

export const comparePassword = async (
    password: string,
    hashedPassword: string
) => {
    const isMatch = await compare(password, hashedPassword);
    return isMatch;
};
