import React from "react";

import {createEvent, createStore} from "effector";
import {useStore} from "effector-react";
import {ListItemText, Stack} from "@mui/material";


export const messageListStore = createStore<string[]>([]);
export const appendStringToList = createEvent<string>();


messageListStore.on(appendStringToList, (state, newElement) =>
{
    return ([...state, newElement]);
});

export const List = () =>
{
    let list = useStore<string[]>(messageListStore);

    let elements = list.map(value =>
    {
        return <ListItemText primary={value}/>
    });

    return <Stack >
        {elements}
    </Stack>

}