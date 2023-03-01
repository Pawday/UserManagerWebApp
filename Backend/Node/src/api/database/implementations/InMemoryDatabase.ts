import {DBEntityID} from "../entities/DBEntityID";
import {User} from "../entities/User";
import {UserAdditionalInfo} from "../entities/UserAdditionalInfo";
import {SelectableOption} from "../entities/SelectableOption";
import {SelectableOptionGroup} from "../entities/SelectableOptionGroup";
import IDatabase from "../IDatabase";

export class InMemoryDBEntityId implements DBEntityID
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

    private readonly _userToInfoMap: [InMemoryDBEntityId, InMemoryDBEntityId][];
    private readonly _optionToOptionGroupMap: [InMemoryDBEntityId, InMemoryDBEntityId][];
    private readonly _optionToUserMap: [InMemoryDBEntityId, InMemoryDBEntityId][];

    private _isConnected: boolean;

    constructor()
    {
        this._isConnected = true;

        this._users = new Array<User>();
        this._usersAdditionalInfos = new Array<UserAdditionalInfo>();
        this._options = new Array<SelectableOption>();
        this._optionGroups = new Array<SelectableOptionGroup>();

        this._userToInfoMap = new Array<[InMemoryDBEntityId, InMemoryDBEntityId]>();
        this._optionToOptionGroupMap = new Array<[InMemoryDBEntityId, InMemoryDBEntityId]>();
        this._optionToUserMap = new Array<[InMemoryDBEntityId, InMemoryDBEntityId]>();
    }

    CheckConnection(): boolean
    {
        return this._isConnected;
    }

    ConvertToDBEntityIDFrom<Type>(value: Type): DBEntityID | null
    {
        if (typeof(value) !== "string")
            return null;

        let number = parseInt(value);

        if (isNaN(number))
            return null;

        return new InMemoryDBEntityId(number);
    }

    CheckIDsAreEqual(leftID: InMemoryDBEntityId, rightID: InMemoryDBEntityId): boolean
    {
        return (leftID.id === rightID.id);
    }

    AddUser(user: User): DBEntityID | null
    {
        const index = this._users.push(Object.assign({}, user));
        return new InMemoryDBEntityId(index - 1);
    }

    GetUserById(id: InMemoryDBEntityId): User | null
    {
        if (this._users.length <= id.id)
            return null;
        return Object.assign({}, this._users[id.id]);
    }

    GetUsersByIds(usersIDs: InMemoryDBEntityId[]): User[] | null
    {
        if (usersIDs.length > this._users.length)
            return null;

        // Hello O(n^2)
        let foundUsers = this._users.filter((_, userIndex) =>
        {
            return usersIDs.find((userID) => {return userID.id === userIndex});
        });

        if (foundUsers.length != usersIDs.length)
            return null;

        return foundUsers;
    }

    UpdateUser(userID: InMemoryDBEntityId, newValue: User): boolean
    {
        if (this._users.length <= userID.id)
            return false;

        this._users[userID.id] = new User(
            newValue.name,
            newValue.email,
            newValue.phone,
            newValue.gender
        );

        return true;
    }


    GetAllUsersIDs(): DBEntityID[]
    {
        return this._users.map((_, index) => new InMemoryDBEntityId(index));
    }

    AddUserAdditionalInfo(info: UserAdditionalInfo): DBEntityID | null
    {
        const index = this._usersAdditionalInfos.push(Object.assign({}, info));
        return new InMemoryDBEntityId(index - 1);
    }

    GetUserAdditionalInfoById(infoId: InMemoryDBEntityId): UserAdditionalInfo | null
    {
        if (this._usersAdditionalInfos.length <= infoId.id)
            return null;
        return Object.assign({}, this._usersAdditionalInfos[infoId.id]);
    }


    BindUserInfoToUser(userId: InMemoryDBEntityId, userInfoID: InMemoryDBEntityId): boolean
    {
        if (this._users.length <= userId.id)
            return false;
        if (this._usersAdditionalInfos.length <= userInfoID.id)
            return false;

        let userToItsInfoPairIndex = this._userToInfoMap.findIndex(usIdInfIdPair => usIdInfIdPair[0] === userId);

        if (-1 === userToItsInfoPairIndex)
        {
            this._userToInfoMap.push([userId, userInfoID]);
            return true;
        }

        // reassign to new info
        this._userToInfoMap[userToItsInfoPairIndex][1] = userInfoID;

        return true;
    }

    GetUserInfoIdByUserId(userId: InMemoryDBEntityId): InMemoryDBEntityId | null
    {
        let map = this._userToInfoMap.find(value => {
            return value[0].id == userId.id;
        });

        if (!map)
            return null;

        return new InMemoryDBEntityId(map[1].id);
    }

    GetUserInfoByUserId(userId: InMemoryDBEntityId): UserAdditionalInfo | null
    {
        let map = this._userToInfoMap.find(value => {
            return value[0].id == userId.id;
        });

        if (!map)
            return null;

        return Object.assign({}, this._usersAdditionalInfos[map[1].id]);
    }


    AddOption(option: SelectableOption): InMemoryDBEntityId | null
    {
        const index = this._options.push(Object.assign({}, option));
        return new InMemoryDBEntityId(index - 1);
    }

    GetAllOptionsIDs(): InMemoryDBEntityId[] | null
    {
        if (this._options.length == 0)
            return null;
        return this._options.map((_, index) => new InMemoryDBEntityId(index));
    }

    GetOptionById(optionId: InMemoryDBEntityId): SelectableOption | null
    {
        if (this._options.length <= optionId.id)
            return null;
        return Object.assign({}, this._options[optionId.id]);
    }

    IsOptionExistById(optionId: InMemoryDBEntityId): boolean
    {
        return this._options.length <= optionId.id;
    }


    GetOptionsByIDs(optionIDs: InMemoryDBEntityId[]): SelectableOption[] | null
    {
        if (optionIDs.length > this._options.length)
            return null;


        let foundOptions = optionIDs.map((optionID) =>
        {
            if (this._options.length <= optionID.id) return null;
            return this._options[optionID.id];
        }).filter((optionOrNull) =>
        {
            return (optionOrNull !== null);
        });

        if (foundOptions.length !== optionIDs.length)
            return null;

        return foundOptions as Array<SelectableOption>;
    }


    AddOptionGroup(group: SelectableOptionGroup): DBEntityID | null
    {
        const index = this._optionGroups.push(Object.assign({}, group));
        return new InMemoryDBEntityId(index - 1);
    }

    GetOptionGroupByID(groupID: InMemoryDBEntityId): SelectableOptionGroup | null
    {
        if (this._optionGroups.length <= groupID.id)
            return null;

        return Object.assign({}, this._optionGroups[groupID.id]);
    }


    GetAllOptionGroupsIDs(): DBEntityID[] | null
    {
        if (this._optionGroups.length == 0)
            return null;
        return this._optionGroups.map((_, index) => {return new InMemoryDBEntityId(index)});
    }

    BindOptionToOptionGroup(optionID: InMemoryDBEntityId, optionGroupID: InMemoryDBEntityId): boolean
    {
        if (this._options.length <= optionID.id)
            return false;
        if (this._optionGroups.length <= optionGroupID.id)
            return false;

        const opToOpGroupMapPairId = this._optionToOptionGroupMap.findIndex(pair =>
        {
            return (pair[0] === optionID && pair[1] === optionGroupID);
        });

        // if provided option mapped to provided option group
        if (-1 !== opToOpGroupMapPairId)
            return false;

        this._optionToOptionGroupMap.push([optionID, optionGroupID]);
        return true;
    }

    GetOptionsIDsByGroupID(optionGroupID: InMemoryDBEntityId): DBEntityID[] | null
    {
        if (this._optionGroups.length <= optionGroupID.id)
            return null;

        //It wold be a disaster when test with it will fail, but "USE STREAMS DUA"
        return this._optionToOptionGroupMap.filter((pair =>
        {
            return pair[1].id === optionGroupID.id;
        })).map(pair =>
        {
            return pair[0];
        });
    }



    BindOptionToUser(optionID: InMemoryDBEntityId, userId: InMemoryDBEntityId): boolean
    {
        if (this._options.length <= optionID.id)
            return false;
        if (this._users.length <= userId.id)
            return false;


        let opToUsrPairIndex = this._optionToUserMap.findIndex(opToUsrPair =>
        {
            return (opToUsrPair[0] === optionID) && (opToUsrPair[1] === userId);
        });

        // Check option already assigned
        if (-1 !== opToUsrPairIndex)
            return false;

        this._optionToUserMap.push([optionID, userId]);

        return true;
    }

    GetUserOptionsIDsByUserId(userID: InMemoryDBEntityId): DBEntityID[] | null
    {
        if (this._users.length <= userID.id)
            return null;

        let userOptionsPairs = this._optionToUserMap.filter((pair =>
        {
            return pair[1].id === userID.id;
        }));

        return userOptionsPairs.map(pair =>
        {
            return pair[0];
        });
    }
}