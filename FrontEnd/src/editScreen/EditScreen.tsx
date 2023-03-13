import React from "react";
import {Container} from "@mui/material";
import EditableUsersTable from "./EditableUsersTable";
import {EditScreenState, editScreenStateStore} from "./EditScreenStores";
import {useStore} from "effector-react";
import {DeleteUserDialog} from "./DeleteUserDialog";
import {AppendUserDialog} from "./AppendUserDialog";
import {EditUserDialog} from "./EditUserDialog";


export function EditScreen()
{

    const editScreenState = useStore(editScreenStateStore);

    let dialog: JSX.Element | null = null;

    if (editScreenState === EditScreenState.DELETE_USER)
        dialog = <DeleteUserDialog/>

    if (editScreenState === EditScreenState.APPEND_USER)
        dialog = <AppendUserDialog/>

    if (editScreenState === EditScreenState.EDIT_USER)
        dialog = <EditUserDialog/>

    return <Container
        disableGutters={true}
        sx={{
            minHeight: "100%"
        }}>

        {dialog}
        <EditableUsersTable />
    </Container>


}