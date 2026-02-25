import {argon2id, hash, verify} from "argon2";
import env from "@config/env";

export const hashWord = async (word: string): Promise<string> => {
    return await hash(word, {type: argon2id, salt: Buffer.allocUnsafe(env.BCRYPT_SALT_ROUNDS)});
}

export const compareHash = async (hash: string, word: string): Promise<boolean> => {
    if (!hash || !word) return false;

    return await verify(hash, word);
}

export default {
    hashWord,
    compareHash
}