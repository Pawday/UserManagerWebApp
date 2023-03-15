import React, {useEffect} from "react";

import Box from "@mui/material/Box";

import {EditScreenState, userInDialogStore} from "./EditScreenStores";
import {useStore} from "effector-react";
import {createEvent, createStore, guard, sample} from "effector";
import {Option, OptionGroupWithOptions, UserRequiredData, UserWithFullInfo} from "../api/ApiTypes";
import {Button, Stack, Typography} from "@mui/material";
import {UserBaseInfoEditableDisplay} from "./UserBaseInfoEditableDisplay";
import TextField from "@mui/material/TextField";
import {OptionGroupsDisplay} from "./OptionGroupsDisplay";
import {updateScreenStateEvent} from "./EditScreenEvents";
import {forward} from "effector/effector.umd";
import {
    addUserWithFullInfoFx,
    loadFullUserInfoFx,
    optionsLoadFx,
    updateUserWithFullInfo,
    userPreviewsLoadFx
} from "../api/APIEffects";

const exitDialogEvent = createEvent("exit_user_edit_dialog");
const clearStoresEvent = createEvent("clear_stores_in_update_dialog_event");


const updateUserOnServerEvent = createEvent<UserWithFullInfo>("send_updated_user_event")

forward({
    from: updateUserOnServerEvent,
    to: updateUserWithFullInfo
});

sample({
    source: exitDialogEvent,
    fn: () => EditScreenState.TABLE_VIEW,
    target: updateScreenStateEvent
});

forward({
    from: exitDialogEvent,
    to: clearStoresEvent
})



const oldUserDataStore = createStore<UserWithFullInfo | null>(null)
    .on(loadFullUserInfoFx.doneData, (state, payload) =>
    {
        return payload;
    });


const userUpdatingStore = createStore<boolean>(false);



userUpdatingStore.on(updateUserWithFullInfo.doneData, (state, updateStatus) =>
{
    return !updateStatus;
});

userUpdatingStore.on(updateUserOnServerEvent, () => true);

guard({
    source: updateUserWithFullInfo.doneData,
    filter: (updateStatus) => updateStatus,
    target: [userPreviewsLoadFx, exitDialogEvent]
});

const loadFullUserInfoEvent = createEvent<string>("load_full_user_info_by_id_event");

forward({
    from: loadFullUserInfoEvent,
    to: loadFullUserInfoFx
});


