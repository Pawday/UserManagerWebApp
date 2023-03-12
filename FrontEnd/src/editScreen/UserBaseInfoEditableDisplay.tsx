import {Box, Stack, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import ManIcon from "@mui/icons-material/Face6Rounded";
import WomanIcon from "@mui/icons-material/Face3Rounded";
import React from "react";



type UserEditableDisplayProps =
{
    data:
    {
        blockDisplay: boolean,
        userID: string,
        userName: string,
        userEmail: string,
        userPhone: string,
        userGender: "MAN" | "WOMAN"
    },

    eventHandlers:
    {
        changeNameHandler: (newName: string) => void,
        changeEmailHandler: (newEmail: string) => void,
        changePhoneHandler: (newPhone: string) => void,
        changeGenderHandler: (newGender: "MAN" | "WOMAN") => void
    }
}

export function UserBaseInfoEditableDisplay(props: UserEditableDisplayProps)
{
    return <Stack spacing={1}>
        <Typography fontStyle={"oblique"}>Основная информация</Typography>
        <TextField value={props.data.userID} sx={{userSelect: "none"}} disabled={true} variant="standard" label="ID" ></TextField>
        <TextField value={props.data.userName} disabled={props.data.blockDisplay} onChange={e => {
            props.eventHandlers.changeNameHandler(e.target.value)
        }} variant="standard" label="Имя"></TextField>
        <TextField
            value={props.data.userEmail}
            disabled={props.data.blockDisplay}
            onChange={e => { if (!props.data.blockDisplay) props.eventHandlers.changeEmailHandler(e.target.value)} }
            variant="standard"
            label="Почта"/>
        <TextField
            value={props.data.userPhone}
            disabled={props.data.blockDisplay}
            onChange={e => { if(!props.data.blockDisplay) props.eventHandlers.changePhoneHandler(e.target.value)} }
            variant="standard"
            label="Телефон"/>
        <Typography>Пол</Typography>
        <Box>
            <ManIcon onClick={() =>
            {
                if (!props.data.blockDisplay)
                    props.eventHandlers.changeGenderHandler("MAN");
            }} fontSize="large" color={props.data.userGender === "MAN" ? "primary" : "disabled"}/>
            <WomanIcon onClick={() => {
                if (!props.data.blockDisplay)
                    props.eventHandlers.changeGenderHandler("WOMAN");
            }} fontSize="large" color={props.data.userGender === "WOMAN" ? "primary" : "disabled"}/>
        </Box>
    </Stack>
}