

interface IDatabase
{
    AddUser(user: User) : DBEntityID | null;
    GetUserById(userID: DBEntityID): User | null;

    // Returns null if at least one id not found
    GetUsersByIds(userIDs: DBEntityID[]): User[] | null;

    EditUser(userID: DBEntityID, newValue: User): boolean;
    GetAllUsersIDs(): DBEntityID[];



    AddUserAdditionalInfo(info: UserAdditionalInfo): DBEntityID | null;
    GetUserAdditionalInfo(userID: DBEntityID) : UserAdditionalInfo | null;
    EditUserAdditionalInfo(infoID: DBEntityID, newInfo: UserAdditionalInfo) : boolean;

    BindUserInfoToUser(userId: DBEntityID, userInfoID: DBEntityID) : boolean;


    AddOption(option: SelectableOption): DBEntityID | null;
    GetAllOptionsIDs(): DBEntityID[];


    AddOptionsGroup(group: SelectableOptionGroup): DBEntityID | null;
    GetAllOptionGroupsIDs(): DBEntityID[];

    BindOptionToOptionGroup(optionID: DBEntityID, optionGroupID: DBEntityID): boolean;
}

