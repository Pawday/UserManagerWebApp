import {Request, Response} from "express";
import {CheckDBConnectionAndSendError} from "./ResponseUtils";
import {APIResponse} from "../APIResponse";
import APIDatabase from "../APIDatabase";
import {ValidateUserIDInput} from "./ValidateRequestInputTools";

export default async function DeleteUserHandler(req: Request, resp: Response)
{
    CheckDBConnectionAndSendError(resp);

    let apiResp: APIResponse = new APIResponse();

    let userId = ValidateUserIDInput(req, resp);

    if (userId === null) return;

    apiResp.response = APIDatabase.DeleteUserByID(userId);
    apiResp.SendTo(resp);
}