import {Request, Response} from "express";
import {APIError, APIErrorType, APIResponse} from "../APIResponse";
import APIDatabase from "../APIDatabase";
import {CheckDBConnectionAndSendError, SendInputNotProvidedError} from "./ResponseUtils";

async function GetSingleUserHandler(req: Request, resp: Response)
{
    if (!CheckDBConnectionAndSendError(resp)) return;

    let apiResp: APIResponse = new APIResponse();
    let userIDInput = req.body.user_id;

    if (!userIDInput)
    {
        SendInputNotProvidedError(resp, "user_id");
        return;
    }


    const userId = APIDatabase.ConvertToDBEntityIDFrom(userIDInput);

    if (userId == null)
    {
        apiResp.error = new APIError(APIErrorType.INVALID_INPUT, "Specified invalid \"user_id\"")
        apiResp.SendTo(resp);
        return;
    }

    apiResp.response = APIDatabase.GetUserById(userId)?.AsPublicObject(); // if not found it will be "null"
    apiResp.SendTo(resp);
}

export default GetSingleUserHandler;