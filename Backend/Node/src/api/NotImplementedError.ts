export class NotImplementedError implements Error
{
    name: string = "Not implemented";
    public readonly message: string;

    constructor(message: string)
    {
        this.message = message;
    }
    stack?: string | undefined;
}