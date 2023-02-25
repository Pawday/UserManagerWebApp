

class SelectableOptionGroup
{
    private readonly _name: string;
    private readonly _options: SelectableOption[];

    constructor(name: string, options: SelectableOption[])
    {
        this._name = name;
        this._options = options;
    }

    get name(): string
    {
        return this._name;
    }

    get options(): SelectableOption[]
    {
        return this._options;
    }
}