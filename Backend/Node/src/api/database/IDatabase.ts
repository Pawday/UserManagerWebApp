import {DBEntityID} from "./entities/DBEntityID";
import {User} from "./entities/User";
import {UserAdditionalInfo} from "./entities/UserAdditionalInfo";
import {SelectableOption} from "./entities/SelectableOption";
import {SelectableOptionGroup} from "./entities/SelectableOptionGroup";


interface IDatabase
{
    CheckConnection(): boolean;

    ConvertToDBEntityIDFrom<Type>(value: Type): DBEntityID | null;
    CheckIDsAreEqual(leftID: DBEntityID, rightID : DBEntityID): boolean;

    AddUser(user: User) : Promise<DBEntityID | null>;
    GetUserById(userID: DBEntityID): Promise<User | null>;

    // Returns null if at least one id not found
    GetUsersByIds(usersIDs: DBEntityID[]): Promise<User[] | null>;

    UpdateUser(userID: DBEntityID, newValue: User): Promise<boolean>;
    DeleteUserByID(userID: DBEntityID): Promise<boolean>;

    GetAllUsersIDs(): Promise<DBEntityID[]>;



    AddUserAdditionalInfo(info: UserAdditionalInfo): Promise<DBEntityID | null>;
    GetUserAdditionalInfoById(infoID: DBEntityID) : Promise<UserAdditionalInfo | null>;

    BindUserInfoToUser(userId: DBEntityID, userInfoID: DBEntityID) : Promise<boolean>;
    GetUserInfoIdByUserId(userId: DBEntityID): Promise<DBEntityID | null>;
    GetUserInfoByUserId(userId: DBEntityID): Promise<UserAdditionalInfo | null>;

    AddOption(option: SelectableOption): Promise<DBEntityID | null>;
    GetAllOptionsIDs(): Promise<DBEntityID[] | null>;
    GetOptionById(optionId: DBEntityID): Promise<SelectableOption | null>;
    IsOptionExistById(optionId: DBEntityID): Promise<boolean>;

    // Returns [] if at least one id not found
    GetOptionsByIDs(optionIDs: DBEntityID[]): Promise<SelectableOption[] | null>;


    AddOptionGroup(group: SelectableOptionGroup): Promise<DBEntityID | null>;
    GetOptionGroupByID(groupID: DBEntityID) : Promise<SelectableOptionGroup | null>;
    GetAllOptionGroupsIDs(): Promise<DBEntityID[] | null>;

    BindOptionToOptionGroup(optionID: DBEntityID, optionGroupID: DBEntityID): Promise<boolean>;
    GetOptionsIDsByGroupID(optionGroupID: DBEntityID): Promise<DBEntityID[] | null>;
    BindOptionToUser(optionID: DBEntityID, userId: DBEntityID): Promise<boolean>;
    GetUserOptionsIDsByUserId(userID: DBEntityID): Promise<DBEntityID[] | null>;
}

export default IDatabase;