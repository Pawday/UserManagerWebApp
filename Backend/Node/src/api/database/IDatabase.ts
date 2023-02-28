import {DBEntityID} from "./entities/DBEntityID";
import {User} from "./entities/User";
import {UserAdditionalInfo} from "./entities/UserAdditionalInfo";
import {SelectableOption} from "./entities/SelectableOption";
import {SelectableOptionGroup} from "./entities/SelectableOptionGroup";


interface IDatabase
{
    CheckConnection(): boolean;

    ConvertToDBEntityIDFrom<Type>(value: Type): DBEntityID | null;

    AddUser(user: User) : DBEntityID | null;
    GetUserById(userID: DBEntityID): User | null;

    // Returns null if at least one id not found
    GetUsersByIds(usersIDs: DBEntityID[]): User[] | null;

    UpdateUser(userID: DBEntityID, newValue: User): boolean;
    GetAllUsersIDs(): DBEntityID[];



    AddUserAdditionalInfo(info: UserAdditionalInfo): DBEntityID | null;
    GetUserAdditionalInfoById(userID: DBEntityID) : DBEntityID | null;
    UpdateUserAdditionalInfo(infoID: DBEntityID, newInfo: UserAdditionalInfo) : boolean;

    BindUserInfoToUser(userId: DBEntityID, userInfoID: DBEntityID) : boolean;


    AddOption(option: SelectableOption): DBEntityID | null;
    GetAllOptionsIDs(): DBEntityID[] | null;
    GetOptionById(optionId: DBEntityID): SelectableOption | null;
    IsOptionExistById(optionId: DBEntityID): boolean;

    // Returns null if at least one id not found
    GetOptionsByIDs(optionIDs: DBEntityID[]): SelectableOption[] | null;


    AddOptionsGroup(group: SelectableOptionGroup): DBEntityID | null;
    GetAllOptionGroupsIDs(): DBEntityID[] | null;

    BindOptionToOptionGroup(optionID: DBEntityID, optionGroupID: DBEntityID): boolean;

    BindOptionToUser(optionID: DBEntityID, userId: DBEntityID): boolean;
}

export default IDatabase;