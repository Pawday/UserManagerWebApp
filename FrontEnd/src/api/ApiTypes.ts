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

export type UserRequiredData =
    {
        userID: string,
        userName: string,
        userEmail: string,
        userPhone: string,
        gender: "MAN" | "WOMAN"
    };
export type UserWithFullInfo =
{
    requiredInfo: UserRequiredData,
    aboutString: string | null,
    options: Array<Option> | null
}