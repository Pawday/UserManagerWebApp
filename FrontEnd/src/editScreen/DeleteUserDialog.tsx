import React from "react";

import {UserOverviewDataRow} from "./EditScreenStores";

import {Box} from "@mui/material";



export function DeleteUserDialog(user: UserOverviewDataRow)
{
    return <Box
    sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#000000d9",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 100,
        color: "white"
    }}
    >{user.userName} is about to delete</Box>
}