import {authenticateUserFx} from "../loginScreen/LoginEvents";
import {addUserWithFullInfoFx, loadFullUserInfoFx, optionsLoadFx, userDeleteFx, userPreviewsLoadFx} from "./APIEffects";
import {OptionGroupWithOptions, UserRequiredData, UserWithFullInfo} from "./ApiTypes";

let token: string;


const API_URI: string = "http://127.0.0.1:3000/api";
function ApiSetToken(newToken: string)
{
    token = newToken;
}

authenticateUserFx.doneData.watch((tokenPayload) =>
{
    ApiSetToken(tokenPayload.token);
});

export async function ApiLoadAllUsersIDS(): Promise<Array<string> | null>
{
    try
    {
        const payload = JSON.stringify({token: token});
        const userIDsJson = await fetch(`${API_URI}/users/ids`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: payload
        }).then(res => res.json());

        if (userIDsJson.error)
            return null;

        return userIDsJson.response;
    }
    catch (e: any)
    {
        return null;
    }
}

async function ApiLoadUserPreviews(ids: Array<string>) : Promise<Array<UserRequiredData> | null>
{
    try
    {
        const payload = JSON.stringify(
            {
                token: token,
                user_ids: ids
            });
        const usersJson = await fetch(`${API_URI}/users`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: payload
            }).then(res => res.json());

        if (usersJson.error)
            return null;

        const users = (usersJson.response as Array<{
            id: string,
            name: string,
            email: string,
            phone: string,
            gender: number
        }>);

        return users.map((val, index) =>
        {
            const mapped: UserRequiredData =
            {
                userID: ids[index],
                userName: val.name,
                userEmail: val.email,
                userPhone: val.phone,
                gender: ((val.gender & 1) ? "WOMAN" : "MAN")
            };
            return mapped;
        });

    }
    catch (e: any)
    {
        return null;
    }
}


async function ApiDeleteUser(userId: string): Promise<boolean>
{
    try
    {
        const payload = JSON.stringify(
            {
                token: token,
                user_id: userId
            });

        const resp = await fetch(`${API_URI}/user/delete`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: payload
            });

        const respObj = await resp.json();

        if (respObj.error)
            return false;

        return respObj.response;
    }
    catch (e)
    {
        return false;
    }
}

async function ApiLoadOptionGroups() : Promise<OptionGroupWithOptions[] | null>
{
    try
    {
        const payload = JSON.stringify({token: token});

        const resp = await fetch(`${API_URI}/options/fullTree`,
            {
                method: "POST",
                headers:
                    {
                        "Content-Type": "application/json"
                    },
                body: payload
            });

        const respObj = await resp.json();

        if (respObj.error)
            return null;

        return respObj.response;
    }
    catch (e: any)
    {
        return null;
    }
}

async function ApiAddUserWithFullInfo(newUserWithInfo: UserWithFullInfo): Promise<boolean>
{
    try
    {
        const payload = JSON.stringify({token: token, newUser: newUserWithInfo});

        const resp = await fetch(`${API_URI}/user/add/full`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: payload
            });

        const respObj = await resp.json();

        if (respObj.error)
            return false;

        return respObj.response;
    }
    catch(e: any)
    {
        return false;
    }
}

async function LoadUserWithFullInfo(userId: string): Promise<UserWithFullInfo | null>
{
    try
    {
        const payload = JSON.stringify({token: token, user_id: userId});

        const resp = await fetch(`${API_URI}/user/get/full`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: payload
            });

        const respObj = await resp.json();

        if (respObj.error)
            return null;

        return respObj.response;

    }
    catch (e: any)
    {
        return null;
    }
}


export function RegisterApiEffects()
{
    userPreviewsLoadFx.use(async () =>
    {
        const ids = await ApiLoadAllUsersIDS();

        if (ids === null)
            return Promise.reject("Server returns null for ids request");

        if (ids.length === 0)
            return [];

        const users = await ApiLoadUserPreviews(ids);

        if (users === null)
            return Promise.reject("Server returns null for users request");

        return users;
    });

    userDeleteFx.use(async (user) =>
    {
        return ApiDeleteUser(user.userID);
    });

    optionsLoadFx.use(async () =>
    {
        return ApiLoadOptionGroups();
    });

    addUserWithFullInfoFx.use(async (payload) =>
    {
        return ApiAddUserWithFullInfo(payload);
    });

    loadFullUserInfoFx.use(async (userId) =>
    {
        return LoadUserWithFullInfo(userId);
    });
}


