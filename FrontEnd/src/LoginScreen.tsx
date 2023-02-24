import React from "react";

import {set_token_event} from "./Application";
import {createEvent, createStore} from "effector";
import {Button, Container, FormGroup, FormLabel, Input, InputLabel, TextField} from "@mui/material";
import {UserLoginCredentials} from "./UserLoginCredentials";
import {useStore} from "effector-react";


class FormState
{
    private readonly _isUserValid: boolean;
    private readonly _userInputHint: string;
    private readonly _isPasswordValid: boolean;
    private readonly _passwordInputHint: string;

    private readonly _formMessage: string;


    constructor(isUserValid: boolean, userInputErrorMassage: string, isPasswordValid: boolean, passwordInputErrorMassage: string, formMessage: string)
    {
        this._isUserValid = isUserValid;
        this._userInputHint = userInputErrorMassage;
        this._isPasswordValid = isPasswordValid;
        this._passwordInputHint = passwordInputErrorMassage;
        this._formMessage = formMessage;
    }


    get formMessage(): string
    {
        return this._formMessage;
    }

    get isUserValid(): boolean
    {
        return this._isUserValid;
    }

    get userInputHint(): string
    {
        return this._userInputHint;
    }

    get isPasswordValid(): boolean
    {
        return this._isPasswordValid;
    }

    get passwordInputHint(): string
    {
        return this._passwordInputHint;
    }
}

const defaultCredentials: UserLoginCredentials = new UserLoginCredentials();
const userLoginCredentialsStore = createStore<UserLoginCredentials>(defaultCredentials);

const loginUpdate = createEvent<string>("update_login");
const passwordUpdate = createEvent<string>("update_password");
const submitFormEvent = createEvent<void>("form_submit");

const formStateStore = createStore<FormState>(new FormState(true,"", true, "", ""));

const formStateUpdateEvent = createEvent<FormState>("update_form_state");

userLoginCredentialsStore
    .on(loginUpdate, (state, newLogin) =>
    {
        return new UserLoginCredentials(newLogin, state.userPassword);
    })
    .on(passwordUpdate, (state, newPassword) =>
    {
        return new UserLoginCredentials(state.userLogin, newPassword);
    }).on(submitFormEvent, (credentials) =>
    {
        if (!credentials.isFilled)
        {
            formStateUpdateEvent(new FormState(false,"", false, "", "Заполни форму ПОЛНОСТЬЮ"));
            return;
        }

        formStateUpdateEvent(new FormState(true, "", true, "", "Пробуем войти"));

        if (credentials.userLogin !== "admin")
        {
            formStateUpdateEvent(new FormState(false, "Пока что только admin", true, "", ""));
            return;
        }

        if (credentials.userPassword === "admin")
        {
            formStateUpdateEvent(new FormState(true, "", false, "Пароль точно не admin, уверяю", ""));
            return;
        }

        //TODO: make request

        set_token_event(credentials.userLogin);
    });




formStateStore
    .on(formStateUpdateEvent, (state, newState) =>
    {
        return newState;
    });

function LoginScreen()
{

    let formState = useStore(formStateStore);


    return <Container sx={{
        minWidth: "100%",
        minHeight: "100%",
        display : "flex",
        alignItems : "center",
        justifyContent: "center",
        flexDirection : "column",
    }}>
        <FormGroup  sx={{
            display: "flex",
            justifyContent: "space-around",
            minHeight : "40%"
        }} onKeyPress={(event) =>
        {
            if (event.key == "Enter")
                submitFormEvent();
        }}>
            <FormLabel>{formState.formMessage}</FormLabel>
            <TextField sx={{
                transitionDuration : ".5",
                transitionProperty : "all"
            }} error={!formState.isUserValid} helperText={formState.userInputHint} onChange={event =>
            {
                loginUpdate(event.target.value);
            }} margin={"dense"} id="login-login" label="Логин" variant="outlined" />

            <TextField error={!formState.isPasswordValid} helperText={formState.passwordInputHint} onChange={(event) =>
            {
                passwordUpdate(event.target.value);
            }} margin={"dense"} id="login-password" type="password" label="Пароль" variant="outlined" />

            <Button onClick={() => {submitFormEvent()}} variant={"contained"}> Войти </Button>

        </FormGroup>

    </Container>
}


export default LoginScreen;