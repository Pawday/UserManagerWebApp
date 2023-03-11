export type Option =
{
    optionID: string,
    optionName: string,
    optionSelected: boolean | undefined
};

export type OptionGroupWithOptions =
{
    groupName: string,
    groupID: string,
    options: Array<Option>
};