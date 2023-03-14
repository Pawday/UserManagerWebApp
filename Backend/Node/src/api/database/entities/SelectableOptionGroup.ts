type SelectableOptionGroupObj =
{
    name: string
}

export class SelectableOptionGroup
{
    private readonly _name: string;

    constructor(name: string)
    {
        this._name = name;
    }

    static AsPublicObject(group: SelectableOptionGroup): SelectableOptionGroupObj
    {
        return {
            name: group._name
        }
    }

    static AreEqual(left: SelectableOptionGroup, right: SelectableOptionGroup)
    {
        if (left._name !== right._name) return false;

        return true;
    }

    get name(): string
    {
        return this._name;
    }
}