import {createStore, forward} from "effector";
import {deleteUserRequestFx, updateUsersListEvent, deleteUserRequestEvent} from "./EditScreenEvents";

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
export const editScreenStateStore = createStore<EditScreenState>(EditScreenState.EDIT_USER);
export const userInDialogStore = createStore<UserOverviewDataRow | null>(null);

userInDialogStore.on(deleteUserRequestEvent, (oldUser, newUser) =>
{
    return {...newUser};
});

editScreenStateStore.on(deleteUserRequestEvent, () =>
{
    return EditScreenState.DELETE_USER;
});

forward({
    from: deleteUserRequestEvent,
    to: deleteUserRequestFx
});

usersStore.on(updateUsersListEvent, (oldUsers, loadedUsers) =>
{
    return [...loadedUsers];
});