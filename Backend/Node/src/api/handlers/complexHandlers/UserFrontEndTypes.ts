export type Option =
{
    optionID: string,
    optionName: string,
    optionSelected: boolean | undefined
};

type UserRequiredData =
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