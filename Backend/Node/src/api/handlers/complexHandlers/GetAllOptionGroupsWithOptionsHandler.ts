import {Request, Response} from "express";
import {APIError, APIErrorType, APIResponse} from "../../APIResponse";
import APIDatabase from "../../APIDatabase";
import {SelectableOption} from "../../database/entities/SelectableOption";
import {SelectableOptionGroup} from "../../database/entities/SelectableOptionGroup";


/*
return object example:

response:
[
    {
        groupName: "option_group_1",
        groupID: "mongo or whatever id string"
        options:
        [
            {optionID: "mongo or whatever id string", optionName: "g1_option_1"},
            {optionID: "mongo or whatever id string", optionName: "g1_option_2"},
            {optionID: "mongo or whatever id string", optionName: "g1_option_3"},
            {optionID: "mongo or whatever id string", optionName: "g1_option_4"}
        ]
    },
    {
        groupName: "option_group_2",
        groupID: "mongo or whatever id string"
        options:
        [
            {optionID: "mongo or whatever id string", optionName: "g2_option_1"},
            {optionID: "mongo or whatever id string", optionName: "g2_option_2"},
            {optionID: "mongo or whatever id string", optionName: "g2_option_3"},
            {optionID: "mongo or whatever id string", optionName: "g2_option_4"}
        ]
    }
]

*/


type Option =
{
    optionID: string,
    optionName: string
};

type OptionGroupWithOptions =
{
    groupName: string,
    groupID: string,
    options: Array<Option>
};


export async function GetAllOptionGroupsWithOptionsHandler(req: Request, resp: Response)
{
    let apiResp = new APIResponse();

    const optionsGroupsIDs = await APIDatabase().GetAllOptionGroupsIDs();

    if (optionsGroupsIDs === null)
    {
        apiResp.error = new APIError(APIErrorType.DATABASE_ERROR, "Getting groups ids error");
        apiResp.SendTo(resp);
        return;
    }

    const optionGroups = await APIDatabase().GetOptionsByIDs(optionsGroupsIDs);

    if (optionGroups === null)
    {
        apiResp.error = new APIError(APIErrorType.DATABASE_ERROR, "Getting groups error");
        apiResp.SendTo(resp);
        return;
    }

    let returnVal: Array<OptionGroupWithOptions> = [];

    // Nesting level according to return type
    let hasErrorInLoop: boolean = false;

    for (let groupIndex = 0; groupIndex < optionsGroupsIDs.length && false === hasErrorInLoop; groupIndex++)
    {
        const currentGroupID = optionsGroupsIDs[groupIndex];
        const currentGroup = await APIDatabase().GetOptionGroupByID(currentGroupID);

        if (currentGroup === null)
        {
            hasErrorInLoop = true;
            continue;
        }

        const currentGroupOptionsIds = await APIDatabase().GetOptionsIDsByGroupID(currentGroupID);

        if (currentGroupOptionsIds === null)
        {
            hasErrorInLoop = true;
            continue;
        }

        const currentGroupOptions = await APIDatabase().GetOptionsByIDs(currentGroupOptionsIds);

        if (currentGroupOptions === null)
        {
            hasErrorInLoop = true;
            continue;
        }

        let groupOptions: Array<Option> = [];

        for (let optionIndex = 0; optionIndex < currentGroupOptionsIds.length; optionIndex++)
        {
            groupOptions.push({
                    optionName: SelectableOption.AsPublicObject(currentGroupOptions[optionIndex]).name,
                    optionID: currentGroupOptionsIds[optionIndex].toString()
                });
        }


        let currentOptionGroupWithItsOptions: OptionGroupWithOptions =
            {
                groupName: SelectableOptionGroup.AsPublicObject(currentGroup).name,
                groupID: currentGroupID.toString(),
                options: groupOptions
            }

        returnVal.push(currentOptionGroupWithItsOptions);
    }

    if (hasErrorInLoop)
    {
        apiResp.error = new APIError(APIErrorType.UNKNOWN_ERROR,
            "Something wrong with constructing return tree (probably database fault)")
        apiResp.SendTo(resp);
        return;
    }

    apiResp.response = returnVal;
    apiResp.SendTo(resp);
}