import {APIError, APIErrorType, APIResponse} from "../APIResponse";
import UserModel from "../models/UserModel";
import {UserGender} from "../models/UserModel";
import {Request, Response} from "express";
import {SendInputInvalidError, SendInputNotProvidedError} from "./ResponseUtils";


async function PostSingleUserHandler(req: Request, resp: Response)
{
    let apiResponse: APIResponse = new APIResponse();

    let userName: string = req.body.name;
    let userEmail: string = req.body.email;
    let userPhone: string = req.body.phone;
    let userGender: UserGender = req.body.gender;


    if (userName == null)
    {
        SendInputNotProvidedError(resp, "name");
        return;
    }

    if (userEmail == null)
    {
        SendInputNotProvidedError(resp, "email");
        return;
    }

    if (userPhone == null)
    {
        SendInputNotProvidedError(resp, "phone");
        return;
    }

    if (userGender == null)
    {
        SendInputNotProvidedError(resp, "gender");
        return;
    }

    let validatedGender = UserGender[userGender];

    if (!validatedGender)
    {
        SendInputInvalidError(resp, "gender");
        return;
    }


    let user = new UserModel(
        {
            name: userName,
            email: userEmail,
            phone: userPhone,
            gender: userGender
        });

    user.save().then(() =>
    {
        apiResponse.response = "Success";
        apiResponse.SendTo(resp);
    }).catch((e: Error) =>
    {
        apiResponse.error = new APIError(APIErrorType.DATABASE_ERROR, `User saving error: ${e.message}`);
        apiResponse.SendTo(resp);
    });

}


export default PostSingleUserHandler;