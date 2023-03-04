import {Request, Response} from "express";
import {APIError, APIErrorType, APIResponse} from "../APIResponse";
import {CheckDBConnectionAndSendError, SendInputNotProvidedError, SendInputNotValidError} from "./ResponseUtils";
import APIDatabase from "../APIDatabase";
import TypeTools from "../TypeTools";
import {DBEntityID} from "../database/entities/DBEntityID";
import {UserAdditionalInfo} from "../database/entities/UserAdditionalInfo";

async function PostSingleUserInfoHandler(req: Request, resp: Response)
{
    if (!CheckDBConnectionAndSendError(resp)) return;

    let apiResponse: APIResponse = new APIResponse();

    let userIdInput: string = req.body.user_id;
    let userInfoInput: any = req.body.user_info;

    if (userIdInput == null)
    {
        SendInputNotProvidedError(resp, "user_id");
        return;
    }

    const userIdDB = await APIDatabase.ConvertToDBEntityIDFrom(userIdInput);

    if (userIdDB === null)
    {
        SendInputNotValidError(resp, "user_id");
        return;
    }

    let userFromDB = await APIDatabase.GetUserById(userIdDB);

    if (userFromDB == null)
    {
        apiResponse.error = new APIError(APIErrorType.INVALID_INPUT, "user with provided user_id not existing in database");
        apiResponse.SendTo(resp);
        return;
    }


    if (await APIDatabase.GetUserAdditionalInfoById(userIdDB) !== null)
    {
        apiResponse.error = new APIError(APIErrorType.INVALID_INPUT, "This user already have info, use EditUserInfo");
        apiResponse.SendTo(resp);
    }


    if (userInfoInput == null)
    {
        SendInputNotProvidedError(resp, "user_info");
        return;
    }

    const userAboutString: string = userInfoInput.about;

    if (userAboutString === null)
    {
        SendInputNotProvidedError(resp, "user_info.about");
        return;
    }

    const userSelectedOptionsArrayInput = userInfoInput.options_ids;

    if (userSelectedOptionsArrayInput === null)
    {
        SendInputNotProvidedError(resp, "user_info.options_ids");
        return;
    }

    if (!TypeTools.IsArray(userSelectedOptionsArrayInput))
    {
        SendInputNotValidError(resp, "user_info.options_ids");
        return;
    }

    let userSelectedOptionsAsStringArray = userSelectedOptionsArrayInput as Array<string>;

    let validatedOptionsDBIds = Array<DBEntityID>(userSelectedOptionsAsStringArray.length);

    for (let index = 0; index < userSelectedOptionsAsStringArray.length; index++)
    {
        let optionValidIDOrNull = await APIDatabase.ConvertToDBEntityIDFrom(userSelectedOptionsAsStringArray[index]);

        if (optionValidIDOrNull == null)
        {
            SendInputNotValidError(resp, `user_info.options_ids[${index}] ("${userSelectedOptionsAsStringArray[index]})`);
            return;
        }
        validatedOptionsDBIds[index] = optionValidIDOrNull;
    }


    for (let index = 0; index < validatedOptionsDBIds.length; index++)
    {
        let isOptionExist = await APIDatabase.IsOptionExistById(validatedOptionsDBIds[index]);

        if (!isOptionExist)
        {
            apiResponse.error = new APIError(APIErrorType.INVALID_INPUT, `user_info.options_ids[${index}] is not in database`);
            apiResponse.SendTo(resp);
            return;
        }

        let bindStatus = await APIDatabase.BindOptionToUser(validatedOptionsDBIds[index], userIdDB);

        if (!bindStatus)
        {
            apiResponse.error = new APIError(APIErrorType.DATABASE_ERROR, `cannot bind user_info.options_ids[${index}] to user`);
            apiResponse.SendTo(resp);
            return;
        }
    }


    let userAdditionalInfoToUpload = new UserAdditionalInfo(userAboutString);

    let infoID = await APIDatabase.AddUserAdditionalInfo(userAdditionalInfoToUpload);

    if (infoID === null)
    {
        apiResponse.error = new APIError(APIErrorType.DATABASE_ERROR, "cannot upload new user info to database");
        apiResponse.SendTo(resp);
        return;
    }

    let updateUsersInfoStatus = await APIDatabase.BindUserInfoToUser(userIdDB, infoID);

    if (updateUsersInfoStatus)
        apiResponse.response = "Success";
    else
        apiResponse.error = new APIError(APIErrorType.DATABASE_ERROR, "Binding user info to user error");

    apiResponse.SendTo(resp);

    return;

}


export default PostSingleUserInfoHandler;