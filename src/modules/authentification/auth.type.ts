export type TokenResponse = {
    accessToken: string;
    refreshToken: string;
}


export type PayLoadToken = {
    id: string,
    role: string,
    phoneNumber: string,
    username: string,
    permission?: string[]
    firstname: string,
    lastname: string,
    email: string,

}