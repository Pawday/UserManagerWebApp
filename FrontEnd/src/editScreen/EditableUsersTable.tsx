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

type UserOverviewDataRow =
{
    userID: string,
    userName: string,
    userEmail: string,
    gender: "MAN" | "WOMAN"
};

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
                allignItems: "center",
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

const array = [
    "a",
    "a1",
    "a2",
    "a3",
    "a4",
    "a5",
    "a6",
    "a7",
    "a8",
    "a9",
    "a10",
    "a11",
    "a12",
    "a13",
    "a14",
    "a15",
    "a17",
    "a18",
    "a19",
    "a20",
    "a21"
]

export default function EditableUsersTable()
{
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
            {array.map((str, index)=>{
                return <UserRow key={str} user={{
                    userID: str,
                    userName: str,
                    userEmail: str,
                    gender: (index & 1) == 0 ? "MAN" : "WOMAN"
                }} bgColor={(index & 1) == 0 ? "#ededed" : "#d9d9d9"}/>
            })}
        </Container>

    </Container>
}