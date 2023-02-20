import {NextFunction, Request, Response} from "express";
import {APIError, APIErrorType, APIResponse} from "../APIResponse";

const ADMIN_TOKEN_FOR_NOW: string = "4266309f-1542-4e6b-86bb-f74c6fe0b6bb"

function AdminAuthorization(req: Request, resp: Response, next: NextFunction)
{
    let apiErrorResponse: APIResponse = new APIResponse();

    let token: string = req.body.token;

    if (token !== ADMIN_TOKEN_FOR_NOW)
    {
        apiErrorResponse.error = new APIError(APIErrorType.AUTHORIZE_ERROR,
            "Provided invalid admin token");
        apiErrorResponse.SendTo(resp);
        return;
    }


    next();
}

export default AdminAuthorization;