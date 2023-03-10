import React from "react";

import {EditScreenState, editScreenStateStore, userInDialogStore, UserRestrictedData} from "./EditScreenStores";

import {Box, Button, Typography} from "@mui/material";
import {useStore} from "effector-react";
import {createEvent, createStore, forward, sample} from "effector";
import {userDeleteFx, userPreviewsLoadFx} from "../api/APIEvents";


const deleteDialogErrorMessageStore = createStore<string | null>(null);
const deleteDialogFormAvailable = createStore<boolean>(true);

const exitUserDeletionDialog = createEvent("cancel_user_deletion");
const submitUserDeletion = createEvent<UserRestrictedData>("submit_user_deletion");
const deleteErrorMessageInDialog = createEvent("clear_dialog_error_message");

deleteDialogErrorMessageStore.on(deleteErrorMessageInDialog, () => null);

forward({
    from: submitUserDeletion,
    to: userDeleteFx
});

sample({
    clock: exitUserDeletionDialog,
    target: deleteErrorMessageInDialog
});

deleteDialogFormAvailable.on(submitUserDeletion, () => false);
deleteDialogFormAvailable.on(userDeleteFx.doneData, () => true);
deleteDialogFormAvailable.on(userDeleteFx.failData, () => true);

editScreenStateStore.on([exitUserDeletionDialog], () =>
{
    return EditScreenState.TABLE_VIEW;
});

deleteDialogErrorMessageStore.on(userDeleteFx.fail, () =>
{
    return "Что то явно пошло не так (вероятно пропало соединение с сервером API)";
});

deleteDialogErrorMessageStore.on(userDeleteFx.doneData, (state, serverResp) =>
{
    if (!serverResp)
        return "Не получилось удалить пользователя, вероятно был предоставлен неверный userID";

    exitUserDeletionDialog();

    userPreviewsLoadFx(null);
    return null;
});



export function DeleteUserDialog()
{
    const userToDelete = useStore(userInDialogStore);
    const errorMessage = useStore(deleteDialogErrorMessageStore);
    const isFormPending = !useStore(deleteDialogFormAvailable);

    if (userToDelete === null)
    {
        console.warn("[DeleteUserDialog] no user provided, ignoring dialog request");
        return null;
    }

    let formMessage = <Typography fontSize={"1em"}>
        Подтверждение удаления пользователя {userToDelete.userName} [id:{userToDelete.userID}]
    </Typography>;

    if (isFormPending)
        formMessage = <Typography fontSize={"1em"}>
            Пользователь {userToDelete.userName} удаляется
        </Typography>;

    if (errorMessage !== null && !isFormPending)
        formMessage = <Typography fontStyle={{color:"red"}} fontSize={"1em"}>
            {errorMessage}
        </Typography>;

    return <Box
        tabIndex={0}
        onClick={() => {if (!isFormPending) exitUserDeletionDialog()}}
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
            width: "650px",
            height: "150px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "15px",
            userSelect: "none",
            justifyContent: "space-around",
        }}
        >
            {formMessage}

            <Box
            sx={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%"
            }}
            >
                <Button disabled={isFormPending} onClick={() => {if(!isFormPending) exitUserDeletionDialog()}} variant={"outlined"}>Отмена</Button>
                <Button disabled={isFormPending} onClick={() => {if(!isFormPending) submitUserDeletion(userToDelete)}} color={"error"} variant={"contained"}>УДАЛИТЬ</Button>
            </Box>
        </Box>
    </Box>
}