import {Request, Response} from "express";

import TypeTools from "../TypeTools";
import {APIError, APIErrorType, APIResponse} from "../APIResponse";
import * as Mongoose from "mongoose";
import UserModel from "../models/UserModel";


async function GetMultipleUsersHandler(req: Request, resp: Response)
{
    let apiResp: APIResponse = new APIResponse();
    let usersIdsArray: Array<string> = req.body.user_ids;

    if (!usersIdsArray || !TypeTools.IsArray(usersIdsArray))
    {
        apiResp.error = new APIError(APIErrorType.INVALID_INPUT, "Array \"user_ids\" with user ids should be defined");
        apiResp.SendTo(resp);
    }

    let validatedUserIdList = new Array<Mongoose.Types.ObjectId>();


    // First for loop in this project actually
    for (let i = 0; i < usersIdsArray.length; i++)
    {
        try
        {
            validatedUserIdList.push(new Mongoose.Types.ObjectId(usersIdsArray[i]));
        }
        catch (e: any)
        {
            apiResp.error = new APIError(APIErrorType.INVALID_INPUT, `users_ids[${i}] is not valid`);
            apiResp.SendTo(resp)
            return;
        }
    }

    //https://stackoverflow.com/questions/8303900/mongodb-mongoose-findmany-find-all-documents-with-ids-listed-in-array
    let usersFound = await UserModel.find({"_id" : {$in: validatedUserIdList}}).catch(() =>
    {
        apiResp.error = new APIError(APIErrorType.INVALID_INPUT, "Users searching error");
        apiResp.SendTo(resp);
    });

    apiResp.response = usersFound;
    apiResp.SendTo(resp);
}

export default GetMultipleUsersHandler;