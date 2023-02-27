import {Request, Response} from "express";

import TypeTools from "../TypeTools";
import {APIError, APIErrorType, APIResponse} from "../APIResponse";
import APIDatabase from "../APIDatabase";
import {CheckDBConnectionAndSendError} from "./ResponseUtils";
import {DBEntityID} from "../database/entities/DBEntityID";
import {User} from "../database/entities/User";


async function GetMultipleUsersHandler(req: Request, resp: Response)
{
    if (!CheckDBConnectionAndSendError(resp)) return;

    let apiResp: APIResponse = new APIResponse();

    let usersIdsArrayInput: Array<string> = req.body.user_ids;

    if (!usersIdsArrayInput || !TypeTools.IsArray(usersIdsArrayInput))
    {
        apiResp.error = new APIError(APIErrorType.INVALID_INPUT, "Array \"user_ids\" with user ids should be defined");
        apiResp.SendTo(resp);
    }

    let validatedUserIdList = new Array<DBEntityID>();

    // TODO: typescripts array assertions not right
    for (let i = 0; i < usersIdsArrayInput.length; i++)
    {
        let dbIdOrNull = APIDatabase.ConvertToDBEntityIDFrom<string>(usersIdsArrayInput[i]);

        if (dbIdOrNull === null)
        {
            apiResp.error = new APIError(APIErrorType.INVALID_INPUT, `users_ids[${i}] is not valid`);
            apiResp.SendTo(resp)
            return;
        }

        validatedUserIdList.push(dbIdOrNull);
    }

    let users = APIDatabase.GetUsersByIds(validatedUserIdList);

    apiResp.response = users?.map((value: User | null) =>
    {
        return value?.asPublicObject || null
    });
    apiResp.SendTo(resp);
}

export default GetMultipleUsersHandler;