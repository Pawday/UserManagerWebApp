import {createStore, forward} from "effector";
import
{
    updateUsersListEvent,
    updateUserInAnyDialog,
    updateScreenStateEvent
} from "./EditScreenEvents";

export type UserRestrictedData =
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

export const editScreenStateStore = createStore<EditScreenState>(EditScreenState.APPEND_USER);



export const usersStore = createStore<Array<UserRestrictedData>>([]);
export const userInDialogStore = createStore<UserRestrictedData | null>(null);

userInDialogStore.on(updateUserInAnyDialog, (oldUser, newUser) =>
{
    return {...newUser};
});

editScreenStateStore.on(updateScreenStateEvent, (oldState,newState) =>
{
    if (oldState === EditScreenState.TABLE_VIEW)
        return newState;

    if (newState === EditScreenState.TABLE_VIEW)
        return EditScreenState.TABLE_VIEW;

    console.error("EditScreenState somehow requested dialog state being in another dialog state");
});

usersStore.on(updateUsersListEvent, (oldUsers, loadedUsers) =>
{
    return [...loadedUsers];
});