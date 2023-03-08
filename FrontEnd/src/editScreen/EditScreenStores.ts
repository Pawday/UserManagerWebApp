import {createStore} from "effector";
import {updateUsersListEvent} from "./EditScreenEvents";

export type UserOverviewDataRow =
{
    userID: string,
    userName: string,
    userEmail: string,
    gender: "MAN" | "WOMAN"
};

const usersStore = createStore<Array<UserOverviewDataRow>>([]);


usersStore.on(updateUsersListEvent, (oldUsers, loadedUsers) =>
{
    return loadedUsers;
});

export default usersStore;