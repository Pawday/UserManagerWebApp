import { userPreviewsLoadFx } from "../api/APIEvents";
import {EditScreenState, UserRestrictedData} from "./EditScreenStores";
import {createEvent, forward} from "effector";

export const updateUsersListEvent = createEvent<Array<UserRestrictedData>>("update_users_list_event");
export const updateUserInAnyDialog = createEvent<UserRestrictedData>("update_user_in_any_dialog");

export const updateScreenStateEvent = createEvent<EditScreenState>("update_edit_screen_state");


forward({
    from: userPreviewsLoadFx.doneData,
    to: updateUsersListEvent
});