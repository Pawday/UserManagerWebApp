import crypto from "crypto"


export class RootUser
{
    private static _rootLogin: string;
    private static _rootPasswordHash: string;
    private static _rootPasswordSalt: string;
    private static _isInitialized: boolean = false;

    private static _token: [string, Date];

    static Init(login: string, password: string): boolean
    {
        if (RootUser._isInitialized) return false;
        RootUser._isInitialized = true;

        RootUser._token = ["", new Date()];

        RootUser._rootPasswordSalt = crypto.createHash("SHA256").digest().toString();

        RootUser._rootPasswordHash = crypto.createHash("SHA256")
            .update(RootUser._rootPasswordSalt)
            .update(password).digest().toString();


        RootUser._rootLogin = login;

        return true;
    }

    static ComparePassword(password: string): boolean
    {
        let hashToCompare = crypto.createHash("SHA256")
            .update(RootUser._rootPasswordSalt)
            .update(password).digest().toString();


        return RootUser._rootPasswordHash === hashToCompare;
    }

    static CompareLogin(login: string): boolean
    {
        return RootUser._rootLogin === login;
    }

    static UpdateTokenAccessTime()
    {
        RootUser._token[1] = new Date();
    }

    static CompareToken(tokenString: string): boolean
    {
        return tokenString === this._token[0].toString();
    }

    static UpdateToken(login: string, password: string): string | null
    {
        if (!(RootUser.CompareLogin(login) && RootUser.ComparePassword(password)))
            return null;


        RootUser.UpdateTokenAccessTime();
        RootUser._token[0] = crypto.randomUUID().toString();
        return String(RootUser._token[0]).toString();
    }

    static GetTokenLastAccessTime(): Date
    {
        return new Date(RootUser._token[1]);
    }
}
