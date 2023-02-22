import {Response} from "express";
import {APIError, APIErrorType, APIResponse} from "../APIResponse";

export function SendInputNotProvidedError(resp: Response, fiendName: string)
{
    let apiResponse: APIResponse = new APIResponse();

    let errorString = `request field \"${fiendName}\" should be defined`;
    apiResponse.error =  new APIError(APIErrorType.INVALID_INPUT, errorString);
    apiResponse.SendTo(resp);
    return;
}

export function SendInputInvalidError(resp: Response, fiendName: string)
{
    let apiResponse: APIResponse = new APIResponse();

    let errorString = `provided field \"${fiendName}\" is not valid`;
    apiResponse.error =  new APIError(APIErrorType.INVALID_INPUT, errorString);
    apiResponse.SendTo(resp);
    return;
}