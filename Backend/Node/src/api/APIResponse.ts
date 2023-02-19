import {Response} from "express";
import assert from "assert";


export enum APIErrorType
{
    UNKNOWN_ERROR,
    INVALID_PARAMS,
    DATABASE_ERROR
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

            case APIErrorType.INVALID_PARAMS: return 400;
        }

        assert("Not handled map APIErrorType to HTTPCode");
    }

    public SendTo(resp: Response)
    {
        resp.setHeader("Content-Type", "application/json");
        resp.statusCode = this.GetHttpCode();
        resp.send(this.ToJSONString());
        resp.end();
    }
}