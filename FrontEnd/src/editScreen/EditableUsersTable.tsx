import React from "react"
import {
    Container,
    ListItem,
    ListItemText,
    IconButton
} from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';



type UserOverviewDataRow =
{
    userID: string,
    userName: string,
    userEmail: string,
};

function UserRow(props: {user: UserOverviewDataRow}) {
    return <ListItem
    sx={{
        display: "flex",
        justifyContent: "space-between"
    }}
    >
        <ListItem sx={{
            display: "flex",
            justifyContent: "flex-start",
            flexBasis: "90%"
        }}>
            <ListItemText>{props.user.userID}</ListItemText>
            <ListItemText>{props.user.userName}</ListItemText>
            <ListItemText>{props.user.userEmail}</ListItemText>
        </ListItem>

        <ListItem
        sx={{
            flexBasis: "10%",
            justifyContent: "space-around"
        }}
        >
            <IconButton><EditIcon/></IconButton>
            <IconButton color="error"><DeleteIcon/></IconButton>
        </ListItem>
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
    "a16"
]

export default function EditableUsersTable()
{
    return <Container disableGutters>

        {array.map((str)=>{
            return <UserRow user={{
                userID: str,
                userName: str,
                userEmail: str
            }}/>
        })}
    </Container>
}