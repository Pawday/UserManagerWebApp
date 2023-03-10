import { userPreviewsLoadFx } from "../api/APIEvents";
import {UserRestrictedData} from "./EditScreenStores";
import {createEffect, createEvent, forward} from "effector";

export const updateUsersListEvent = createEvent<Array<UserRestrictedData>>("update_users_list_event");
export const deleteUserRequestEvent = createEvent<UserRestrictedData>("update_user_in_any_dialog");
export const deleteUserRequestFx = createEffect<UserRestrictedData,
    {
        deletionApproved: boolean
    }>("delete_user_request");


forward({
    from: userPreviewsLoadFx.doneData,
    to: updateUsersListEvent
});