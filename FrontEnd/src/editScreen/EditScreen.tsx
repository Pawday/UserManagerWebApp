import React from "react";
import {Container} from "@mui/material";
import EditableUsersTable from "./EditableUsersTable";


export function EditScreen()
{

    return <Container
        disableGutters={true}
        sx={{
            minHeight: "100%"
        }}>


        <EditableUsersTable />

    </Container>
}