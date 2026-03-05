import * as bcrypt from "bcrypt"
import env from "@config/env";

export const hashWord = async (word: string): Promise<string> => {
    return await bcrypt.hash(word, env.BCRYPT_SALT_ROUNDS);
}

export const compareHash = async (hash: string, word: string): Promise<boolean> => {
    // if (!hash || !word) return false;
    return await bcrypt.compare(word, hash);
}

export default {
    hashWord,
    compareHash
}