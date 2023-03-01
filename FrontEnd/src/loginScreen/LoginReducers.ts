import {formStateUpdateEvent, loginUpdateEvent, passwordUpdateEvent, submitFormEvent} from "./LoginEvents";
import {UserLoginCredentials} from "./UserLoginCredentials";
import {userLoginCredentialsStore} from "./LoginStore";
import { FormState } from "./LoginFormState";

userLoginCredentialsStore
    .on(loginUpdateEvent, (state, newLogin) =>
    {
        return new UserLoginCredentials(newLogin, state.userPassword);
    })
    .on(passwordUpdateEvent, (state, newPassword) =>
    {
        return new UserLoginCredentials(state.userLogin, newPassword);
    }).on(submitFormEvent, (credentials) =>
{
    if (!credentials.isFilled)
    {
        formStateUpdateEvent(new FormState(false,"", false, "", "Заполни форму ПОЛНОСТЬЮ", true));
        return;
    }

    formStateUpdateEvent(new FormState(true, "", true, "", "Пробуем войти", true));

    if (credentials.userLogin !== "admin")
    {
        formStateUpdateEvent(new FormState(false, "Пока что только admin", true, "", "", true));
        return;
    }

    if (credentials.userPassword === "admin")
    {
        formStateUpdateEvent(new FormState(true, "", false, "Пароль точно не admin, уверяю", "", true));
        return;
    }
});
