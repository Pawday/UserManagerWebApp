import React from "react";

import {Button, Container, FormGroup, FormLabel, TextField} from "@mui/material";
import {useStore} from "effector-react";

import {formStateStore} from "./LoginStore";
import {loginUpdateEvent, passwordUpdateEvent, submitFormEvent} from "./LoginEvents";


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
            <TextField
                error={!formState.isUserValid} helperText={formState.userInputHint} onChange={event =>
                {
                    loginUpdateEvent(event.target.value);
                }}
                margin={"dense"} id="login-login" label="Логин" variant="outlined"
                disabled={!formState.formAvailable}
            />

            <TextField
                error={!formState.isPasswordValid}
                helperText={formState.passwordInputHint}
                onChange={(event) =>
                {
                    passwordUpdateEvent(event.target.value);
                }}
                margin={"dense"} id="login-password"
                type="password"
                label="Пароль"
                variant="outlined"
                disabled={!formState.formAvailable}
            />

            <Button
                onClick={() => {submitFormEvent()}}
                variant={"contained"}
                disabled={!formState.formAvailable}
            > Войти </Button>

        </FormGroup>

    </Container>
}


export default LoginScreen;