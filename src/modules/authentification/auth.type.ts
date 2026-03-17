export type TokenResponse = {
    accessToken: string;
    refreshToken: string;
}


export type PayLoadToken = {
    // userId: string,
    role: string,
    phoneNumber: string,
    username: string,
    permission?: string[],
    id: string,
    firstname: string,
    lastname: string,
    email: string,
}