export function EditUserDialog()
{
    const userToUpdate = useStore(userInDialogStore);
    const userFullInfo = useStore(userNewValuesStore);

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





const updateUserAboutEvent = createEvent<string>("update_about");

const userNewValuesStore = createStore<UserWithFullInfo | null>(null);

userNewValuesStore.on(loadFullUserInfoFx.doneData, (state, payload) => {return payload});
userNewValuesStore.on(clearStoresEvent, () => {return null});



const updateNameEvent = createEvent<string>("update_name_event");
const updatePhoneEvent = createEvent<string>("update_phone_event");
const updateEmailEvent = createEvent<string>("update_email_event");
const updateGenderEvent = createEvent<"MAN" | "WOMAN">("update_gender_event");


function GeneralRequiredInfoReducer(
    oldState: UserWithFullInfo | null,
    reqInfoModifier: (dataToReduce: UserRequiredData) => void): UserWithFullInfo | null
{
    if (oldState === null) return null;
    const oldReq = oldState.requiredInfo;
    const newReq = {...oldReq};

    reqInfoModifier(newReq);

    let newState = {...oldState};
    newState.requiredInfo = newReq;
    return newState;
}

userNewValuesStore
    .on(updateNameEvent, (oldState, newName) => GeneralRequiredInfoReducer(oldState, (data) =>
    {data.userName = newName}))
    .on(updateEmailEvent, (oldState, newEmail) => GeneralRequiredInfoReducer(oldState, (data) =>
    {data.userEmail = newEmail}))
    .on(updatePhoneEvent, (oldState, newPhone) => GeneralRequiredInfoReducer(oldState, (data) =>
    {data.userPhone = newPhone}))
    .on(updateGenderEvent, (oldState, newGender) => GeneralRequiredInfoReducer(oldState, (data) =>
    {data.gender = newGender}))
    .on(updateUserAboutEvent, (oldState, newAbout) =>
    {
        if (oldState === null) return null;

        let newState = {...oldState};

        newState.aboutString = newAbout;

        return newState;
    });


const optionSelectEvent = createEvent<Option>("select_option_in_edit_dialog");
const optionDeSelectEvent = createEvent<Option>("deselect_option_in_edit_dialog");



const optionGroupSelectOptionReducer = (oldState: UserWithFullInfo | null, selectedOption: Option) =>
{
    if (oldState === null) return null;

    if (oldState.options === null)
        return oldState;

    let newOptions = [...oldState.options];

    const selectedOptionIndex = newOptions.findIndex((op) => {
        return selectedOption.optionID === op.optionID;
    });

    if (selectedOptionIndex === -1)
    {
        selectedOption.optionSelected = true;
        newOptions.push(selectedOption);
    }
    else
        newOptions[selectedOptionIndex].optionSelected = true;

    let newState = {...oldState} as UserWithFullInfo;

    newState.options = newOptions;

    return newState;
}

const optionGroupDeselectOptionReducer = (oldState: UserWithFullInfo | null, deselectedOption: Option) =>
{
    if (oldState === null) return null;

    if (oldState.options === null)
        return oldState;

    const newOptions = [...oldState.options].filter((op) =>
    {
        if (deselectedOption.optionID === op.optionID) return false;
        return true;
    });

    let newState = {...oldState} as UserWithFullInfo;

    newState.options = newOptions;

    return newState;
}

userNewValuesStore.on(optionSelectEvent, optionGroupSelectOptionReducer);
userNewValuesStore.on(optionDeSelectEvent, optionGroupDeselectOptionReducer);


function AreFullInfoEqs(left: UserWithFullInfo, right: UserWithFullInfo): boolean
{
    const lReq = left.requiredInfo;
    const rReq = right.requiredInfo;
    if (lReq.userID !== rReq.userID) return false;
    if (lReq.userName !== rReq.userName) return false;
    if (lReq.userEmail !== rReq.userEmail) return false;
    if (lReq.userPhone !== rReq.userPhone) return false;
    if (lReq.gender !== rReq.gender) return false;

    if (left.aboutString !== right.aboutString) return false;

    const lOpts = left.options;
    const rOpts = right.options;

    if (lOpts === null && rOpts === null) return true;
    if (lOpts !== null && rOpts === null) return false;
    if (lOpts === null && rOpts !== null) return false;

    if (!(lOpts !== null && rOpts !== null)) return false;

    if (lOpts.length !== rOpts.length) return false;


    for (let lOpIndex = 0; lOpIndex < lOpts.length; lOpIndex++)
        if (-1 === rOpts.findIndex((rOpt) => {
            return lOpts[lOpIndex].optionID === rOpt.optionID
        })) return false;



    return true;
}


const allOptionsGroupsStore = createStore<Array<OptionGroupWithOptions> | null>(null);

const requestAllOptionGroupsFromServer = createEvent("request_all_options_for_edit_dialog");

sample({
    source: requestAllOptionGroupsFromServer,
    target: optionsLoadFx
});

allOptionsGroupsStore.on(optionsLoadFx.doneData, (oldState, data) => {return data});
allOptionsGroupsStore.on(clearStoresEvent, (oldState, data) => {return null});




function MainScreen()
{
    const isFormPending = useStore(userUpdatingStore);
    const oldUserData = useStore(oldUserDataStore);
    const newUserData = useStore(userNewValuesStore);

    const allOptionsGroups = useStore(allOptionsGroupsStore);

    let canSendNewData: boolean = oldUserData === null || newUserData === null ? false : !AreFullInfoEqs(oldUserData, newUserData);


    if (oldUserData === null)
    {
        console.error("[EditUserDialog.MainScreen] No user with info provided")
        return null;
    }

    if (newUserData === null)
    {
        console.error("[EditUserDialog.MainScreen] user not copied to new val store")
        return null;
    }

    canSendNewData &&= newUserData.requiredInfo.userName.length !== 0;
    canSendNewData &&= newUserData.requiredInfo.userEmail.length !== 0;
    canSendNewData &&= newUserData.requiredInfo.userPhone.length !== 0;


    let optionGroupToDisplay;

    const newOptions = newUserData.options;


    if (allOptionsGroups !== null && newOptions !== null)
    {
        allOptionsGroups.forEach((group) =>
        {
            group.options.forEach((option) => option.optionSelected = false);

            group.options.forEach((option) =>
            {
                option.optionSelected = undefined !== newOptions.find((op) => {return op.optionID === option.optionID});
            });
        });
    }

    if (allOptionsGroups === null)
        optionGroupToDisplay = <OptionGroupsDisplay disabled callbacks={{callbackOptionSelect: () => {} /*optionSelectEvent*/, callbackOptionDeselect: () => {} /*optionDeSelectEvent*/}} optionGroups={[{
            groupID: "",
            groupName: "Выбранные опции",
            options: newOptions || []
        }]}/>
    else
        optionGroupToDisplay = <OptionGroupsDisplay disabled callbacks={{callbackOptionSelect: /*optionSelectEvent*/ () => {}, callbackOptionDeselect: /*optionDeSelectEvent*/ () => {}}} optionGroups={allOptionsGroups}/>



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
                    blockDisplay: isFormPending && canSendNewData,
                    userID: newUserData.requiredInfo.userID,
                    userName: newUserData.requiredInfo.userName,
                    userEmail: newUserData.requiredInfo.userEmail,
                    userPhone: newUserData.requiredInfo.userPhone,
                    userGender: newUserData.requiredInfo.gender
                }}
                eventHandlers={{
                    changeNameHandler: updateNameEvent,
                    changePhoneHandler: updatePhoneEvent,
                    changeEmailHandler: updateEmailEvent,
                    changeGenderHandler: updateGenderEvent
                }}
            />
            <Stack spacing={1}>
                <Typography fontStyle={"italic"}>Дополнительная информация</Typography>
                <TextField value={newUserData.aboutString} onChange={(e) => updateUserAboutEvent(e.target.value)} disabled={isFormPending} multiline variant="outlined" label="О себе"></TextField>


                {
                    allOptionsGroups === null ?
                        <Button onClick={() => {requestAllOptionGroupsFromServer()}} disabled={isFormPending} variant={"outlined"}>Загрузить все опции</Button>
                        : <></>
                }
                {optionGroupToDisplay}

            </Stack>
        </Box>

        <Box
            sx={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%"
            }}>
            <Button onClick={() => exitDialogEvent()} disabled={isFormPending} variant={"outlined"}>Отмена</Button>
            <Button onClick={() => {updateUserOnServerEvent(newUserData)}} disabled={!canSendNewData || isFormPending} variant={"contained"} color={"info"}>Отправить</Button>
        </Box>

    </Box>
}


function LoadingScreen()
{
    return <Typography sx={{userSelect: "none"}} color={"white"} fontSize={"2em"}> Загрузка пользователя...</Typography>
}
