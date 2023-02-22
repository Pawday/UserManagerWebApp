import {Response} from "express";
import assert from "assert";


export enum APIErrorType
{
    UNKNOWN_ERROR,
    INVALID_INPUT,
    DATABASE_ERROR,
    AUTHORIZE_ERROR,
    NOT_FOUND_ERROR
}

export class APIError
{
    private readonly errorType: APIErrorType;
    private readonly errorString: string;

    constructor(errorType: APIErrorType, errorString: string)
    {
        this.errorType = errorType;
        this.errorString = errorString;
    }

    public GetErrorType() : APIErrorType
    {
        return this.errorType;
    }
}

export class APIResponse
{
    private _error?: APIError;
    private _response?: any;


    set error(value: APIError)
    {
        this._response = undefined;
        this._error = value;
    }

    set response(value: any)
    {
        this._error = undefined;
        this._response = value;
    }


    private ToJSONString() : string
    {
        // Removing underscores
        return JSON.stringify({
            error: this._error,
            response: this._response
        });
    }

    private GetHttpCode(): number
    {
        if (!this._error) return 200;

        switch (this._error.GetErrorType())
        {
            case APIErrorType.UNKNOWN_ERROR:
            case APIErrorType.DATABASE_ERROR: return 500;
            case APIErrorType.INVALID_INPUT: return 400;
            case APIErrorType.AUTHORIZE_ERROR: return 403;
            case APIErrorType.NOT_FOUND_ERROR: return 404;
        }

        throw Error("Not handled map APIErrorType to HTTPCode");
    }

    public SendTo(resp: Response)
    {
        // I love how asynchronous js nature awaited via deep callstack and special flags
        // I mean if some callback already send the response there is no way it wold be handled by the framework
        if (resp.headersSent) return;

        resp.setHeader("Content-Type", "application/json");
        resp.statusCode = this.GetHttpCode();
        resp.send(this.ToJSONString());
        resp.end();
    }
}