import {DBEntityID} from "../entities/DBEntityID";
import {User} from "../entities/User";
import {UserAdditionalInfo} from "../entities/UserAdditionalInfo";
import {SelectableOption} from "../entities/SelectableOption";
import {SelectableOptionGroup} from "../entities/SelectableOptionGroup";

class InMemoryDBEntityId implements DBEntityID
{
    id: number;

    constructor(id: number)
    {
        this.id = id;
    }
}

export class InMemoryDatabase implements IDatabase
{
    private readonly _users: User[];
    private readonly _usersAdditionalInfos: UserAdditionalInfo[];
    private readonly _options: SelectableOption[];
    private readonly _optionGroups: SelectableOptionGroup[];

    private _isConnected: boolean;

    constructor()
    {
        this._isConnected = true;

        this._users = new Array<User>();
        this._usersAdditionalInfos = new Array<UserAdditionalInfo>();
        this._options = new Array<SelectableOption>();
        this._optionGroups = new Array<SelectableOptionGroup>();
    }

    CheckConnection(): boolean
    {
        return this._isConnected;
    }

    ConvertToDBEntityIDFrom<Type>(value: Type): DBEntityID | null
    {
        if (typeof(value) !== "string") return null;

        let number = parseInt(value);

        if (isNaN(number)) return null;

        return new InMemoryDBEntityId(number);
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

    GetUsersByIds(usersIDs: InMemoryDBEntityId[]): User[] | null
    {
        if (usersIDs.length > this._users.length) return null;

        // Hello O(n^2)
        let foundUsers = this._users.filter((_, userIndex) =>
        {
            return usersIDs.find((userID) => {return userID.id === userIndex});
        });

        if (foundUsers.length != usersIDs.length) return null;

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

    GetOptionById(optionId: InMemoryDBEntityId): SelectableOption | null
    {
        if (this._options.length <= optionId.id) return null;
        return this._options[optionId.id];
    }

    GetOptionsByIDs(optionIDs: InMemoryDBEntityId[]): SelectableOption[] | null
    {
        if (optionIDs.length > this._options.length) return null;

        // O(n^2) in one line -> looks cool but unreadable
        let foundOptions = optionIDs.map(optionDBId => (this._options.find((_, optionIndex) => (optionDBId.id == optionIndex))));

        if (foundOptions.findIndex(value => value === undefined) !== -1) return null;

        return foundOptions as Array<SelectableOption>;
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


        const existingOptionInGroup: SelectableOption | undefined = this._optionGroups[optionGroupID.id].options.find(value => {
            return value.name === optionToBind.name;
        });

        if (existingOptionInGroup !== undefined) return false;

        let optionGroupBindTo = this._optionGroups[optionGroupID.id];

        this._optionGroups[optionGroupID.id] = new SelectableOptionGroup
        (
            optionGroupBindTo.name,
            [...optionGroupBindTo.options, optionToBind]
        );

        return true;
    }

    BindOptionToUser(optionID: InMemoryDBEntityId, userId: InMemoryDBEntityId): boolean
    {
        if (this._options.length <= optionID.id) return false;
        if (this._users.length <= userId.id) return false;

        const optionToBind = this._options[optionID.id];

        let usersAdditionalInfo = this._users[userId.id].additionalInfo;

        if (usersAdditionalInfo === null) return false;

        const existingOptionInUser: SelectableOption | undefined = usersAdditionalInfo.options.find(value => {
            return value.name === optionToBind.name;
        });

        if (existingOptionInUser !== undefined) return false;

        let newUserInfo = new UserAdditionalInfo(
            usersAdditionalInfo.aboutString,
            [...usersAdditionalInfo.options, optionToBind]
        );

        return this.EditUserAdditionalInfo(userId, newUserInfo);
    }


}