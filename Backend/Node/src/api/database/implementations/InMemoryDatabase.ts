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
    private readonly _deletedUsers: Array<InMemoryDBEntityId>;
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

        this._deletedUsers = new Array<InMemoryDBEntityId>();

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

    private async CheckUserDeleted(userId: InMemoryDBEntityId): Promise<boolean>
    {
        if (this._users.length <= userId.id)
            return false;

        let deletedUser = this._deletedUsers.find((deletedId) =>
        {
            return deletedId.id === userId.id;
        });

        if (deletedUser === undefined)
            return false;

        return true;
    }

    CheckIDsAreEqual(leftID: InMemoryDBEntityId, rightID: InMemoryDBEntityId): boolean
    {
        return (leftID.id === rightID.id);
    }

    async AddUser(user: User): Promise<DBEntityID | null>
    {
        const index = this._users.push(Object.assign({}, user));
        return new InMemoryDBEntityId(index - 1);
    }

    async GetUserById(userID: InMemoryDBEntityId): Promise<User | null>
    {
        if (this._users.length <= userID.id)
            return null;

        if(await this.CheckUserDeleted(userID))
            return null;

        return Object.assign({}, this._users[userID.id]);
    }

    async GetUsersByIds(usersIDs: InMemoryDBEntityId[]): Promise<User[] | null>
    {
        if (usersIDs.length > this._users.length)
            return null;

        // Hello O(n^2)
        let foundUsers = this._users.filter((_, userIndex) =>
        {
            return usersIDs.find((userID) => {return userID.id === userIndex});
        }).filter(async (user,userIndex) =>
        {
            if(await this.CheckUserDeleted(new InMemoryDBEntityId(userIndex)))
                return false;

            return user;
        });

        if (foundUsers.length != usersIDs.length)
            return null;

        return foundUsers;
    }

    async UpdateUser(userID: InMemoryDBEntityId, newValue: User): Promise<boolean>
    {
        if (this._users.length <= userID.id)
            return false;

        if(await this.CheckUserDeleted(userID))
            return false;

        this._users[userID.id] = new User(
            newValue.name,
            newValue.email,
            newValue.phone,
            newValue.gender
        );

        return true;
    }

    async DeleteUserByID(userID: InMemoryDBEntityId): Promise<boolean>
    {
        if (this._users.length <= userID.id)
            return false;

        if(await this.CheckUserDeleted(userID))
            return false;

        const alreadyRemovedUser = this._deletedUsers.find((id) =>
        {
            return id.id === userID.id;
        });

        if (alreadyRemovedUser !== undefined)
            return false;

        this._deletedUsers.push(userID);


        return true;
    }



    async GetAllUsersIDs(): Promise<DBEntityID[]>
    {
        return this._users
            .map((_, index) => new InMemoryDBEntityId(index))
            .filter(async (userId,index) =>
        {
            return !await this.CheckUserDeleted(userId);
        });
    }

    async AddUserAdditionalInfo(info: UserAdditionalInfo): Promise<DBEntityID | null>
    {
        const index = this._usersAdditionalInfos.push(Object.assign({}, info));
        return new InMemoryDBEntityId(index - 1);
    }

    async GetUserAdditionalInfoById(infoId: InMemoryDBEntityId): Promise<UserAdditionalInfo | null>
    {
        if (this._usersAdditionalInfos.length <= infoId.id)
            return null;
        return Object.assign({}, this._usersAdditionalInfos[infoId.id]);
    }


    async BindUserInfoToUser(userId: InMemoryDBEntityId, userInfoID: InMemoryDBEntityId): Promise<boolean>
    {
        if (this._users.length <= userId.id)
            return false;
        if (this._usersAdditionalInfos.length <= userInfoID.id)
            return false;

        if(await this.CheckUserDeleted(userId))
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

    async GetUserInfoIdByUserId(userId: InMemoryDBEntityId): Promise<InMemoryDBEntityId | null>
    {
        if(await this.CheckUserDeleted(userId))
            return null;

        let map = this._userToInfoMap.find(value => {
            return value[0].id == userId.id;
        });

        if (!map)
            return null;

        return new InMemoryDBEntityId(map[1].id);
    }

    async GetUserInfoByUserId(userId: InMemoryDBEntityId): Promise<UserAdditionalInfo | null>
    {
        if(await this.CheckUserDeleted(userId))
            return null;

        let map = this._userToInfoMap.find(value => {
            return value[0].id == userId.id;
        });

        if (!map)
            return null;

        return Object.assign({}, this._usersAdditionalInfos[map[1].id]);
    }


    async AddOption(option: SelectableOption): Promise<InMemoryDBEntityId | null>
    {
        const index = this._options.push(Object.assign({}, option));
        return new InMemoryDBEntityId(index - 1);
    }

    async GetAllOptionsIDs(): Promise<InMemoryDBEntityId[] | null>
    {
        if (this._options.length == 0)
            return null;
        return this._options.map((_, index) => new InMemoryDBEntityId(index));
    }

    async GetOptionById(optionId: InMemoryDBEntityId): Promise<SelectableOption | null>
    {
        if (this._options.length <= optionId.id)
            return null;
        return Object.assign({}, this._options[optionId.id]);
    }

    async IsOptionExistById(optionId: InMemoryDBEntityId): Promise<boolean>
    {
        return this._options.length <= optionId.id;
    }


    async GetOptionsByIDs(optionIDs: InMemoryDBEntityId[]): Promise<SelectableOption[] | null>
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


    async AddOptionGroup(group: SelectableOptionGroup): Promise<DBEntityID | null>
    {
        const index = this._optionGroups.push(Object.assign({}, group));
        return new InMemoryDBEntityId(index - 1);
    }

    async GetOptionGroupByID(groupID: InMemoryDBEntityId): Promise<SelectableOptionGroup | null>
    {
        if (this._optionGroups.length <= groupID.id)
            return null;

        return Object.assign({}, this._optionGroups[groupID.id]);
    }


    async GetAllOptionGroupsIDs(): Promise<DBEntityID[] | null>
    {
        if (this._optionGroups.length == 0)
            return null;
        return this._optionGroups.map((_, index) => {return new InMemoryDBEntityId(index)});
    }

    async BindOptionToOptionGroup(optionID: InMemoryDBEntityId, optionGroupID: InMemoryDBEntityId): Promise<boolean>
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

    async GetOptionsIDsByGroupID(optionGroupID: InMemoryDBEntityId): Promise<DBEntityID[] | null>
    {
        if (this._optionGroups.length <= optionGroupID.id)
            return null;


        return this._optionToOptionGroupMap.filter((pair =>
        {
            return pair[1].id === optionGroupID.id;
        })).map(pair =>
        {
            return pair[0];
        });
    }



    async BindOptionToUser(optionID: InMemoryDBEntityId, userId: InMemoryDBEntityId): Promise<boolean>
    {
        if (this._options.length <= optionID.id)
            return false;
        if (this._users.length <= userId.id)
            return false;

        if(await this.CheckUserDeleted(userId))
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

    async GetUserOptionsIDsByUserId(userID: InMemoryDBEntityId): Promise<DBEntityID[] | null>
    {
        if (this._users.length <= userID.id)
            return null;

        if(await this.CheckUserDeleted(userID))
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