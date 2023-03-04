import {Request, Response} from "express";
import {APIResponse} from "../APIResponse";
import APIDatabase from "../APIDatabase";
import {CheckDBConnectionAndSendError} from "./ResponseUtils";
import {ValidateUserIDInput} from "./ValidateRequestInputTools";

async function GetSingleUserHandler(req: Request, resp: Response)
{
    if (!CheckDBConnectionAndSendError(resp)) return;

    let apiResp: APIResponse = new APIResponse();

    let userId = ValidateUserIDInput(req, resp);

    if (userId === null) return;

    apiResp.response = (await APIDatabase.GetUserById(userId))?.AsPublicObject(); // if not found it will be "null"
    apiResp.SendTo(resp);
}

export default GetSingleUserHandler;