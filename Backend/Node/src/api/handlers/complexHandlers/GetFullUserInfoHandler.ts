import {Request, Response} from "express";
import {CheckDBConnectionAndSendError} from "../ResponseUtils";
import {APIError, APIErrorType, APIResponse} from "../../APIResponse";
import {ValidateUserIDInputAndSendErrorIfNotValid} from "../ValidateRequestInputTools";
import APIDatabase from "../../APIDatabase";
import {Option, UserWithFullInfo} from "./UserFrontEndTypes";
import {User, UserGender} from "../../database/entities/User";
import {UserAdditionalInfo} from "../../database/entities/UserAdditionalInfo";
import {SelectableOption} from "../../database/entities/SelectableOption";

export async function GetFullUserInfoHandler(req: Request, resp: Response)
{
    if (!CheckDBConnectionAndSendError(resp)) return;

    let apiResp: APIResponse = new APIResponse();

    let userId = await ValidateUserIDInputAndSendErrorIfNotValid(req, resp);

    if (userId === null)
    {
        apiResp.error = new APIError(APIErrorType.INVALID_INPUT, "User id not valid");
        apiResp.SendTo(resp);
        return;
    }

    let user = await APIDatabase().GetUserById(userId);

    if (user === null)
    {
        apiResp.error = new APIError(APIErrorType.DATABASE_ERROR, "User not found");
        apiResp.SendTo(resp);
        return;
    }

    const optionsIDS = await APIDatabase().GetUserOptionsIDsByUserId(userId);

    let retOptions = new Array<Option>();

    if (optionsIDS !== null)
    {
        for (let optionIndex = 0; optionIndex < optionsIDS.length; optionIndex++)
        {
            const optionsID = optionsIDS[optionIndex];
            const optionFromDB = await APIDatabase().GetOptionById(optionsID);

            if (optionFromDB === null)
            {
                apiResp.error = new APIError(APIErrorType.DATABASE_ERROR, "Option not found");
                apiResp.SendTo(resp);
                return;
            }

            retOptions.push(
                {
                    optionID: optionsID.toString(),
                    optionName: SelectableOption.AsPublicObject(optionFromDB).name,
                    optionSelected: true
                });
        }
    }


    const addInfo = await APIDatabase().GetUserInfoByUserId(userId);

    let addInfoPublic = null;

    if (addInfo !== null)
        addInfoPublic = UserAdditionalInfo.AsPublicObject(addInfo);


    const userPublic = User.AsPublicObject(user);


    let returnObj: UserWithFullInfo = {
        requiredInfo: {
            userID: userId.toString(),
            userName: userPublic.name,
            userEmail: userPublic.email,
            userPhone: userPublic.phone,
            gender: userPublic.gender === UserGender.MAN ? "MAN" : "WOMAN"
        },
        options: retOptions,
        aboutString: addInfoPublic?.aboutString || ""
    };

    apiResp.response = returnObj;
    apiResp.SendTo(resp);
}