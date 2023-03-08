import React from "react"
import {
    Container,
    ListItem,
    IconButton,
    Box, Button
} from "@mui/material"

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from "@mui/icons-material/Add";
import ManIcon from '@mui/icons-material/Face6Rounded';
import WomanIcon from '@mui/icons-material/Face3Rounded';
import usersStore, { UserOverviewDataRow } from "./EditScreenStores";
import { useStore } from "effector-react";



function UserRow(props: {user: UserOverviewDataRow, bgColor: string}) {
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
                flexBasis: "40%"
            }}>
            <Box>{props.user.userID}</Box>
            <Box>{props.user.userName}</Box>
            <Box>{props.user.userEmail}</Box>
            <Box>{(props.user.gender === "MAN") ?
                <ManIcon/> : <WomanIcon/>}</Box>
        </Container>

        <Container disableGutters
        sx={{
            margin: "0",
            display: "flex",
            flexBasis: "60%",
            justifyContent: "flex-end"
        }}
        >
            <IconButton><EditIcon/></IconButton>
            <IconButton color="error"><DeleteIcon/></IconButton>
        </Container>
    </ListItem>
}


export default function EditableUsersTable()
{

    const users = useStore(usersStore)

    return <Container disableGutters
    sx={{
        userSelect: "none",
    }}
    >

        <Box
              sx={{
                  position: "fixed",
                  left: "0",
                  top: "0",
                  zIndex: "10",
                  width: "100%",
                  minHeight: "30px"
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
                        allignItems: "center",
                        flexBasis: "40%"
                    }}>
                    <Box>ID</Box>
                    <Box>Имя</Box>
                    <Box>Email</Box>
                    <Box>Пол</Box>
                </Container>
                <Container disableGutters
                           sx={{
                               margin: "0",
                               display: "flex",
                               flexBasis: "60%",
                               justifyContent: "flex-end"
                           }}>
                    <Button variant="contained" color="success" size="large" startIcon={<AddIcon />}>Добавить</Button>
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
                    gender: userData.gender
                }} bgColor={(index & 1) == 0 ? "#ededed" : "#d9d9d9"}/>
            })}
        </Container>

    </Container>
}