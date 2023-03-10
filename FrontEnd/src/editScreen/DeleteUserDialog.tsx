import React, {useEffect, useRef} from "react";

import {EditScreenState, editScreenStateStore, userInDialogStore} from "./EditScreenStores";

import {Box, Button, Typography} from "@mui/material";
import {useStore} from "effector-react";
import {createEvent} from "effector";

const cancelUserDeletion = createEvent("cancel_user_deletion");

editScreenStateStore.on(cancelUserDeletion, () =>
{
    return EditScreenState.TABLE_VIEW;
});

export function DeleteUserDialog()
{
    const userToDelete = useStore(userInDialogStore);

    const thisElemRef = useRef<HTMLElement | null>(null);

    useEffect(() =>
    {
        if (thisElemRef === null)
            return;

        thisElemRef.current?.focus();
    });

    if (userToDelete === null)
    {
        console.warn("[DeleteUserDialog] no user provided, ignoring dialog request");
        return null;
    }

    return <Box
        tabIndex={0}
        onClick={() => cancelUserDeletion()}
        sx={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "#000000d9",
            position: "absolute",
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
            borderRadius: "30px",
            userSelect: "none",
            justifyContent: "space-around",
        }}
        >
        <Typography fontStyle={{color:"red"}} fontSize={"1.1em"}>
            Удаление пользователя {userToDelete.userName} [id:{userToDelete.userID}]
        </Typography>
            <Box
            sx={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%"
            }}
            >
                <Button onClick={() => cancelUserDeletion()} variant={"outlined"}>Отмена</Button>
                <Button onClick={() => {console.log("Delete " + userToDelete?.userName)}} color={"error"} variant={"contained"}>УДАЛИТЬ</Button>
            </Box>
        </Box>
    </Box>
}