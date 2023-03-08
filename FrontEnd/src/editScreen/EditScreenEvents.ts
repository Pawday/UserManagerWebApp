import { userPreviewsLoadFx } from "../api/APIEvents";
import {UserOverviewDataRow} from "./EditScreenStores";
import {createEvent} from "effector";

export const updateUsersListEvent = createEvent<Array<UserOverviewDataRow>>("update_users_list_event");

userPreviewsLoadFx.doneData.watch((payload) =>
{
    updateUsersListEvent(payload);
});