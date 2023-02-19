import {Request, Response} from "express";

import TypeTools from "../TypeTools";
import {APIError, APIErrorType, APIResponse} from "../APIResponse";

import {NotImplementedError} from "../NotImplementedError"

async function GetMultipleUsersHandler(req: Request, resp: Response)
{
    throw new NotImplementedError("GetMultipleUsersHandler");

    let apiResp: APIResponse = new APIResponse();
    let usersIdsArray: Array<string> = req.body;

    if (!usersIdsArray || !TypeTools.IsArray(usersIdsArray))
    {
        apiResp.error = new APIError(APIErrorType.INVALID_PARAMS, "Array with user ids should be defined");
        apiResp.SendTo(resp);
    }



    resp.end();

}

export default GetMultipleUsersHandler;