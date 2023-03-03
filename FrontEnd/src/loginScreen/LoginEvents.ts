import {createEffect, createEvent} from "effector";
import {FormState} from "./LoginFormState";
import {AuthenticateError, AuthenticateUser} from "./AuthenticateAPI";


export const formStateUpdateEvent = createEvent<FormState>("update_form_state");

export const loginUpdateEvent = createEvent<string>("update_login");
export const passwordUpdateEvent = createEvent<string>("update_password");
export const submitFormEvent = createEvent<void>("form_submit");



export const authenticateUserFx = createEffect<
    {
        login: string,
        password: string
    },
    {
        token: string
    },
    AuthenticateError >(AuthenticateUser);