import {SelectableOption} from "./SelectableOption";

export class UserAdditionalInfo
{
    private readonly _aboutString: string;
    private readonly _options: SelectableOption[];

    constructor(aboutString: string, options: SelectableOption[])
    {
        this._aboutString = aboutString;
        this._options = options;
    }


    get aboutString(): string
    {
        return this._aboutString;
    }

    get options(): SelectableOption[]
    {
        return this._options;
    }
}