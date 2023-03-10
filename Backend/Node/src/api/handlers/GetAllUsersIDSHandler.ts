import {Request, Response} from "express";
import APIDatabase from "../APIDatabase";
import {APIResponse} from "../APIResponse";
import {CheckDBConnectionAndSendError} from "./ResponseUtils";

async function GetAllUsersIDSHandler(req: Request, resp: Response)
{
    if (!CheckDBConnectionAndSendError(resp)) return;

    const apiResp: APIResponse = new APIResponse();

    apiResp.response = (await APIDatabase().GetAllUsersIDs()).map(id => id.toString());

    apiResp.SendTo(resp);
}

export default GetAllUsersIDSHandler;