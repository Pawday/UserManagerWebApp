import {Request, Response} from "express";
import {APIError, APIErrorType, APIResponse} from "../APIResponse";
import {SendInputNotProvidedError} from "./ResponseUtils";
import APIDatabase from "../APIDatabase";
import {DBEntityID} from "../database/entities/DBEntityID";

export async function ValidateUserIDInput(req: Request, resp: Response): Promise<DBEntityID | null>
{
    let apiResp: APIResponse = new APIResponse();

    let userIDInput = req.body.user_id;

    if (!userIDInput)
    {
        SendInputNotProvidedError(resp, "user_id");
        return null;
    }

    const userId = await APIDatabase.ConvertToDBEntityIDFrom(userIDInput);

    if (userId == null)
    {
        apiResp.error = new APIError(APIErrorType.INVALID_INPUT, "Specified invalid \"user_id\"")
        apiResp.SendTo(resp);
        return null;
    }

    return userId;

}