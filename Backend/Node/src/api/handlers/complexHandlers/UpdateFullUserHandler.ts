import {Request, Response} from "express";
import {CheckDBConnectionAndSendError} from "../ResponseUtils";
import {APIError, APIErrorType, APIResponse} from "../../APIResponse";
import {ValidateUserIDInputAndSendErrorIfNotValid} from "../ValidateRequestInputTools";
import APIDatabase from "../../APIDatabase";
import {UserAdditionalInfo} from "../../database/entities/UserAdditionalInfo";
import {UserWithFullInfo} from "./UserFrontEndTypes";
import {User, UserGender} from "../../database/entities/User";
import {DBEntityID} from "../../database/entities/DBEntityID";

export async function UpdateFullUserHandler(req: Request, resp: Response)
{
    if (!CheckDBConnectionAndSendError(resp)) return;

    let apiResp: APIResponse = new APIResponse();

    const newInfoInput = req.body.newUserData as UserWithFullInfo;

    let userId = await ValidateUserIDInputAndSendErrorIfNotValid(req, resp);

    if (userId === null) return;

    let user = await APIDatabase().GetUserById(userId);

    if (user === null)
    {
        apiResp.error = new APIError(APIErrorType.DATABASE_ERROR, "User retreating error");
        apiResp.SendTo(resp);
        return;
    }

    const userUpdateStatus = await APIDatabase().UpdateUser(userId, new User(
        newInfoInput.requiredInfo.userName,
        newInfoInput.requiredInfo.userEmail,
        newInfoInput.requiredInfo.userPhone,
        newInfoInput.requiredInfo.gender === "MAN" ? UserGender.MAN : UserGender.WOMAN,
    ))

    if (!userUpdateStatus)
    {
        apiResp.error = new APIError(APIErrorType.DATABASE_ERROR, "Updating user error");
        apiResp.SendTo(resp);
        return;
    }

    const newInfo: UserAdditionalInfo = new UserAdditionalInfo(newInfoInput.aboutString || "");

    const newInfoId = await APIDatabase().AddUserAdditionalInfo(newInfo);

    if (newInfoId === null)
    {
        apiResp.error = new APIError(APIErrorType.DATABASE_ERROR, "Error updating user additional info");
        apiResp.SendTo(resp);
        return;
    }

    const bindInfoStatus = await APIDatabase().BindUserInfoToUser(userId, newInfoId);

    if (!bindInfoStatus)
    {
        apiResp.error = new APIError(APIErrorType.DATABASE_ERROR, "Error binding new user additional info to user");
        apiResp.SendTo(resp);
        return;
    }


    const usersCurrentOptionsIDS = await APIDatabase().GetUserOptionsIDsByUserId(userId);

    if (usersCurrentOptionsIDS === null)
    {
        apiResp.error = new APIError(APIErrorType.DATABASE_ERROR, "Error retrieving users options");
        apiResp.SendTo(resp);
        return;
    }


    if (newInfoInput.options === null)
    {
        usersCurrentOptionsIDS.forEach((option) =>
        {
            if (userId !== null)
                APIDatabase().UnbindOptionFromUser(userId, option);
        });

        apiResp.response = true;
        apiResp.SendTo(resp);
        return;
    }

    const inputOptionASDBIds = Array<DBEntityID>();
    for (const option of newInfoInput.options)
    {
        const opIdAsDBid = APIDatabase().ConvertToDBEntityIDFrom(option.optionID);
        if (opIdAsDBid === null)
        {
            apiResp.error = new APIError(APIErrorType.INVALID_INPUT, `Provided option id: ${option.optionID} is invalid`);
            apiResp.SendTo(resp);
            return;
        }
        inputOptionASDBIds.push(opIdAsDBid);
    }

    const optionsToBindIDs = inputOptionASDBIds.filter((optionID) =>
    {
        return -1 === usersCurrentOptionsIDS.findIndex((id) =>
        {
            return APIDatabase().CheckIDsAreEqual(optionID, id);
        })
    });

    const optionsToUnbindIDs = usersCurrentOptionsIDS.filter((optionId) =>
    {
        return -1 === inputOptionASDBIds.findIndex((id) =>
        {
            return APIDatabase().CheckIDsAreEqual(optionId, id);
        })
    });

    for (let optionToBindIndex = 0; optionToBindIndex < optionsToBindIDs.length; optionToBindIndex++)
    {
        const bindStatus = await APIDatabase().BindOptionToUser(userId, optionsToBindIDs[optionToBindIndex]);

        if (!bindStatus)
        {
            apiResp.error = new APIError(APIErrorType.DATABASE_ERROR,
                `Error binding option with ID: ${optionsToBindIDs[optionToBindIndex]} to user`);
            apiResp.SendTo(resp);
            return;
        }
    }
    for (let optionToUnbindIndex = 0; optionToUnbindIndex < optionsToUnbindIDs.length; optionToUnbindIndex++)
    {
        const unbindStatus = APIDatabase().UnbindOptionFromUser(userId, optionsToUnbindIDs[optionToUnbindIndex]);

        if (!unbindStatus)
        {
            apiResp.error = new APIError(APIErrorType.DATABASE_ERROR,
                `Error unbinding option with ID: ${optionsToUnbindIDs[optionToUnbindIndex]} from user`);
            apiResp.SendTo(resp);
            return;
        }
    }

    apiResp.response = true
    apiResp.SendTo(resp);
    return;
}
