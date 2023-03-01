export class FormState
{
    private readonly _isUserValid: boolean;
    private readonly _userInputHint: string;
    private readonly _isPasswordValid: boolean;
    private readonly _passwordInputHint: string;

    private readonly _formMessage: string;

    private readonly _formAvailable: boolean;


    constructor
    (
        isUserValid: boolean,
        userInputErrorMassage: string,
        isPasswordValid: boolean,
        passwordInputErrorMassage: string,
        formMessage: string,
        formAvailable: boolean
    )
    {
        this._isUserValid = isUserValid;
        this._userInputHint = userInputErrorMassage;
        this._isPasswordValid = isPasswordValid;
        this._passwordInputHint = passwordInputErrorMassage;
        this._formMessage = formMessage;
        this._formAvailable = formAvailable;
    }


    get formMessage(): string
    {
        return this._formMessage;
    }

    get isUserValid(): boolean
    {
        return this._isUserValid;
    }

    get userInputHint(): string
    {
        return this._userInputHint;
    }

    get isPasswordValid(): boolean
    {
        return this._isPasswordValid;
    }

    get passwordInputHint(): string
    {
        return this._passwordInputHint;
    }

    get formAvailable(): boolean
    {
        return this._formAvailable;
    }
}