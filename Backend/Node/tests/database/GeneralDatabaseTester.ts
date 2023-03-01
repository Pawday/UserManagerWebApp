import {test} from '@testdeck/mocha';
import IDatabase from "../../src/api/database/IDatabase";
import {User, UserGender} from "../../src/api/database/entities/User";
import {assert} from "chai";
import {DBEntityID} from "../../src/api/database/entities/DBEntityID";
import {UserAdditionalInfo} from "../../src/api/database/entities/UserAdditionalInfo";
import {SelectableOption} from "../../src/api/database/entities/SelectableOption";


// see https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures
export interface DatabaseMaker {(): IDatabase; }



export class GeneralDatabaseTester
{
    protected databaseMaker: DatabaseMaker;

    private static GenerateUsersAndSendThemToDBWithNullCheck(database: IDatabase,usersAmount: number): [User[], DBEntityID[]]
    {
        const users: User[] = new Array<User>(usersAmount);

        for (let index = 0; index < users.length; index++)
        {
            users[index] = new User
            (
                `UserName_${index}`,
                `UserEmail_${index}`,
                `UserPhone_${index}`,
                (index & 1) ? UserGender.WOMAN : UserGender.MAN
            );
        }

        let usersIdsWithPotentialNulls = users.map((user: User) =>
        {
            return database.AddUser(user);
        });

        let userIds = usersIdsWithPotentialNulls.map((userIdOrNull, index) =>
        {
            assert(userIdOrNull !== null, `Database with user № ${index} returned null`);
            return userIdOrNull;
        });

        return [users, userIds];
    }

    private static AssertDatabaseConnected(database: IDatabase) : boolean
    {
        let connectionStatus = database.CheckConnection();
        assert(connectionStatus, "Database is not connected (IDatabase.CheckConnection returned false)");
        return connectionStatus;
    }

