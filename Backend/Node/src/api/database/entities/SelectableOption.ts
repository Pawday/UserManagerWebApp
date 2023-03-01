export class SelectableOption
{
    private readonly _name: string;

    constructor(name: string)
    {
        this._name = name;
    }

    static AreEqual(left: SelectableOption, right: SelectableOption)
    {
        if (left._name !== right._name) return false;

        return true;
    }

    get name(): string
    {
        return this._name;
    }
}