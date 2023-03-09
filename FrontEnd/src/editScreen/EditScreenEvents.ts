import { userPreviewsLoadFx } from "../api/APIEvents";
import {UserOverviewDataRow} from "./EditScreenStores";
import {createEffect, createEvent} from "effector";

export const updateUsersListEvent = createEvent<Array<UserOverviewDataRow>>("update_users_list_event");

export const deleteUserRequestFx = createEffect<UserOverviewDataRow,
    {
        deletionApproved: boolean
    }>("delete_user_request");

userPreviewsLoadFx.doneData.watch((payload) =>
{
    updateUsersListEvent(payload);
});