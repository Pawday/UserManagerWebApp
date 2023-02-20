import {APIError, APIErrorType, APIResponse} from "../APIResponse";
import UserModel from "../models/UserModel";
import {Request, Response} from "express";

function PostSingleUserHandler(req: Request, resp: Response)
{
    let apiResponse: APIResponse = new APIResponse();

    let userName = req.body.name;
    let userEmail = req.body.email;

    if (!userName)
    {
        let errorString = "request field \"name\" should be defined";
        apiResponse.error =  new APIError(APIErrorType.INVALID_PARAMS, errorString);
        apiResponse.SendTo(resp);
        return;
    }

    if (!userEmail)
    {
        let errorString = "request field \"email\" should be defined";
        apiResponse.error = new APIError(APIErrorType.INVALID_PARAMS, errorString);
        apiResponse.SendTo(resp);
        return;
    }

    let user = new UserModel(
        {
            name: userName,
            email: userEmail
        });

    user.save().then(() =>
    {
        apiResponse.response = "Success";
        apiResponse.SendTo(resp);
    }).catch(() =>
    {
        apiResponse.error = new APIError(APIErrorType.DATABASE_ERROR, "User saving error");
        apiResponse.SendTo(resp);
    });

}


export default PostSingleUserHandler;