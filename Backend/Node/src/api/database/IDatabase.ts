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

    AddUser(user: User) : DBEntityID | null;
    GetUserById(userID: DBEntityID): User | null;

    // Returns null if at least one id not found
    GetUsersByIds(usersIDs: DBEntityID[]): User[] | null;

    UpdateUser(userID: DBEntityID, newValue: User): boolean;
    DeleteUserByID(userID: DBEntityID): boolean;

    GetAllUsersIDs(): DBEntityID[];



    AddUserAdditionalInfo(info: UserAdditionalInfo): DBEntityID | null;
    GetUserAdditionalInfoById(infoID: DBEntityID) : UserAdditionalInfo | null;

    BindUserInfoToUser(userId: DBEntityID, userInfoID: DBEntityID) : boolean;
    GetUserInfoIdByUserId(userId: DBEntityID): DBEntityID | null;
    GetUserInfoByUserId(userId: DBEntityID): UserAdditionalInfo | null;

    AddOption(option: SelectableOption): DBEntityID | null;
    GetAllOptionsIDs(): DBEntityID[] | null;
    GetOptionById(optionId: DBEntityID): SelectableOption | null;
    IsOptionExistById(optionId: DBEntityID): boolean;

    // Returns null if at least one id not found
    GetOptionsByIDs(optionIDs: DBEntityID[]): SelectableOption[] | null;


    AddOptionGroup(group: SelectableOptionGroup): DBEntityID | null;
    GetOptionGroupByID(groupID: DBEntityID) : SelectableOptionGroup | null;
    GetAllOptionGroupsIDs(): DBEntityID[] | null;

    BindOptionToOptionGroup(optionID: DBEntityID, optionGroupID: DBEntityID): boolean;
    GetOptionsIDsByGroupID(optionGroupID: DBEntityID): DBEntityID[] | null;
    BindOptionToUser(optionID: DBEntityID, userId: DBEntityID): boolean;
    GetUserOptionsIDsByUserId(userID: DBEntityID): DBEntityID[] | null;
}

export default IDatabase;