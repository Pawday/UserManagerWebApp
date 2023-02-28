export class UserAdditionalInfo
{
    private readonly _aboutString: string;

    constructor(aboutString: string)
    {
        this._aboutString = aboutString;
    }

    static AreEqual(left: UserAdditionalInfo, right: UserAdditionalInfo): boolean
    {
        if (left._aboutString !== right._aboutString) return false;

        return true;
    }

    get aboutString(): string
    {
        return this._aboutString;
    }
}