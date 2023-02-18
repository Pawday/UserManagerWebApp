import {Response} from "express";


export enum APIErrorType
{
    UNKNOWN_ERROR,
    INVALID_PARAMS,
}

export class APIError
{
    private errorType: APIErrorType;
    private errorString: string;

    constructor(errorType: APIErrorType, errorString: string)
    {
        this.errorType = errorType;
        this.errorString = errorString;
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

    public SendTo(resp: Response)
    {
        resp.setHeader("Content-Type", "application/json");
        resp.send(this.ToJSONString());
        resp.statusCode = this._error ? 400 : 200;
        resp.end();
    }
}