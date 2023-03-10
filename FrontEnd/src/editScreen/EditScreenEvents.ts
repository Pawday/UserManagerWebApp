import { userPreviewsLoadFx } from "../api/APIEvents";
import {UserOverviewDataRow} from "./EditScreenStores";
import {createEffect, createEvent, forward} from "effector";

export const updateUsersListEvent = createEvent<Array<UserOverviewDataRow>>("update_users_list_event");
export const deleteUserRequestEvent = createEvent<UserOverviewDataRow>("update_user_in_any_dialog");
export const deleteUserRequestFx = createEffect<UserOverviewDataRow,
    {
        deletionApproved: boolean
    }>("delete_user_request");


forward({
    from: userPreviewsLoadFx.doneData,
    to: updateUsersListEvent
});