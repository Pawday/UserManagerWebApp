import React from "react";
import {Container} from "@mui/material";
import EditableUsersTable from "./EditableUsersTable";
import {userPreviewsLoadFx} from "../api/APIEvents";


export function EditScreen()
{
    userPreviewsLoadFx(null);

    return <Container
        disableGutters={true}
        sx={{
            minHeight: "100%"
        }}>

        <EditableUsersTable />
    </Container>
}