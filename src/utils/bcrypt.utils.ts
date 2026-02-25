import bcrypt from "bcryptjs";
import env from "@config/env";

export const hashWord = async (word: string): Promise<string> => {
    return bcrypt.hashSync(word, bcrypt.genSaltSync(env.BCRYPT_SALT_ROUNDS));
}

export const compareHash = async (word: string, hash: string): Promise<boolean> => {
    return bcrypt.compareSync(word, hash);
}

export default {
    hashWord,
    compareHash
}