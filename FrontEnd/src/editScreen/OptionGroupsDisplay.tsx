import React from "react";

import {Option, OptionGroupWithOptions} from "../api/ApiTypes";
import {Checkbox, Container, FormControlLabel, Stack, Typography} from "@mui/material";

interface OptionSelectCallback
{
    (selectedOption: Option): void
}

interface OptionDeselectCallback
{
    (deselectedOption: Option): void
}

type OptionDisplayCallbacksType =
{
    callbackOptionSelect: OptionSelectCallback,
    callbackOptionDeselect: OptionDeselectCallback
}

export function OptionGroupsDisplay(props: {optionGroups: Array<OptionGroupWithOptions>, callbacks: OptionDisplayCallbacksType})
{
    const groups = props.optionGroups;
    const allOptions = groups.map((optionGroup) =>
    {
        return <Container key={optionGroup.groupID}>
            <Typography>{optionGroup.groupName}</Typography>
            <Stack>
                {optionGroup.options.map((option) =>
                {
                    return <FormControlLabel key={option.optionID}
                        control=
                            {<Checkbox
                                onChange={(e) =>
                                {
                                    if (e.target.checked)
                                        props.callbacks.callbackOptionSelect(option);
                                    else
                                        props.callbacks.callbackOptionDeselect(option);
                                }}
                                checked={option.optionSelected || false}
                            />}
                        label={option.optionName}></FormControlLabel>
                })}
            </Stack>
        </Container>
    });

    return <Stack>
        {allOptions}
    </Stack>
}