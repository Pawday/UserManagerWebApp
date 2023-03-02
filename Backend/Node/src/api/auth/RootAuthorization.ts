import {NextFunction, Request, Response} from "express";
import {APIError, APIErrorType, APIResponse} from "../APIResponse";
import {SendInputNotValidError} from "../handlers/ResponseUtils";
import {RootUser} from "../../RootUser";

const ROOT_TOKEN_LIFETIME_IN_SEC: number = 1000;

function RootAuthorization(req: Request, resp: Response, next: NextFunction)
{
    let apiErrorResponse: APIResponse = new APIResponse();

    let token: string = req.body.token;

    if (!token)
    {
        SendInputNotValidError(resp,"token");
        return;
    }

    if (!RootUser.CompareToken(token))
    {
        apiErrorResponse.error = new APIError(APIErrorType.AUTHORIZE_ERROR,
            "Provided invalid root token");
        apiErrorResponse.SendTo(resp);
        return;
    }

    let lastAccessTime = RootUser.GetTokenLastAccessTime();
    let nowDate = new Date();

    if (nowDate.getSeconds() - lastAccessTime.getSeconds() >= ROOT_TOKEN_LIFETIME_IN_SEC)
    {
        apiErrorResponse.error = new APIError(APIErrorType.AUTHORIZE_ERROR, "Token expired");
        apiErrorResponse.SendTo(resp);
        return;
    }

    RootUser.UpdateTokenAccessTime();

    next();
}

export default RootAuthorization;