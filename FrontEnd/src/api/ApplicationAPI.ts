import {authenticateUserFx} from "../loginScreen/LoginEvents";
import {userPreviewsLoadFx} from "./APIEvents";
import {UserOverviewDataRow} from "../editScreen/EditScreenStores";

let token: string;


const API_URI: string = "http://127.0.0.1:3000/api";
function ApiSetToken(newToken: string)
{
    token = newToken;
}

export async function ApiLoadAllUsersIDS(): Promise<Array<string> | null>
{
    try
    {
        const payload = JSON.stringify({token: token});
        const userIDsJson = await fetch(`${API_URI}/users/ids`,
        {
            method: "POST",
            headers:
                {
                    "Content-Type": "application/json"
                },
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

async function ApiLoadUserPreviews(ids: Array<string>) : Promise<Array<UserOverviewDataRow> | null>
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
                headers:
                    {
                        "Content-Type": "application/json"
                    },
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

        return users.map((val) =>
        {
            const mapped: UserOverviewDataRow =
            {
                userID: val.id,
                userName: val.name,
                userEmail: val.email,
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

authenticateUserFx.doneData.watch((tokenPayload) =>
{
    ApiSetToken(tokenPayload.token);
});


export function RegisterApiEffects()
{
    userPreviewsLoadFx.use(async (params) =>
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
}


