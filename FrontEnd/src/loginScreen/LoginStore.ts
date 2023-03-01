import {UserLoginCredentials} from "./UserLoginCredentials";
import {createStore} from "effector";
import {formStateUpdateEvent, loginUpdateEvent, passwordUpdateEvent, submitFormEvent} from "./LoginEvents";
import {FormState} from "./LoginFormState";

export const defaultCredentials: UserLoginCredentials = new UserLoginCredentials();
export const userLoginCredentialsStore = createStore<UserLoginCredentials>(defaultCredentials);
export const formStateStore = createStore<FormState>(new FormState(true,"", true, "", "", true));


formStateStore
    .on(formStateUpdateEvent, (state, newState) =>
    {
        return newState;
    });