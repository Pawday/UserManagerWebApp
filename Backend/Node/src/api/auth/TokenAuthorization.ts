import {NextFunction, Request, Response} from "express";
import {APIError, APIErrorType, APIResponse} from "../APIResponse";

function TokenAuthorization(req: Request, resp: Response, next: NextFunction)
{
    let apiErrorResponse: APIResponse = new APIResponse();
    let token: string = req.body.token;

    if (!token)
    {
        apiErrorResponse.error = new APIError(APIErrorType.AUTHORIZE_ERROR,
            "Field \"token\" not provided");
        apiErrorResponse.SendTo(resp);
        return;
    }

    next();
}

export default TokenAuthorization;