import React from "react";
import {Button, Container} from "@mui/material";
import {appendStringToList, List} from "./List"


export default function Application()
{
    return (
        <Container>
            <Button variant="contained" onClick={() => {appendStringToList("This is working, yeeeees")}}>
                Hello frontend
            </Button>
            <List />
        </Container>
    );
}

