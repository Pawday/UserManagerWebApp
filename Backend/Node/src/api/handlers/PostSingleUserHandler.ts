import {APIError, APIErrorType, APIResponse} from "../APIResponse";
import {Request, Response} from "express";
import {CheckDBConnectionAndSendError, SendInputNotValidError, SendInputNotProvidedError} from "./ResponseUtils";
import APIDatabase from "../APIDatabase";
import {User, UserGender} from "../database/entities/User";


async function PostSingleUserHandler(req: Request, resp: Response)
{
    if (!CheckDBConnectionAndSendError(resp)) return;

    let apiResponse: APIResponse = new APIResponse();

    let userNameInput: string = req.body.name;
    let userEmailInput: string = req.body.email;
    let userPhoneInput: string = req.body.phone;
    let userGenderInput: UserGender = req.body.gender;


    if (userNameInput == null)
    {
        SendInputNotProvidedError(resp, "name");
        return;
    }

    if (userEmailInput == null)
    {
        SendInputNotProvidedError(resp, "email");
        return;
    }

    if (userPhoneInput == null)
    {
        SendInputNotProvidedError(resp, "phone");
        return;
    }

    if (userGenderInput == null)
    {
        SendInputNotProvidedError(resp, "gender");
        return;
    }

    let validatedGender = UserGender[userGenderInput];

    if (!validatedGender)
    {
        SendInputNotValidError(resp, "gender");
        return;
    }

    let postedUser = new User(
        userNameInput,
        userEmailInput,
        userPhoneInput,
        userGenderInput
    );


    let addUserResult = await APIDatabase().AddUser(postedUser);


    if (addUserResult === null)
        apiResponse.error = new APIError(APIErrorType.DATABASE_ERROR, "User saving error");
    else
        apiResponse.response = {
        status: "ok",
        userId: addUserResult}

    apiResponse.SendTo(resp);
}


export default PostSingleUserHandler;