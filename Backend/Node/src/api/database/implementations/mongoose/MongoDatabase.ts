import IDatabase from "../../IDatabase";
import mongoose, {Types} from "mongoose";

import UserSchema from "./schems/UserShema";
import UserAdditionalInfoSchema from "./schems/UserAdditionalInfoSchema";
import OptionSchema from "./schems/OptionSchema";
import OptionGroupSchema from "./schems/OptionGroupSchema";
import {DBEntityID} from "../../entities/DBEntityID";
import {User} from "../../entities/User";
import {UserAdditionalInfo} from "../../entities/UserAdditionalInfo";
import {SelectableOption} from "../../entities/SelectableOption";
import {SelectableOptionGroup} from "../../entities/SelectableOptionGroup";


export class MongoDBEntityID implements DBEntityID
{
    public readonly id: mongoose.Types.ObjectId;

    constructor(id: mongoose.Types.ObjectId)
    {
        this.id = id;
    }
}


async function ResolveOrNull<Type>(promise: Promise<Type>): Promise<Type | null>
{
    try
    {
        return await promise;
    }
    catch (e: any)
    {
        //TODO: Best place for handling database issues;
        return null;
    }
}

export class MongoDatabase implements IDatabase
{
    private _connection: mongoose.Connection;

    private UserModel;
    private UserAdditionalInfoModel;
    private OptionModel;
    private OptionGroupModel;

    constructor(connectionString: string)
    {
        this._connection = mongoose.createConnection(connectionString);
        this.UserModel = this._connection.model("User", UserSchema);
        this.UserAdditionalInfoModel = this._connection.model("UserInfo", UserAdditionalInfoSchema);
        this.OptionModel = this._connection.model("Option", OptionSchema);
        this.OptionGroupModel = this._connection.model("OptionGroup", OptionGroupSchema)
    }


    get connection(): mongoose.Connection
    {
        return this._connection;
    }

    ConvertToDBEntityIDFrom<Type>(value: Type): MongoDBEntityID | null
    {
        if ((typeof value !== "string"))
            return null;

        let mongoId: Types.ObjectId | null;


        if (!Types.ObjectId.isValid(value as string))
            return null;

        try
        {
            mongoId = new Types.ObjectId(value as string);
        }
        catch (e: any)
        {
            return null;
        }

        return new MongoDBEntityID(mongoId);
    }

    CheckConnection(): boolean
    {
        // expression "ConnectionStates.connected" produce "TypeError: Cannot read properties of undefined (reading 'connected')"
        // return this._connection.readyState === ConnectionStates.connected;

        return this._connection.readyState === 1;
    }

    CheckIDsAreEqual(leftID: MongoDBEntityID, rightID: MongoDBEntityID): boolean
    {
        return (leftID.id.toString() == rightID.id.toString());
    }

    async AddUser(user: User): Promise<MongoDBEntityID | null>
    {
        const newUser = new this.UserModel();

        newUser.name = user.name;
        newUser.email = user.email;
        newUser.phone = user.phone;
        newUser.gender = user.gender;

        let savedUser = await ResolveOrNull(newUser.save());

        if (savedUser === null)
            return null;

        return new MongoDBEntityID(savedUser.id);
    }

    async GetUserById(userID: MongoDBEntityID): Promise<User | null>
    {
        let user = await ResolveOrNull(this.UserModel.findById(userID.id).exec());

        if (user == null)
            return null;

        return new User(user.name, user.email, user.phone, user.gender)
    }

    async GetUsersByIds(usersIDs: MongoDBEntityID[]): Promise<User[] | null>
    {
        //https://stackoverflow.com/questions/15102532/mongo-find-through-list-of-ids

        let objectIds = usersIDs.map(value =>
        {
            return value.id;
        });

        let count = await this.UserModel.count({_id: {$in: objectIds}});

        if (count !== usersIDs.length)
            return null;

        let usersFromDB = await ResolveOrNull(this.UserModel.find({_id: {$in: objectIds}}).exec());

        if (usersFromDB === null)
            return null;

        let users = usersFromDB.map((model =>
        {
            return new User(model.name, model.email, model.phone, model.gender);
        }));

        return users;
    }

    async UpdateUser(userID: MongoDBEntityID, newValue: User): Promise<boolean>
    {
        let user = await ResolveOrNull(this.UserModel.findById(userID.id).exec());

        if (user === null)
            return false;

        user.name = newValue.name;
        user.email = newValue.email;
        user.phone = newValue.phone;
        user.gender = newValue.gender;

        let status = await ResolveOrNull(user.save());

        if (status === null)
            return false;

        return true;
    }

    async DeleteUserByID(userID: MongoDBEntityID): Promise<boolean>
    {
        const userToDelete = await ResolveOrNull(this.UserModel.findById(userID.id).exec());

        if (userToDelete === null)
            return false;

        userToDelete.delete();

        return true;
    }

    async GetAllUsersIDs(): Promise<DBEntityID[]>
    {
        //https://stackoverflow.com/questions/25589113/how-to-select-a-single-field-for-all-documents-in-a-mongodb-collection

        let userIds = await ResolveOrNull(this.UserModel.find({},{_id: true}).exec());

        if (userIds === null)
            return [];

        let userAsEntityIds = userIds.map((userId) =>
        {
            return new MongoDBEntityID(userId.id);
        });

        return userAsEntityIds;
    }

