import {createStore} from "effector";
import {deleteUserRequestFx, updateUsersListEvent} from "./EditScreenEvents";

export type UserOverviewDataRow =
{
    userID: string,
    userName: string,
    userEmail: string,
    gender: "MAN" | "WOMAN"
};

export enum EditScreenState
{
    TABLE_VIEW,
    DELETE_USER,
    EDIT_USER,
    APPEND_USER
}

export const usersStore = createStore<Array<UserOverviewDataRow>>([]);
export const editScreenStateStore = createStore<EditScreenState>(EditScreenState.TABLE_VIEW);
export const userToDeleteOnDeleteRequest = createStore<UserOverviewDataRow | null>(null);



editScreenStateStore.on(deleteUserRequestFx, (state,user) =>
{
    return EditScreenState.DELETE_USER;
});

usersStore.on(updateUsersListEvent, (oldUsers, loadedUsers) =>
{
    return loadedUsers;
});