    @test("PutAndGetUser")
    PutAndGetUser()
    {
        const db = this.databaseMaker();

        if (!GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const user: User = new User("a", "Asd", "asd", UserGender.WOMAN);
        let userId = db.AddUser(user);

        assert(userId !== null);

        let userFromDb = db.GetUserById(userId);

        assert(userFromDb !== null);

        assert(User.AreEqual(userFromDb, user));
    }

    @test("PutAndGetUsers")
    PutAndGetUsers()
    {
        const db = this.databaseMaker();

        if (!GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        let [users, userIds] = GeneralDatabaseTester.GenerateUsersAndSendThemToDBWithNullCheck(db, 100);

        let usersFromDB = db.GetUsersByIds(userIds);

        assert(usersFromDB !== null, "Database didnt return provided users");

        assert(usersFromDB.length == users.length, "Provided users array is not equal to users array from database");


        usersFromDB.forEach((user, index) =>
        {
            assert(User.AreEqual(user, users[index]), `From database user with index ${index} is not 
            equal to provided user with same index`);
        });
    }

    @test("EditUserTest")
    EditUserTest()
    {
        const db = this.databaseMaker();

        if (!GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const user: User = new User(
            "Name",
            "Email",
            "Phone",
            UserGender.WOMAN
        );

        let userId = db.AddUser(user);

        assert(userId !== null);

        let sameUserFromDB = db.GetUserById(userId);

        assert(sameUserFromDB !== null);

        assert(User.AreEqual(sameUserFromDB,user));

        const newUser: User = new User(
            "NewName",
            "NewEmail",
            "NewPhone",
            UserGender.MAN
        );

        assert(db.UpdateUser(userId, newUser), "Database is not able to update user");

        const newUserFromDB = db.GetUserById(userId);

        assert(newUserFromDB !== null);

        assert(User.AreEqual(newUserFromDB, newUser));
    }



    @test("GetAllUsersIdsTest")
    GetAllUsersIdsTest()
    {
        const db = this.databaseMaker();

        if (!GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        let [users, usersIds] = GeneralDatabaseTester.GenerateUsersAndSendThemToDBWithNullCheck(db, 43);

        let allUsersIDs = db.GetAllUsersIDs();

        assert(allUsersIDs.length == usersIds.length, "Database didnt return all users");

        let sameUsers = db.GetUsersByIds(allUsersIDs);

        assert(sameUsers !== null);

        assert(sameUsers.length === users.length);

        for (let index = 0; index < users.length; index++)
        {
            let foundUser = users.find(value => {
                if (sameUsers) //TS18047
                {
                    return User.AreEqual(sameUsers[index], value)
                }});
            assert(foundUser !== undefined);
        }
    }

    @test("AddAndGetUserAdditionalInfo")
    AddAndGetUserAdditionalInfo()
    {
        const db = this.databaseMaker();

        if (!GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const info = new UserAdditionalInfo("Some about string")

        let addUserAdditionalInfoID = db.AddUserAdditionalInfo(info);

        assert(addUserAdditionalInfoID !== null);

        let infoFromDB = db.GetUserAdditionalInfoById(addUserAdditionalInfoID);

        assert(infoFromDB !== null);

        assert(UserAdditionalInfo.AreEqual(infoFromDB, info));
    }

    @test("BindUserinfoToUserTest")
    BindUserinfoToUserTest()
    {
        const db = this.databaseMaker();

        if (!GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const info = new UserAdditionalInfo("Abote (aboba)");
        const user = new User("a", "b", "c", UserGender.WOMAN);

        let userId = db.AddUser(user);
        let infoId = db.AddUserAdditionalInfo(info);

        assert(infoId !== null && userId !== null);

        let bindStatus = db.BindUserInfoToUser(userId, infoId);

        assert(bindStatus);

        let infoIdFromDb = db.GetUserInfoIdByUserId(userId);

        assert(infoIdFromDb);

        let infoFromDB = db.GetUserAdditionalInfoById(infoIdFromDb);

        assert(infoFromDB);

        assert(UserAdditionalInfo.AreEqual(infoFromDB, info));

        let infoFromDBByUserID = db.GetUserInfoByUserId(userId);

        assert(infoFromDBByUserID);

        assert(UserAdditionalInfo.AreEqual(infoFromDBByUserID, infoFromDB));
        assert(UserAdditionalInfo.AreEqual(infoFromDBByUserID, info));


        // ------------------------Rebind test------------------------

        const rebindInfo = new UserAdditionalInfo("Abate (alopapala)");
        let rebindInfoID = db.AddUserAdditionalInfo(rebindInfo);

        assert(rebindInfoID !== null);

        let rebindStatus = db.BindUserInfoToUser(userId, rebindInfoID);

        assert(rebindStatus);

        let rebindInfoFromDBByUserID = db.GetUserInfoByUserId(userId);

        assert(rebindInfoFromDBByUserID);

        assert(UserAdditionalInfo.AreEqual(rebindInfoFromDBByUserID, rebindInfo));
    }

    @test("AddOptionTest")
    AddOptionTest()
    {
        const db = this.databaseMaker();

        if (!GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const option = new SelectableOption("Option");

        let optionId = db.AddOption(option);

        assert(optionId);

        let optionFromDB = db.GetOptionById(optionId);

        assert(optionFromDB);

        SelectableOption.AreEqual(option, optionFromDB);
    }

    private static GenerateOptionsAndSendThemToDBWithChecks(db: IDatabase, optionsAm: number)
    {
        const options: Array<SelectableOption> = new Array<SelectableOption>(optionsAm);
        const optionsIds: Array<DBEntityID> = new Array<DBEntityID>(optionsAm);

        for (let index = 0; index < options.length; index++)
        {
            options[index] = new SelectableOption(`TestOption_${index}`);
            let optionID = db.AddOption(options[index]);
            assert(optionID);
            optionsIds[index] = optionID;
        }
        return {options, optionsIds};
    }


    @test("GetAllOptionsTest")
    GetAllOptionsTest()
    {
        const db = this.databaseMaker();

        if (!GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const OPTIONS_AMOUNT = 100;

        const {options, optionsIds} = GeneralDatabaseTester.GenerateOptionsAndSendThemToDBWithChecks(db, OPTIONS_AMOUNT);

        let optionIDsFromDB = db.GetAllOptionsIDs();

        assert(optionIDsFromDB);

        assert(optionIDsFromDB.length === options.length)
        assert(optionIDsFromDB.length === optionsIds.length)

        for (let index = 0; index < optionIDsFromDB.length; index++)
        {
            let idToCompare = optionIDsFromDB[index];
            let foundIndex = optionsIds.findIndex(id =>
            {
                return db.CheckIDsAreEqual(id, idToCompare);
            });

            assert(-1 !== foundIndex)
        }
    }

    @test("GetOptionsByIDsTest")
    GetOptionsByIDsTest()
    {
        const db = this.databaseMaker();

        if (!GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const OPTIONS_AMOUNT = 100;
        const SUBSET_OPTIONS_AM = 34;

        const {options, optionsIds} = GeneralDatabaseTester.GenerateOptionsAndSendThemToDBWithChecks(db, OPTIONS_AMOUNT);

        let optionsSubset: Array<SelectableOption> = new Array<SelectableOption>(SUBSET_OPTIONS_AM);
        let optionsIDsSubset: Array<DBEntityID> = new Array<DBEntityID>(SUBSET_OPTIONS_AM);

        for (let index = 0; index < SUBSET_OPTIONS_AM; index++)
        {
            optionsSubset[index] = options[index];
            optionsIDsSubset[index] = optionsIds[index];
        }

        let optionsSubsetFromDB = db.GetOptionsByIDs(optionsIDsSubset);

        assert(optionsSubsetFromDB);
        assert(optionsSubsetFromDB.length === optionsSubset.length);

        for (let index = 0; index < optionsSubset.length; index++)
        {
            const optionToFind = optionsSubset[index];
            assert(-1 !== optionsSubsetFromDB.findIndex(value =>
            {
                return SelectableOption.AreEqual(value, optionToFind);
            }), `${index} ${optionToFind.name}`);
        }
    }
}