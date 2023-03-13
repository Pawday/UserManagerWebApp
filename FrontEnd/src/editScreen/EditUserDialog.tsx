import React, {useEffect} from "react";

import Box from "@mui/material/Box";

import {EditScreenState, userInDialogStore} from "./EditScreenStores";
import {useStore} from "effector-react";
import {createEvent, createStore, sample} from "effector";
import {UserWithFullInfo} from "../api/ApiTypes";
import {Button, Stack, Typography} from "@mui/material";
import {UserBaseInfoEditableDisplay} from "./UserBaseInfoEditableDisplay";
import TextField from "@mui/material/TextField";
import {OptionGroupsDisplay} from "./OptionGroupsDisplay";
import {updateScreenStateEvent} from "./EditScreenEvents";
import {forward} from "effector/effector.umd";
import {loadFullUserInfoFx} from "../api/APIEffects";

const exitDialogEvent = createEvent("exit_user_edit_dialog");

sample({
    source: exitDialogEvent,
    fn: () => EditScreenState.TABLE_VIEW,
    target: updateScreenStateEvent
});

const userFullInfoStore = createStore<UserWithFullInfo | null>(null)
    .on(loadFullUserInfoFx.doneData, (state, payload) =>
    {
        return payload;
    });


const userUpdatingStore = createStore<boolean>(false);

const loadFullUserInfoEvent = createEvent<string>("load_full_user_info_by_id_event");

forward({
    from: loadFullUserInfoEvent,
    to: loadFullUserInfoFx
});




export function EditUserDialog()
{
    const userToUpdate = useStore(userInDialogStore);
    const userFullInfo = useStore(userFullInfoStore);

    if (userToUpdate === null)
    {
        console.warn("[EditUserDialog] no user provided, ignoring dialog request");
        return null;
    }


    useEffect(() => {loadFullUserInfoEvent(userToUpdate.userID)} ,[]);


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

        {userFullInfo === null ? <LoadingScreen/> : <MainScreen/>}
    </Box>
}





const updateUserNameEvent = createEvent<string>("update_name");
const updateUserEmailEvent = createEvent<string>("update_email");
const updateUserPhoneEvent = createEvent<string>("update_phone");

const updateUserAboutEvent = createEvent<string>("update_about");
const radioGenderSelectManEvent = createEvent("user_gender_select_man_event");
const radioGenderSelectWomanEvent = createEvent("user_gender_select_woman_event");


const userNewValuesStore = createStore<UserWithFullInfo | null>(null);

function MainScreen()
{
    const isFormPending = useStore(userUpdatingStore);
    const fullUserInfo = useStore(userFullInfoStore);
    const userNewValues = useStore(userNewValuesStore);

    if (fullUserInfo === null)
    {
        console.error("[EditUserDialog.MainScreen] No user with info provided")
        return null;
    }


    return <Box
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
        <Typography>Редактирование пользователя</Typography>


        <Box sx={{
            overflowY: "scroll",
            height: "70%",
            width: "90%"
        }}>
            <UserBaseInfoEditableDisplay
                data={{
                    blockDisplay: isFormPending,
                    userID: fullUserInfo.requiredInfo.userID,
                    userName: fullUserInfo.requiredInfo.userName,
                    userEmail: fullUserInfo.requiredInfo.userEmail,
                    userPhone: fullUserInfo.requiredInfo.userPhone,
                    userGender: fullUserInfo.requiredInfo.gender
                }}
                eventHandlers={{
                    changeNameHandler: updateUserNameEvent,
                    changePhoneHandler: updateUserPhoneEvent,
                    changeEmailHandler: updateUserEmailEvent,
                    changeGenderHandler: newGender => {
                        switch (newGender)
                        {
                            case "MAN": radioGenderSelectManEvent(); break;
                            case "WOMAN": radioGenderSelectWomanEvent(); break;
                        }}
                }}
            />
            <Stack spacing={1}>
                <Typography fontStyle={"italic"}>Дополнительная информация</Typography>
                <TextField value={fullUserInfo.aboutString} onChange={(e) => updateUserAboutEvent(e.target.value)} disabled={isFormPending} multiline variant="outlined" label="О себе"></TextField>
                <OptionGroupsDisplay callbacks={{callbackOptionSelect: () => {}, callbackOptionDeselect: () => {}}} optionGroups={[{
                    groupID: "",
                    groupName: "Выбранные опции",
                    options: fullUserInfo.options || []
                }]}/>
            </Stack>
        </Box>

        <Box
            sx={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%"
            }}>
            <Button onClick={() => exitDialogEvent()} disabled={isFormPending} variant={"outlined"}>Отмена</Button>
            <Button disabled={isFormPending || userNewValues === null} variant={"contained"} color={"info"}>Отправить</Button>
        </Box>

    </Box>
}


function LoadingScreen()
{
    return <Typography sx={{userSelect: "none"}} color={"white"} fontSize={"2em"}> Загрузка пользователя...</Typography>
}