    async AddOption(option: SelectableOption): Promise<DBEntityID | null>
    {
        let newOption = new this.OptionModel();

        newOption.name = option.name;

        const savedModel = await ResolveOrNull(newOption.save());

        if (savedModel === null)
            return null;

        return new MongoDBEntityID(savedModel.id);
    }

    async AddOptionGroup(group: SelectableOptionGroup): Promise<DBEntityID | null>
    {
        let optionGroup = new this.OptionGroupModel();

        optionGroup.optionGroupName = group.name;

        const savedModel = await ResolveOrNull(optionGroup.save());

        if (savedModel === null)
            return null;

        return new MongoDBEntityID(savedModel.id);
    }

    async AddUserAdditionalInfo(info: UserAdditionalInfo): Promise<DBEntityID | null>
    {
        let dbInfo = new this.UserAdditionalInfoModel();

        dbInfo.aboutString = info.aboutString;

        const savedModel = await ResolveOrNull(dbInfo.save());

        if (savedModel === null)
            return null;

        return new MongoDBEntityID(savedModel.id);
    }

    async BindOptionToOptionGroup(optionID: MongoDBEntityID, optionGroupID: MongoDBEntityID): Promise<boolean>
    {
        let optionToBind = await ResolveOrNull(this.OptionModel.findById(optionID.id).exec());

        if (optionToBind === null)
            return false;


        const optionGroupAmWithAlreadyProvidedOption = await ResolveOrNull(this.OptionGroupModel.count({
            id: {
                $eq: optionGroupID.id
            },
            options : optionID.id
        }).exec());

        if (optionGroupAmWithAlreadyProvidedOption === null)
            return false;

        if (optionGroupAmWithAlreadyProvidedOption !== 0)
            return false;

        let optionGroupBindTo = await ResolveOrNull(this.OptionGroupModel.findOne({id: {$eq: optionGroupID.id}}).exec());

        if (optionGroupBindTo === null)
            return false;

        optionGroupBindTo.options.push(optionID.id);

        const updatedDocument = await ResolveOrNull(optionGroupBindTo.save())

        if (updatedDocument === null)
            return false;

        return true;
    }

    async BindOptionToUser(optionID: MongoDBEntityID, userId: MongoDBEntityID): Promise<boolean>
    {
        let optionToBind = await ResolveOrNull(this.OptionModel.findById(optionID.id).exec());

        if (optionToBind === null)
            return false;

        const userAmWithAlreadyProvidedOption = await ResolveOrNull(this.UserModel.count({
            id: {
                $eq: userId.id
            },
            options : optionID.id
        }).exec());

        if (userAmWithAlreadyProvidedOption === null)
            return false;

        if (userAmWithAlreadyProvidedOption !== 0)
            return false;

        let userBindTo = await ResolveOrNull(this.UserModel.findOne({id: {$eq: userId.id}}).exec());

        if (userBindTo === null)
            return false;

        userBindTo.options.push(optionID.id);

        const updatedUser = await ResolveOrNull(userBindTo.save())

        if (updatedUser === null)
            return false;

        return true;
    }

    async BindUserInfoToUser(userId: MongoDBEntityID, userInfoID: MongoDBEntityID): Promise<boolean>
    {
        let userBindTo = await ResolveOrNull(this.UserModel.findById(userInfoID.id).exec());

        if (userBindTo === null)
            return false;

        let infoToBind = await ResolveOrNull(this.UserAdditionalInfoModel.findById(userInfoID.id).exec());

        if (infoToBind === null)
            return false;

        userBindTo.additionalInfo = userInfoID.id;

        const savedUser = await ResolveOrNull(userBindTo.save());

        if (savedUser === null)
            return false;

        return true;
    }

    async GetAllOptionGroupsIDs(): Promise<DBEntityID[] | null>
    {
        return null
    }

    async GetAllOptionsIDs(): Promise<DBEntityID[] | null>
    {
        return null;
    }

    async GetOptionById(optionId: DBEntityID): Promise<SelectableOption | null>
    {
        return null;
    }

    async GetOptionGroupByID(groupID: DBEntityID): Promise<SelectableOptionGroup | null>
    {
        return null;
    }

    async GetOptionsByIDs(optionIDs: DBEntityID[]): Promise<SelectableOption[] | null>
    {
        return null;
    }

    async GetOptionsIDsByGroupID(optionGroupID: DBEntityID): Promise<DBEntityID[] | null>
    {
        return null;
    }

    async GetUserAdditionalInfoById(infoID: DBEntityID): Promise<UserAdditionalInfo | null>
    {
        return null;
    }

    async GetUserInfoByUserId(userId: DBEntityID): Promise<UserAdditionalInfo | null>
    {
        return null
    }

    async GetUserInfoIdByUserId(userId: DBEntityID): Promise<DBEntityID | null>
    {
        return null;
    }

    async GetUserOptionsIDsByUserId(userID: DBEntityID): Promise<DBEntityID[] | null>
    {
        return null;
    }

    async IsOptionExistById(optionId: DBEntityID): Promise<boolean>
    {
        return false;
    }

}


