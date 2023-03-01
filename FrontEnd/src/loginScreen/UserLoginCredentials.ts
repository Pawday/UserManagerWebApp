export class UserLoginCredentials
{
    private readonly _userLogin: string;
    private readonly _userPassword: string;
    private readonly _isFilled: boolean;

    constructor(userLogin?: string, userPassword?: string)
    {
        this._isFilled =
            userLogin !== undefined      &&
            userLogin !== ""             &&
            userPassword !== undefined   &&
            userPassword !== "";

        this._userLogin = userLogin ? userLogin : "";
        this._userPassword = userPassword ? userPassword : "";
    }

    get userLogin(): string
    {
        return this._userLogin;
    }

    get userPassword(): string
    {
        return this._userPassword;
    }

    get isFilled(): boolean
    {
        return this._isFilled;
    }
}