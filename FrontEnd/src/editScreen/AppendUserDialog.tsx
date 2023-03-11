import {createEvent, createStore} from "effector"
import React from "react";
import {Box, Button, FormControlLabel, Icon, InputLabel, Radio, RadioGroup, Stack, Typography} from "@mui/material";
import TextField from '@mui/material/TextField';
import {useStore} from "effector-react";
import {updateScreenStateEvent} from "./EditScreenEvents";
import {EditScreenState} from "./EditScreenStores";

import ManIcon from '@mui/icons-material/Face6Rounded';
import WomanIcon from '@mui/icons-material/Face3Rounded';

const exitDialogEvent = createEvent("exit_user_append_dialog");
const isFormPendingStore = createStore<boolean>(false);


exitDialogEvent.watch(() =>
{
    updateScreenStateEvent(EditScreenState.TABLE_VIEW);
});



const updateUserNameEvent = createEvent<string | null>("update_name");
const userNameStore = createStore<string | null>(null).on(updateUserNameEvent, (state, payload) => payload);



const updateUserEmailEvent = createEvent<string | null>("update_email");
const userEmailStore = createStore<string | null>(null).on(updateUserEmailEvent, (state, payload) => payload);


const updateUserPhoneEvent = createEvent<string | null>("update_phone");
const userPhoneStore = createStore<string | null>(null).on(updateUserPhoneEvent, (state, payload) => payload);


const userRadioGenderStore = createStore<"MAN" | "WOMAN">("MAN")
const radioGenderSelectManEvent = createEvent("radio_gender_select_man");
const radioGenderSelectWomanEvent = createEvent("radio_gender_select_woman");

userRadioGenderStore.on(radioGenderSelectManEvent, () => {return "MAN"});
userRadioGenderStore.on(radioGenderSelectWomanEvent, () => {return "WOMAN"});

export function AppendUserDialog()
{
    const isFormPending = useStore(isFormPendingStore);

    const userName = useStore(userNameStore);
    const userEmail = useStore(userEmailStore);
    const userPhone = useStore(userPhoneStore);
    const radioGender = useStore(userRadioGenderStore);

    let formMessage = <Typography>Добавление пользователя</Typography>;

    const formFilled = (userName && userEmail && userPhone);

    return <Box
        sx={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000000d9",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>

        <Box
            onClick={(e) => {e.stopPropagation()}}
            sx={{
                width: "80%",
                height: "90%",
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                borderRadius: "15px",
                userSelect: "none",
                justifyContent: "space-around"
            }}>
            {formMessage}
            <Stack sx={{
                overflowY: "scroll"
            }} height={"70%"} width={"90%"} spacing={1}>
                <Typography fontStyle={"oblique"}>Основная информация</Typography>
                <TextField sx={{userSelect: "none"}} disabled={true} variant="standard" label="ID" value={"ID не создан: пользователя нет в базе"}></TextField>
                <TextField onChange={e => {
                    updateUserNameEvent(e.target.value)
                }} variant="standard" label="Имя"></TextField>
                <TextField onChange={e => updateUserEmailEvent(e.target.value) } variant="standard" label="Почта"></TextField>
                <TextField onChange={e => updateUserPhoneEvent(e.target.value) } variant="standard" label="Телефон"></TextField>
                <Typography>Пол</Typography>
                <Box>
                    <ManIcon onClick={() => radioGenderSelectManEvent()} fontSize="large" color={radioGender === "MAN" ? "primary" : "disabled"}/>
                    <WomanIcon onClick={() => radioGenderSelectWomanEvent()} fontSize="large" color={radioGender === "WOMAN" ? "primary" : "disabled"}/>
                </Box>
                <Typography fontStyle={"italic"}>Дополнительная информация</Typography>

                <TextField multiline variant="outlined" label="О себе"></TextField>

            </Stack>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "100%"
                }}
            >
                <Button onClick={() => exitDialogEvent()} disabled={isFormPending} variant={"outlined"}>Отмена</Button>
                <Button disabled={isFormPending || !formFilled} color={"success"} variant={"contained"}>Добавить</Button>
            </Box>
        </Box>
    </Box>
}