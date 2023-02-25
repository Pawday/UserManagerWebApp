enum UserGender
{
    WOMAN,
    MAN
}

class User
{
    private readonly _name: string;
    private readonly _email: string;
    private readonly _phone: string;
    private readonly _gender: UserGender;
    private readonly _additionalInfo: UserAdditionalInfo | null;


    constructor(
        name: string,
        email: string,
        phone: string,
        gender: UserGender,
        additionalInfo: UserAdditionalInfo | null
    )
    {
        this._name = name;
        this._email = email;
        this._phone = phone;
        this._gender = gender;
        this._additionalInfo = additionalInfo;
    }


    get name(): string
    {
        return this._name;
    }

    get email(): string
    {
        return this._email;
    }

    get phone(): string
    {
        return this._phone;
    }

    get gender(): UserGender
    {
        return this._gender;
    }

    get additionalInfo(): UserAdditionalInfo | null
    {
        return this._additionalInfo;
    }
}