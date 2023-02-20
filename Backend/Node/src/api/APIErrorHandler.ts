import {NextFunction, Request, Response} from "express";
import {APIError, APIErrorType, APIResponse} from "./APIResponse";

function APIErrorHandler(err: Error, req: Request, resp: Response, next: NextFunction)
{
    let apiResp: APIResponse = new APIResponse();

    if (err.name === "SyntaxError")
    {
        apiResp.error = new APIError(APIErrorType.INVALID_INPUT, "Params parse Syntax Error");
        apiResp.SendTo(resp);
        return;
    }


    apiResp.error = new APIError(APIErrorType.UNKNOWN_ERROR, "Unhandled error: " + err.name);
    apiResp.SendTo(resp);

    console.error(err.stack);
    next();
}

export default APIErrorHandler;