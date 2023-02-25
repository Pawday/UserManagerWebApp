class InMemoryDBEntityId implements DBEntityID
{
    id: number;

    constructor(id: number)
    {
        this.id = id;
    }
}

class InMemoryDatabase implements IDatabase
{
    private readonly _users: User[];
    private readonly _usersAdditionalInfos: UserAdditionalInfo[];
    private readonly _options: SelectableOption[];
    private readonly _optionGroups: SelectableOptionGroup[];

    constructor()
    {
        this._users = new Array<User>();
        this._usersAdditionalInfos = new Array<UserAdditionalInfo>();
        this._options = new Array<SelectableOption>();
        this._optionGroups = new Array<SelectableOptionGroup>();
    }

    AddUser(user: User): DBEntityID | null
    {
        const index = this._users.push(user);
        return new InMemoryDBEntityId(index);
    }

    GetUserById(id: InMemoryDBEntityId): User | null
    {
        if (this._users.length <= id.id) return null;
        return this._users[id.id];
    }

    GetUsersByIds(id: DBEntityID[]): User[] | null
    {
        if (id.length > this._users.length) return null;

        let foundUsers = this._users.filter((_, userIndex) =>
        {
            return id.find((_, index) => {return index === userIndex});
        });

        if (foundUsers.length != id.length) return null;

        return foundUsers;
    }

    EditUser(userID: InMemoryDBEntityId, newValue: User): boolean
    {
        if (this._users.length <= userID.id) return false;

        this._users[userID.id] = new User(
            newValue.name,
            newValue.email,
            newValue.phone,
            newValue.gender,
            newValue.additionalInfo
        );

        return true;
    }


    GetAllUsersIDs(): DBEntityID[]
    {
        return this._users.map((_, index) => new InMemoryDBEntityId(index));
    }

    AddUserAdditionalInfo(info: UserAdditionalInfo): DBEntityID | null
    {
        const index = this._usersAdditionalInfos.push(info);
        return new InMemoryDBEntityId(index);
    }

    GetUserAdditionalInfo(userID: InMemoryDBEntityId): UserAdditionalInfo | null
    {
        if (this._users.length <= userID.id) return null;
        return this._users[userID.id].additionalInfo;
    }

    EditUserAdditionalInfo(infoID: InMemoryDBEntityId, newInfoValue: UserAdditionalInfo): boolean
    {
        if (this._usersAdditionalInfos.length <= infoID.id) return false;

        this._usersAdditionalInfos[infoID.id] = new UserAdditionalInfo(
            newInfoValue.aboutString,
            newInfoValue.options
        );

        return true;
    }


    BindUserInfoToUser(userId: InMemoryDBEntityId, info: InMemoryDBEntityId): boolean
    {
        if (this._users.length <= userId.id) return false;
        if (this._usersAdditionalInfos.length <= info.id) return false;

        const currentUser = this._users[userId.id];

        this._users[userId.id] = new User(
            currentUser.name,
            currentUser.email,
            currentUser.phone,
            currentUser.gender,
            this._usersAdditionalInfos[info.id]
        );

        return true;
    }

    AddOption(option: SelectableOption): DBEntityID | null
    {
        const index = this._options.push(option);
        return new InMemoryDBEntityId(index);
    }

    GetAllOptionsIDs(): DBEntityID[]
    {
        return this._options.map((_, index) => new InMemoryDBEntityId(index));
    }

    AddOptionsGroup(group: SelectableOptionGroup): DBEntityID | null
    {
        const index = this._optionGroups.push(group);
        return new InMemoryDBEntityId(index);
    }

    GetAllOptionGroupsIDs(): DBEntityID[]
    {
        return this._options.map((_, index) => new InMemoryDBEntityId(index));
    }

    BindOptionToOptionGroup(optionID: InMemoryDBEntityId, optionGroupID: InMemoryDBEntityId): boolean
    {
        if (this._options.length <= optionID.id) return false;
        if (this._optionGroups.length <= optionGroupID.id) return false;

        const optionToBind = this._options[optionID.id];


        const existingOption: SelectableOption | undefined = this._optionGroups[optionGroupID.id].options.find(value => {
            return value.name === optionToBind.name;
        });

        if (existingOption !== undefined) return false;

        let optionGroupBindTo = this._optionGroups[optionGroupID.id];

        this._optionGroups[optionGroupID.id] = new SelectableOptionGroup
        (
            optionGroupBindTo.name,
            [...optionGroupBindTo.options, optionToBind]
        );

        return true;
    }
}