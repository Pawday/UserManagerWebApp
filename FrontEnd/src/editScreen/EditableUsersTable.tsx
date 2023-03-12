import React from "react"

import {EditScreenState, usersStore} from "./EditScreenStores";
import {useStore} from "effector-react";
import {updateScreenStateEvent, updateUserInAnyDialog} from "./EditScreenEvents";

import {Box, Button, Container, IconButton, ListItem} from "@mui/material"

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from "@mui/icons-material/Add";
import WomanIcon from '@mui/icons-material/Face6Rounded';
import ManIcon from '@mui/icons-material/Face3Rounded';
import {UserRequiredData} from "../api/ApiTypes";


function UserRow(props: {user: UserRequiredData, bgColor: string}) {
    return <ListItem key={props.user.userID}

    sx={{
        display: "flex",
        padding: "0",
        borderRadius: "10px",
        justifyContent: "space-between",
        backgroundColor: props.bgColor,
    }}
    >
        <Container
            sx={{
                margin: "0",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.3em",
                alignItems: "center",
                flexBasis: "80%"
            }}>
            <Box width={"25%"} sx={{fontSize: "0.5em"}}>{props.user.userID}</Box>
            <Box width={"25%"}>{props.user.userName}</Box>
            <Box width={"25%"}>{props.user.userEmail}</Box>
            <Box width={"25%"}>{(props.user.gender === "MAN") ?
                <ManIcon/> : <WomanIcon/>}</Box>
        </Container>

        <Container disableGutters
        sx={{
            margin: "0",
            display: "flex",
            flexBasis: "20%",
            justifyContent: "flex-end"
        }}
        >
            <IconButton onClick={() => {updateUserInAnyDialog(props.user); updateScreenStateEvent(EditScreenState.EDIT_USER)}}><EditIcon/></IconButton>
            <IconButton onClick={() => {updateUserInAnyDialog(props.user); updateScreenStateEvent(EditScreenState.DELETE_USER)}} color="error"><DeleteIcon/></IconButton>
        </Container>
    </ListItem>
}


export default function EditableUsersTable()
{

    const users = useStore(usersStore);

    if (users === null)
        return null;

    return <Container disableGutters
    sx={{
        userSelect: "none"
    }}
    >

        <Box
              sx={{
                  position: "fixed",
                  left: "0",
                  top: "0",
                  zIndex: "10",
                  width: "100%",
                  minHeight: "30px",
              }}
        >
            <Container disableGutters
            sx={{
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "#86b97c",
                padding: "0",
                borderRadius: "10px"
            }}
            >
                <Container
                    sx={{
                        margin: "0",
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "1.3em",
                        flexBasis: "80%"
                    }}>
                    <Box width={"25%"}>ID</Box>
                    <Box width={"25%"}>Имя</Box>
                    <Box width={"25%"}>Почта</Box>
                    <Box width={"25%"}>Пол</Box>
                </Container>
                <Container disableGutters
                           sx={{
                               margin: "0",
                               display: "flex",
                               flexBasis: "20%",
                               justifyContent: "flex-end"
                           }}>
                    <Button onClick={() => {updateScreenStateEvent(EditScreenState.APPEND_USER)}} variant="contained" color="success" size="large" startIcon={<AddIcon />}>Добавить</Button>
                </Container>
            </Container>


        </Box>
        <Container
            disableGutters
            sx={{
                paddingTop: "45px"
            }}
        >
            {users.map((userData, index)=>{
                return <UserRow key={userData.userID} user={{
                    userID: userData.userID,
                    userName: userData.userName,
                    userEmail: userData.userEmail,
                    userPhone: userData.userPhone,
                    gender: userData.gender
                }} bgColor={(index & 1) == 0 ? "#ededed" : "#d9d9d9"}/>
            })}
        </Container>

    </Container>
}