import React from "react";
import {Button, Container} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditableUsersTable from "./EditableUsersTable";


export function EditScreen()
{

    return <Container
        disableGutters={true}
        sx={{
            minHeight: "100%"
        }}>

        <Button variant="contained" color="success" startIcon={<AddIcon />}>Добавить</Button>

        <EditableUsersTable />

    </Container>
}