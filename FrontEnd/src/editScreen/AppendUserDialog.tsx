import React from "react";

import {createEvent, createStore, forward, guard, sample} from "effector"
import {Box, Button, Stack, Typography} from "@mui/material";
import TextField from '@mui/material/TextField';
import {useStore} from "effector-react";
import {updateScreenStateEvent} from "./EditScreenEvents";
import {EditScreenState} from "./EditScreenStores";

import {UserWithFullInfo, Option, OptionGroupWithOptions} from "../api/ApiTypes";

import {addUserWithFullInfoFx, optionsLoadFx, userPreviewsLoadFx} from "../api/APIEffects";
import {OptionGroupsDisplay} from "./OptionGroupsDisplay";
import {UserBaseInfoEditableDisplay} from "./UserBaseInfoEditableDisplay";


const saveUserEvent = createEvent<UserWithFullInfo>("save_user");

forward({
    from: saveUserEvent,
    to: addUserWithFullInfoFx
});


const exitDialogEvent = createEvent("exit_user_append_dialog");
const isFormPendingStore = createStore<boolean>(false)
    .on(saveUserEvent, () => true)
    .on(addUserWithFullInfoFx.done, () => false);

guard({
    source: addUserWithFullInfoFx.doneData,
    filter: payload => {
        return payload;
    },
    target: [exitDialogEvent, userPreviewsLoadFx]
});

const clearStores = createEvent("clear_user_append_dialog_stores");

const updateUserNameEvent = createEvent<string | null>("update_name");
const userNameStore = createStore<string | null>(null)
    .on(updateUserNameEvent, (state, payload) => payload)
    .on(clearStores, () => {return null});


const updateUserEmailEvent = createEvent<string | null>("update_email");
const userEmailStore = createStore<string | null>(null)
    .on(updateUserEmailEvent, (state, payload) => payload)
    .on(clearStores, () => {return null});


const updateUserPhoneEvent = createEvent<string | null>("update_phone");
const userPhoneStore = createStore<string | null>(null)
    .on(updateUserPhoneEvent, (state, payload) => payload)
    .on(clearStores, () => {return null});


const allOptionGroupsStore = createStore<Array<OptionGroupWithOptions> | null>(null)
    .on(clearStores, () => {return null});

const updateAboutString = createEvent<string>("update_about_string")
const userAboutStringStore = createStore<string | null>(null)
    .on(updateAboutString, (old, payload) => {return payload})
    .on(clearStores, () => {return null});

const requestAllOptionGroupsFromServer = createEvent("request_all_options_for_add_dialog");

allOptionGroupsStore.on(optionsLoadFx.doneData, (oldState, payload) =>
{
    return payload;
});

sample({
    source: requestAllOptionGroupsFromServer,
    target: optionsLoadFx
});

forward({
    from: exitDialogEvent,
    to: clearStores
});

sample({
    source: exitDialogEvent,
    fn: () => EditScreenState.TABLE_VIEW,
    target: updateScreenStateEvent
});

const optionSelectEvent = createEvent<Option>("option_select_event");
const optionUnselectEvent = createEvent<Option>("option_unselect_event");

function generalOptionGroupReducer(state: Array<OptionGroupWithOptions> | null, payload: Option, optionSelectedState: boolean)
{
    if (state === null)
        return null;

    let updatedOptionIndexInItsGroup: number = -1;

    const groupWithUpdatedOption = state.find((group) =>
    {
        const index = group.options.findIndex((option) => {return option.optionID === payload.optionID});
        if (-1 !== index)
        {
            updatedOptionIndexInItsGroup = index;
            return true;
        }
        return false;
    });

    if (groupWithUpdatedOption === undefined)
    {
        console.error("[AppendUserDialog.updateOption] Weird situation, option exist, but associated with it group does not");
        return state;
    }

    const updatedOption = {...groupWithUpdatedOption.options[updatedOptionIndexInItsGroup]};

    updatedOption.optionSelected = optionSelectedState;

    let newState = [...state];

    groupWithUpdatedOption.options[updatedOptionIndexInItsGroup] = updatedOption;

    return newState;
}

allOptionGroupsStore.on(optionSelectEvent, (state, payload) => generalOptionGroupReducer(state, payload, true));
allOptionGroupsStore.on(optionUnselectEvent, (state, payload) => generalOptionGroupReducer(state, payload, false))

const userRadioGenderStore = createStore<"MAN" | "WOMAN">("MAN")
const radioGenderSelectManEvent = createEvent("radio_gender_select_man");
const radioGenderSelectWomanEvent = createEvent("radio_gender_select_woman");

userRadioGenderStore.on(radioGenderSelectManEvent, () => {return "MAN"});
userRadioGenderStore.on(radioGenderSelectWomanEvent, () => {return "WOMAN"});

function GetSelectedOptionsFromGroups(groups: Array<OptionGroupWithOptions>): Array<Option>
{
    let selectedOptions = new Array<Option>();

    groups.forEach((group) =>
    {
        group.options.forEach((option) =>
        {
            if (option.optionSelected)
                selectedOptions.push(option);
        });
    });

    return selectedOptions;
}

export function AppendUserDialog()
{
    let isFormPending = useStore(isFormPendingStore);

    const userName = useStore(userNameStore);
    const userEmail = useStore(userEmailStore);
    const userPhone = useStore(userPhoneStore);
    const radioGender = useStore(userRadioGenderStore);
    const allOptionsGroups = useStore(allOptionGroupsStore);
    const aboutString = useStore(userAboutStringStore);

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
            <Box sx={{
                overflowY: "scroll",
                height: "70%",
                width: "90%"
                }}>
                <UserBaseInfoEditableDisplay
                    data={{
                        userID: "Пользователь не добавлен",
                        blockDisplay: isFormPending,
                        userName: userName || "",
                        userEmail: userEmail || "",
                        userPhone: userPhone || "",
                        userGender: radioGender
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
                    <TextField value={aboutString} onChange={(e) => updateAboutString(e.target.value)} disabled={isFormPending} multiline variant="outlined" label="О себе"></TextField>
                    {
                        allOptionsGroups === null
                            ? <Button onClick={() => requestAllOptionGroupsFromServer()} disabled={isFormPending} variant={"outlined"}>Загрузить все опции</Button>
                            : <OptionGroupsDisplay
                                optionGroups={allOptionsGroups}
                                callbacks={{
                                    callbackOptionSelect: (selectedOption) => {optionSelectEvent(selectedOption)},
                                    callbackOptionDeselect: (deselectedOption) => {optionUnselectEvent(deselectedOption)}
                                }}
                            />
                    }
                </Stack>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "100%"
                }}>
                <Button onClick={() => exitDialogEvent()} disabled={isFormPending} variant={"outlined"}>Отмена</Button>
                <Button onClick={() =>
                {
                    if (userName === null || userName === "") return;
                    if (userEmail === null || userEmail === "") return;
                    if (userPhone === null || userPhone === "") return;


                    saveUserEvent({
                        requiredInfo:
                        {
                            userID: "NO ID WHEN APPENDING",
                            userName: userName,
                            userEmail: userEmail,
                            userPhone: userPhone,
                            gender: radioGender
                        },
                        aboutString: aboutString,
                        options: allOptionsGroups === null ? [] : GetSelectedOptionsFromGroups(allOptionsGroups)
                    });

                }} disabled={isFormPending || !formFilled} color={"success"} variant={"contained"}>Добавить</Button>
            </Box>
        </Box>
    </Box>
}