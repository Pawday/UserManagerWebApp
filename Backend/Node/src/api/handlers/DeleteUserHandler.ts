import {Request, Response} from "express";
import {CheckDBConnectionAndSendError} from "./ResponseUtils";
import {APIResponse} from "../APIResponse";
import APIDatabase from "../APIDatabase";
import {ValidateUserIDInputAndSendErrorIfNotValid} from "./ValidateRequestInputTools";

export default async function DeleteUserHandler(req: Request, resp: Response)
{
    CheckDBConnectionAndSendError(resp);

    let apiResp: APIResponse = new APIResponse();

    let userId = await ValidateUserIDInputAndSendErrorIfNotValid(req, resp);

    if (userId === null) return;

    apiResp.response = await APIDatabase().DeleteUserByID(userId);
    apiResp.SendTo(resp);
}