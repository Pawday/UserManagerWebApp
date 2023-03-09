import React from "react";
import {Container} from "@mui/material";
import EditableUsersTable from "./EditableUsersTable";
import {EditScreenState, editScreenStateStore} from "./EditScreenStores";
import {useStore} from "effector-react";
import {DeleteUserDialog} from "./DeleteUserDialog";


export function EditScreen()
{

    const editScreenState = useStore(editScreenStateStore);

    let dialog: JSX.Element | null = null;

    if (editScreenState === EditScreenState.DELETE_USER)
    {

        dialog = <DeleteUserDialog userID={"asd"} userName={"asd"} userEmail={"Asd"} gender={"MAN"}/>
    }

    return <Container
        disableGutters={true}
        sx={{
            minHeight: "100%"
        }}>

        {dialog}
        <EditableUsersTable />
    </Container>


}