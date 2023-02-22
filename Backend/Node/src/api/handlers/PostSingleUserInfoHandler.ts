import {Request, Response} from "express";
import {APIError, APIErrorType, APIResponse} from "../APIResponse";
import {SendInputInvalidError, SendInputNotProvidedError} from "./ResponseUtils";
import UserAdditionalInfoModel from "../models/UserAdditionalInfoModel";
import UserModel from "../models/UserModel";

async function PostSingleUserInfoHandler(req: Request, resp: Response)
{
    let apiResponse: APIResponse = new APIResponse();
    let userId: string = req.body.user_id;
    let info: string = req.body.info;

    if (userId == null)
    {
        SendInputNotProvidedError(resp, "user_id");
        return;
    }

    if (info == null)
    {
        SendInputNotProvidedError(resp, "info");
        return;
    }

    let userModel = await UserModel.findById(userId).catch(e =>
    {
        SendInputInvalidError(resp, "user_id");
        return;
    });

    if (userModel == null)
    {
        apiResponse.error = new APIError(APIErrorType.INVALID_INPUT, "user not found");
        apiResponse.SendTo(resp);
        return;
    }

    if (userModel.additionalInfo != null)
    {
        SendInputInvalidError(resp, "Provided user already have additional info");
        return;
    }


    let userInfoModel = await UserAdditionalInfoModel
        .create(info)
        .catch((e) =>
        {
            SendInputInvalidError(resp, "info")
            return;
        });

    if (resp.headersSent) return;

    if (userInfoModel == null)
    {
        let message = "Validating info done, but something wrong according to return type";
        message += "\n Void as type for variable is weird";
        apiResponse.error = new APIError(APIErrorType.UNKNOWN_ERROR, message);
        apiResponse.SendTo(resp);
        return;
    }

    userModel.additionalInfo = userInfoModel.id;

    userInfoModel.save().then(() =>
    {
        apiResponse.response = "Success";
        apiResponse.SendTo(resp);
    }).catch((e) =>
    {
        apiResponse.error = new APIError(APIErrorType.DATABASE_ERROR, `info saving error ${e.message}`);
        apiResponse.SendTo(resp);
    });
}


export default PostSingleUserInfoHandler;