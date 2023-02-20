import UserModel from "../models/UserModel";
import {Request, Response} from "express";
import {APIError, APIErrorType, APIResponse} from "../APIResponse";
import {Error} from "mongoose";

async function GetSingleUserHandler(req: Request, resp: Response)
{
    let apiResp: APIResponse = new APIResponse();
    let id = req.params.id;


    // noinspection UnnecessaryLocalVariableJS -> it will be necessary when APIResponse.response field will not be "any"
    let searchedUser = await UserModel.findById(id).catch((e: Error) =>
    {
        if (e.name === "CastError")
        {
            apiResp.error = new APIError(APIErrorType.INVALID_PARAMS, "Specified invalid \"user id\"")
            apiResp.SendTo(resp);
            return;
        }

        apiResp.error = new APIError(APIErrorType.DATABASE_ERROR, "User searching error");
        apiResp.SendTo(resp);
    });

    apiResp.response = searchedUser; // if not found it will be "null"

    apiResp.SendTo(resp);
}

export default GetSingleUserHandler;