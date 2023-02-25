import {Response} from "express";
import {APIError, APIErrorType, APIResponse} from "../APIResponse";
import APIDatabase from "../APIDatabase";

export function SendInputNotProvidedError(resp: Response, fiendName: string)
{
    let apiResponse: APIResponse = new APIResponse();

    let errorString = `request field \"${fiendName}\" should be defined`;
    apiResponse.error =  new APIError(APIErrorType.INVALID_INPUT, errorString);
    apiResponse.SendTo(resp);
    return;
}

export function SendInputNotValidError(resp: Response, fiendName: string)
{
    let apiResponse: APIResponse = new APIResponse();

    let errorString = `provided field \"${fiendName}\" is not valid`;
    apiResponse.error =  new APIError(APIErrorType.INVALID_INPUT, errorString);
    apiResponse.SendTo(resp);
    return;
}

export function CheckDBConnectionAndSendError(resp: Response) : boolean
{
    if (APIDatabase.CheckConnection()) return true;

    let apiResponse: APIResponse = new APIResponse();
    apiResponse.error =  new APIError(APIErrorType.DATABASE_ERROR, "Database connection error");
    apiResponse.SendTo(resp);

    return false;
}