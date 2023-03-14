type SelectableOptionObj =
{
    name: string
}

export class SelectableOption
{
    private readonly _name: string;

    constructor(name: string)
    {
        this._name = name;
    }

    static AsPublicObject(option: SelectableOption) : SelectableOptionObj
    {
        return {
            name: option._name
        };
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