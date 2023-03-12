import { userPreviewsLoadFx } from "../api/APIEffects";
import {EditScreenState} from "./EditScreenStores";
import {createEvent, forward} from "effector";
import {UserRequiredData} from "../api/ApiTypes";

export const updateUsersListEvent = createEvent<Array<UserRequiredData>>("update_users_list_event");
export const updateUserInAnyDialog = createEvent<UserRequiredData>("update_user_in_any_dialog");

export const updateScreenStateEvent = createEvent<EditScreenState>("update_edit_screen_state");


forward({
    from: userPreviewsLoadFx.doneData,
    to: updateUsersListEvent
});