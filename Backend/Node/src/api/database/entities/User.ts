export enum UserGender
{
    WOMAN,
    MAN
}

export class User
{
    private readonly _name: string;
    private readonly _email: string;
    private readonly _phone: string;
    private readonly _gender: UserGender;


    constructor(
        name: string,
        email: string,
        phone: string,
        gender: UserGender,
    )
    {
        this._name = name;
        this._email = email;
        this._phone = phone;
        this._gender = gender;
    }

    AsPublicObject(): object
    {
        return {
            name: this._name,
            email: this._email,
            phone: this._phone,
            gender: this._gender
        }
    }

    static AreEqual(left: User, rigth: User)
    {
        if (left._name !== rigth._name) return false;
        if (left._email !== rigth._email) return false;
        if (left._phone !== rigth._phone) return false;
        if (left._gender !== rigth._gender) return false;

        return true;
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
}