import {UserLoginCredentials} from "./UserLoginCredentials";
import {createStore} from "effector";
import {FormState} from "./LoginFormState";
import {
    authenticateUserFx,
    formStateUpdateEvent,
    loginUpdateEvent,
    passwordUpdateEvent,
    submitFormEvent
} from "./LoginEvents";


export const defaultCredentials: UserLoginCredentials = new UserLoginCredentials();
export const userLoginCredentialsStore = createStore<UserLoginCredentials>(defaultCredentials);

export const formStateStore = createStore<FormState>(new FormState(true,"", true, "", "", true));

formStateStore
    .on(formStateUpdateEvent, (state, newState) =>
    {
        return newState;
    })
    .on(authenticateUserFx, () =>
    {
        return new FormState(true,"", true, "", "Выполняем вход", false)
    })
    .on(authenticateUserFx.fail, (state, payload) =>
    {
        const error = payload.error;

        const isLoginValid: boolean = error.loginErrorMessage === null;
        const isPasswordValid: boolean = error.passwordErrorMessage === null;

        return new FormState
        (
            isLoginValid,
            error.loginErrorMessage || "" ,
            isPasswordValid,
            error.passwordErrorMessage || "",
            error.errorMessage,
            true
        );
    });



userLoginCredentialsStore
    .on(loginUpdateEvent, (state, newLogin) =>
    {
        return new UserLoginCredentials(newLogin, state.userPassword);
    })
    .on(passwordUpdateEvent, (state, newPassword) =>
    {
        return new UserLoginCredentials(state.userLogin, newPassword);
    });




userLoginCredentialsStore.watch(submitFormEvent, (credentials) =>
    {
        if (!credentials.isFilled)
        {
            formStateUpdateEvent(new FormState(false,"", false, "", "Заполни форму ПОЛНОСТЬЮ", true));
            return;
        }

        if (credentials.userLogin === "error")
        {
            formStateUpdateEvent(new FormState(false, "Тест ошибки для поля ввода login", true, "", "TESTMODE", true));
            return;
        }

        if (credentials.userPassword === "error")
        {
            formStateUpdateEvent(new FormState(true, "", false, "Тест ошибки для поля ввода password", "TESTMODE", true));
            return;
        }


        authenticateUserFx({password: credentials.userPassword, login: credentials.userLogin});
});
