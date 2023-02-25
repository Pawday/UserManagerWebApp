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

    const userIdDB = APIDatabase.ConvertToDBEntityIDFrom(userIdInput);

    if (userIdDB === null)
    {
        SendInputNotValidError(resp, "user_id");
        return;
    }

    let userFromDB = APIDatabase.GetUserById(userIdDB);

    if (userFromDB == null)
    {
        apiResponse.error = new APIError(APIErrorType.INVALID_INPUT, "user with provided user_id not existing in database");
        apiResponse.SendTo(resp);
        return;
    }




    if (userFromDB.additionalInfo !== null)
    {
        apiResponse.error = new APIError(APIErrorType.INVALID_INPUT, "This user already have info, use EditUserInfo");
        apiResponse.SendTo(resp);
    }

    {

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

        let validatedOptionsDBIds = (userSelectedOptionsArrayInput as Array<string>).map(optionIDInput =>
        {
            return APIDatabase.ConvertToDBEntityIDFrom(optionIDInput);
        });

        let invalidOptionInputIdIndex = validatedOptionsDBIds.findIndex(value => (value == null));

        if (invalidOptionInputIdIndex !== -1)
        {
            SendInputNotValidError(resp,
                `user_info.options_ids[${invalidOptionInputIdIndex}]
                 ("${validatedOptionsDBIds[invalidOptionInputIdIndex]})`);
            return;
        }

        let optionsFromDB = APIDatabase.GetOptionsByIDs(validatedOptionsDBIds as Array<DBEntityID>);

        if (optionsFromDB == null)
        {
            apiResponse.error = new APIError(APIErrorType.INVALID_INPUT, "One of the user_info.options_ids was not in database");
            apiResponse.SendTo(resp);
            return;
        }


        let userAdditionalInfoToUpload = new UserAdditionalInfo(
            userAboutString,
            [...optionsFromDB]
        );

        let infoID = APIDatabase.AddUserAdditionalInfo(userAdditionalInfoToUpload);

        if (infoID == null)
        {
            apiResponse.error = new APIError(APIErrorType.DATABASE_ERROR, "cannot upload new user info to database");
            apiResponse.SendTo(resp);
            return;
        }

        let updateUsersInfoStatus = APIDatabase.BindUserInfoToUser(userIdDB, infoID);

        if (updateUsersInfoStatus)
            apiResponse.response = "Success";
        else
            apiResponse.error = new APIError(APIErrorType.DATABASE_ERROR, "Binding user info to user error");

        apiResponse.SendTo(resp);

        return;
    }


}


export default PostSingleUserInfoHandler;