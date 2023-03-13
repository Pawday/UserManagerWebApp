import {Request, Response} from "express";
import {APIResponse} from "../APIResponse";
import APIDatabase from "../APIDatabase";
import {CheckDBConnectionAndSendError} from "./ResponseUtils";
import {ValidateUserIDInputAndSendErrorIfNotValid} from "./ValidateRequestInputTools";
import {User} from "../database/entities/User";

async function GetSingleUserHandler(req: Request, resp: Response)
{
    if (!CheckDBConnectionAndSendError(resp)) return;

    let apiResp: APIResponse = new APIResponse();

    let userId = await ValidateUserIDInputAndSendErrorIfNotValid(req, resp);

    if (userId === null) return;

    let user = await APIDatabase.GetUserById(userId);

    apiResp.response = user === null ? null : User.AsPublicObject(user);
    apiResp.SendTo(resp);
}

export default GetSingleUserHandler;