import {Request, Response} from "express";
import {APIError, APIErrorType, APIResponse} from "../../APIResponse";
import {DBEntityID} from "../../database/entities/DBEntityID";
import APIDatabase from "../../APIDatabase";
import {UserAdditionalInfo} from "../../database/entities/UserAdditionalInfo";
import {User, UserGender} from "../../database/entities/User";
import {CheckDBConnectionAndSendError} from "../ResponseUtils";
import {UserWithFullInfo} from "./UserFrontEndTypes";


/*
 Transactional append handler
 Actions it performs:

 1. Check provided options exist and return error if they're not
 2. Insert aboutString to DB as additional info and return error if db error
 3. Insert new user and if db error:
    a) delete aboutString
    b) return error
 4. If there are options -> map options to user and if db error:
    a) delete user
    b) delete userInfo
    c) return error

*/
export async function AddUserWithFullInfoHandler(req: Request, resp: Response)
{
    if(!CheckDBConnectionAndSendError(resp)) return;

    const apiResp = new APIResponse();

    let userWithInfoInput: UserWithFullInfo;
    try
    {
        userWithInfoInput = {...req.body.newUser};
    }
    catch (e: any)
    {
        apiResp.error = new APIError(APIErrorType.INVALID_INPUT, "Invalid object format")
        apiResp.SendTo(resp);
        return;
    }


    // 1. Check provided options exist and return false if they're not
    const providedOptions = userWithInfoInput.options;
    let needMapOptions = true;

    if (providedOptions === null || providedOptions.length === 0)
        needMapOptions = false;


    let optionsToMapIDS: Array<DBEntityID> | null = null;

    try
    {
        if (needMapOptions && providedOptions !== null)
        {
            optionsToMapIDS = providedOptions.map((op) =>
            {
                const dbId = APIDatabase.ConvertToDBEntityIDFrom(op.optionID);

                if (dbId === null) throw "Provided invalid id";
                return dbId;
            });
        }
    }
    catch (e: any)
    {
        apiResp.error = new APIError(APIErrorType.INVALID_INPUT, "Invalid option id")
        apiResp.SendTo(resp);
        return;
    }

    if (needMapOptions && (optionsToMapIDS !== null))
    {
        let options = await APIDatabase.GetOptionsByIDs(optionsToMapIDS);

        if (options === null)
        {
            apiResp.error = new APIError(APIErrorType.DATABASE_ERROR, "")
            apiResp.SendTo(resp);
            return;
        }

        if (options.length === 0)
        {
            apiResp.error = new APIError(APIErrorType.INVALID_INPUT, "Provided options not found");
            apiResp.SendTo(resp);
            return;
        }
    }

    // 2. Insert aboutString to DB as additional info and return error if db error
    let userInfo: UserAdditionalInfo | null = null;
    let userInfoID: DBEntityID | null = null;

    if (userWithInfoInput.aboutString !== null)
        userInfo = new UserAdditionalInfo(userWithInfoInput.aboutString);


    if (userInfo !== null)
        userInfoID = await APIDatabase.AddUserAdditionalInfo(userInfo)

    if (userInfo && userInfoID === null)
    {
        apiResp.error = new APIError(APIErrorType.DATABASE_ERROR, "Cannot add additional info to database");
        apiResp.SendTo(resp);
        return;
    }

    //  3. Insert new user

    const user: User = new User(
        userWithInfoInput.requiredInfo.userName,
        userWithInfoInput.requiredInfo.userEmail,
        userWithInfoInput.requiredInfo.userPhone,
        userWithInfoInput.requiredInfo.gender === "MAN" ? UserGender.MAN : UserGender.WOMAN);

    const userID = await APIDatabase.AddUser(user);

    if (userID === null)
    {
        // TODO: a) delete aboutString (userInfo) if db error


        apiResp.error = new APIError(APIErrorType.DATABASE_ERROR, "Cannot add user to database");
        apiResp.SendTo(resp);
        return;
    }
    if (userInfo && userInfoID !== null)
    {
        const bindStatus = await APIDatabase.BindUserInfoToUser(userID, userInfoID);

        if (false === bindStatus)
        {
            APIDatabase.DeleteUserByID(userID);

            apiResp.error = new APIError(APIErrorType.DATABASE_ERROR, "Cannot bind info to user");
            apiResp.SendTo(resp);
            return;
        }
    }


    if (needMapOptions && optionsToMapIDS !== null)
    {
        for (let optionIndex = 0; optionIndex < optionsToMapIDS.length; optionIndex++)
        {
            if (await APIDatabase.BindOptionToUser(optionsToMapIDS[optionIndex], userID)) continue;

            APIDatabase.DeleteUserByID(userID);

            // TODO: b) delete userInfo as well

            apiResp.error = new APIError(APIErrorType.DATABASE_ERROR, "Cannot bind option to user");
            apiResp.SendTo(resp);
            return;
        }
    }

    apiResp.response = true;
    apiResp.SendTo(resp);
}