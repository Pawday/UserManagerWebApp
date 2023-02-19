import {Request, Response} from "express";
import {APIError, APIErrorType, APIResponse} from "./APIResponse";

function ErrorHandler(err: Error, req: Request, resp: Response)
{
    let apiResp: APIResponse = new APIResponse();

    if (err.name === "SyntaxError")
    {
        apiResp.error = new APIError(APIErrorType.INVALID_PARAMS, "Params parse Syntax Error");
        apiResp.SendTo(resp);
        return;
    }


    apiResp.error = new APIError(APIErrorType.UNKNOWN_ERROR, "Unhandled error: " + err.name);
    apiResp.SendTo(resp);

    console.error(err.stack);
}

export default ErrorHandler;