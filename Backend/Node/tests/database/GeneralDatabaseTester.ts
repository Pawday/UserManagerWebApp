import {test} from '@testdeck/mocha';
import {assert} from "chai";

import IDatabase from "../../src/api/database/IDatabase";
import {User, UserGender} from "../../src/api/database/entities/User";
import {DBEntityID} from "../../src/api/database/entities/DBEntityID";
import {UserAdditionalInfo} from "../../src/api/database/entities/UserAdditionalInfo";
import {SelectableOption} from "../../src/api/database/entities/SelectableOption";
import {SelectableOptionGroup} from "../../src/api/database/entities/SelectableOptionGroup";


// see https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures
export interface DatabaseMaker {(): Promise<IDatabase>; }
export interface NotExistedIDMaker {(): DBEntityID; }




export class GeneralDatabaseTester
{
    protected databaseMaker: DatabaseMaker;
    protected notExistedIdMaker: NotExistedIDMaker;

    private static async GenerateUsersAndSendThemToDBWithNullCheck(database: IDatabase,usersAmount: number): Promise<[User[], DBEntityID[]]>
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


        let usersIdsWithPotentialNulls = await Promise.all(users.map(async (user: User) =>
        {
            return (await database).AddUser(user);
        }));


        let userIds = usersIdsWithPotentialNulls.map((userIdOrNull, index) =>
        {
            assert(userIdOrNull !== null, `Database with user № ${index} returned null`);
            return  userIdOrNull;
        });

        return [users, userIds];
    }

    private static async AssertDatabaseConnected(database: IDatabase) : Promise<boolean>
    {
        let connectionStatus = (await database).CheckConnection();
        assert(connectionStatus, "Database is not connected (IDatabase.CheckConnection returned false)");
        return connectionStatus;
    }



    @test("AccessToNotExistedTest")
    async AccessToNotExistedTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        let randomId = this.notExistedIdMaker();

        assert(null === await db.GetAllOptionsIDs());
        assert(null === await db.GetAllOptionGroupsIDs());

        assert(null === await db.GetOptionsByIDs([randomId]));
        assert(null === await db.GetUsersByIds([randomId]));

        assert(false === await db.BindUserInfoToUser(randomId, randomId));
        assert(false === await db.BindOptionToOptionGroup(randomId, randomId));
        assert(false === await db.BindOptionToUser(randomId, randomId));


        assert(false === await db.UpdateUser(randomId, new User("NewName", "NewEmail", "NewPhone", UserGender.WOMAN)));


        assert(null === await db.GetOptionById(randomId));
        assert(null === await db.GetUserById(randomId));
        assert(null === await db.GetUserOptionsIDsByUserId(randomId));
        assert(null === await db.GetUserInfoByUserId(randomId));
        assert(null === await db.GetUserAdditionalInfoById(randomId));
        assert(null === await db.GetUserInfoIdByUserId(randomId));
        assert(null === await db.GetOptionGroupByID(randomId));
        assert(null === await db.GetOptionsIDsByGroupID(randomId));
    }


    @test("GetUsersWithMissInIDsTest")
    async GetUsersWithMissInIDsTest()
    {
        const db = await this.databaseMaker();

        if (!GeneralDatabaseTester.AssertDatabaseConnected(db)) return;


        const user1 = new User("TestUser_1", "TestEmail_1", "TestPhone_1", UserGender.WOMAN);
        const user2 = new User("TestUser_2", "TestEmail_2", "TestPhone_2", UserGender.WOMAN);
        const user3 = new User("TestUser_3", "TestEmail_3", "TestPhone_3", UserGender.WOMAN);
        const user4 = new User("TestUser_4", "TestEmail_4", "TestPhone_4", UserGender.WOMAN);

        const user1ID = await db.AddUser(user1);
        const user2ID = await db.AddUser(user2);
        const user3ID = await db.AddUser(user3);
        const user4ID = await db.AddUser(user4);

        assert(user1ID && user2ID && user3ID && user4ID);

        const allUsersFromDB = await db.GetUsersByIds([user1ID, user2ID, user3ID, user4ID])

        assert(allUsersFromDB);

        assert(allUsersFromDB.length === 4);

        let randomId = this.notExistedIdMaker();

        const nullUsersBecauseOneIDFail = await db.GetUsersByIds([user1ID, user2ID, user3ID, randomId]);

        assert(nullUsersBecauseOneIDFail === null);

    }

    @test("BindNotExistedInfoToUserTest")
    async BindNotExistedInfoToUserTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const user = new User("User", "Email", "Phone", UserGender.MAN);

        let userId = await db.AddUser(user);

        assert(userId);

        let fakeID = this.notExistedIdMaker();

        assert(false === await db.BindUserInfoToUser(userId, fakeID));
    }

    @test("GetOptionsWithMissInIDsTest")
    async GetOptionsWithMissInIDsTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const option1 = new SelectableOption("Option_1");
        const option2 = new SelectableOption("Option_2");

        const option1ID = await db.AddOption(option1);
        const option2ID = await db.AddOption(option2);

        assert(option1ID && option2ID);

        let sameOptions = await db.GetOptionsByIDs([option1ID, option2ID]);

        assert(sameOptions);
        assert(2 === sameOptions.length);

        let fakeID = this.notExistedIdMaker();

        let nullOptionBecauseMissOneID = await db.GetOptionsByIDs([option1ID, fakeID]);

        assert(null === nullOptionBecauseMissOneID);

    }

    @test("BindOptionToOptionGroupWithNotExistedGroupTest")
    async BindOptionToOptionGroupWithNotExistedGroupTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const option = new SelectableOption("TestOption");

        const optionID = await db.AddOption(option);

        assert(optionID);

        const fakeID = this.notExistedIdMaker();

        let bindStatus = await db.BindOptionToOptionGroup(optionID, fakeID);

        assert(false === bindStatus);
    }


    //BindOptionToUser (haz option bot not a user)


    @test("PutAndGetUserTest")
    async PutAndGetUserTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const user: User = new User("a", "Asd", "asd", UserGender.WOMAN);
        let userId = await db.AddUser(user);

        assert(userId !== null);

        let userFromDb = await db.GetUserById(userId);

        assert(userFromDb !== null);

        assert(User.AreEqual(userFromDb, user));

        return;
    }

    @test("PutAndDeleteUserTest")
    async PutAndDeleteUserTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const userToDelete: User = new User("a", "Asd", "asd", UserGender.WOMAN);
        let userId = await db.AddUser(userToDelete);

        assert(userId !== null);

        let userFromDb = await db.GetUserById(userId);

        assert(userFromDb !== null);

        assert(User.AreEqual(userFromDb, userToDelete));

        const deleteStatus = await db.DeleteUserByID(userId);

        assert(deleteStatus);

        let notExistedRemovedUser = await db.GetUserById(userId);

        assert(notExistedRemovedUser === null);
    }


    @test("PutAndGetUsersTest")
    async PutAndGetUsersTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        let [users, userIds] = await GeneralDatabaseTester.GenerateUsersAndSendThemToDBWithNullCheck(db, 100);

        let usersFromDB = await db.GetUsersByIds(userIds);

        assert(usersFromDB !== null, "Database didnt return provided users");

        assert(usersFromDB.length == users.length, "Provided users array is not equal to users array from database");


        usersFromDB.forEach((user, index) =>
        {
            assert(User.AreEqual(user, users[index]), `From database user with index ${index} is not 
            equal to provided user with same index`);
        });
        return;
    }

    @test("EditUserTest")
    async EditUserTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const user: User = new User(
            "Name",
            "Email",
            "Phone",
            UserGender.WOMAN
        );

        let userId = await db.AddUser(user);

        assert(userId !== null);

        let sameUserFromDB = await db.GetUserById(userId);

        assert(sameUserFromDB !== null);

        assert(User.AreEqual(sameUserFromDB,user));

        const newUser: User = new User(
            "NewName",
            "NewEmail",
            "NewPhone",
            UserGender.MAN
        );

        assert(await db.UpdateUser(userId, newUser), "Database is not able to update user");

        const newUserFromDB = await db.GetUserById(userId);

        assert(newUserFromDB !== null);

        assert(User.AreEqual(newUserFromDB, newUser));
    }



    @test("GetAllUsersIdsTest")
    async GetAllUsersIdsTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        let [users, usersIds] = await GeneralDatabaseTester.GenerateUsersAndSendThemToDBWithNullCheck(db, 43);

        let allUsersIDs = await db.GetAllUsersIDs();

        assert(allUsersIDs.length == usersIds.length, "Database didnt return all users");

        let sameUsers = await db.GetUsersByIds(allUsersIDs);

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

    @test("AddAndGetUserAdditionalInfoTest")
    async AddGetAndUpdateUserAdditionalInfoTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const info = new UserAdditionalInfo("Some about string")


        let addUserAdditionalInfoID = await db.AddUserAdditionalInfo(info);

        assert(addUserAdditionalInfoID !== null);

        let infoFromDB = await db.GetUserAdditionalInfoById(addUserAdditionalInfoID);

        assert(infoFromDB !== null);

        assert(UserAdditionalInfo.AreEqual(infoFromDB, info));
    }

    @test("BindUserinfoToUserTest")
    async BindUserinfoToUserTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        // this "Abote" string is not a mistake
        // and its helped me find user and additional info related tests place
        const info = new UserAdditionalInfo("Abote (aboba)");
        const user = new User("a", "b", "c", UserGender.WOMAN);

        let userId = await db.AddUser(user);
        let infoId = await db.AddUserAdditionalInfo(info);

        assert(infoId !== null && userId !== null);

        let bindStatus = await db.BindUserInfoToUser(userId, infoId);

        assert(bindStatus);

        let infoIdFromDb = await db.GetUserInfoIdByUserId(userId);

        assert(infoIdFromDb);

        let infoFromDB = await db.GetUserAdditionalInfoById(infoIdFromDb);

        assert(infoFromDB);

        assert(UserAdditionalInfo.AreEqual(infoFromDB, info));

        let infoFromDBByUserID = await db.GetUserInfoByUserId(userId);

        assert(infoFromDBByUserID);

        assert(UserAdditionalInfo.AreEqual(infoFromDBByUserID, infoFromDB));
        assert(UserAdditionalInfo.AreEqual(infoFromDBByUserID, info));


        // ------------------------Rebind test------------------------

        const rebindInfo = new UserAdditionalInfo("Abate (alopapala)");
        let rebindInfoID = await db.AddUserAdditionalInfo(rebindInfo);

        assert(rebindInfoID !== null);

        let rebindStatus = await db.BindUserInfoToUser(userId, rebindInfoID);

        assert(rebindStatus);

        let rebindInfoFromDBByUserID = await db.GetUserInfoByUserId(userId);

        assert(rebindInfoFromDBByUserID);

        assert(UserAdditionalInfo.AreEqual(rebindInfoFromDBByUserID, rebindInfo));
    }

    @test("AddOptionTest")
    async AddOptionTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const option = new SelectableOption("Option");

        let optionId = await db.AddOption(option);

        assert(optionId);

        let optionFromDB = await db.GetOptionById(optionId);

        assert(optionFromDB);

        SelectableOption.AreEqual(option, optionFromDB);
    }

    private static async GenerateOptionsAndSendThemToDBWithChecks(db: IDatabase, optionsAm: number)
    {
        const options: Array<SelectableOption> = new Array<SelectableOption>(optionsAm);
        const optionsIds: Array<DBEntityID> = new Array<DBEntityID>(optionsAm);

        for (let index = 0; index < options.length; index++)
        {
            options[index] = new SelectableOption(`TestOption_${index}`);
            let optionID = await db.AddOption(options[index]);
            assert(optionID);
            await db.IsOptionExistById(optionID);
            optionsIds[index] = optionID;
        }
        return {options, optionsIds};
    }


    @test("GetAllOptionsTest")
    async GetAllOptionsTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const OPTIONS_AMOUNT = 100;

        const {options, optionsIds} = await GeneralDatabaseTester.GenerateOptionsAndSendThemToDBWithChecks(db, OPTIONS_AMOUNT);

        let optionIDsFromDB = await db.GetAllOptionsIDs();

        assert(optionIDsFromDB);

        assert(optionIDsFromDB.length === options.length)
        assert(optionIDsFromDB.length === optionsIds.length)

        for (let index = 0; index < optionIDsFromDB.length; index++)
        {
            let idToCompare = optionIDsFromDB[index];
            let foundIndex = optionsIds.findIndex(async id =>
            {
                return db.CheckIDsAreEqual(id, idToCompare);
            });

            assert(-1 !== foundIndex)
        }
    }

    @test("GetOptionsByIDsTest")
    async GetOptionsByIDsTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const OPTIONS_AMOUNT = 100;
        const SUBSET_OPTIONS_AM = 34;

        const {options, optionsIds} = await GeneralDatabaseTester.GenerateOptionsAndSendThemToDBWithChecks(db, OPTIONS_AMOUNT);

        let optionsSubset: Array<SelectableOption> = new Array<SelectableOption>(SUBSET_OPTIONS_AM);
        let optionsIDsSubset: Array<DBEntityID> = new Array<DBEntityID>(SUBSET_OPTIONS_AM);

        for (let index = 0; index < SUBSET_OPTIONS_AM; index++)
        {
            optionsSubset[index] = options[index];
            optionsIDsSubset[index] = optionsIds[index];
        }

        let optionsSubsetFromDB = await db.GetOptionsByIDs(optionsIDsSubset);

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


    @test("AddAndGetOptionsGroupTest")
    async AddAndGetOptionsGroupTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;


        const group: SelectableOptionGroup = new SelectableOptionGroup("Group 1");

        let groupID = await db.AddOptionGroup(group);
        assert(groupID);

        let groupFromDB = await db.GetOptionGroupByID(groupID);

        assert(groupFromDB);

        assert(SelectableOptionGroup.AreEqual(group, groupFromDB));
    }

    @test("GetAllOptionGroupsIDsTest")
    async GetAllOptionGroupsIDsTest()
    {
        const db = await this.databaseMaker();

        if (! await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const groups: Array<SelectableOptionGroup> = new Array<SelectableOptionGroup>(100);
        const groupsIDs: Array<DBEntityID> = new Array<DBEntityID>(100);

        for (let index = 0; index < groups.length; index++)
        {
            groups[index] = new SelectableOptionGroup(`TestOptionGroup_${index}`);
            let groupID = await db.AddOptionGroup(groups[index]);
            assert(groupID);
            groupsIDs[index] = groupID;
        }

        let allGroupsIDsFromDB = await db.GetAllOptionGroupsIDs();

        assert(allGroupsIDsFromDB);

        assert(allGroupsIDsFromDB.length === groupsIDs.length);
        assert(allGroupsIDsFromDB.length === groups.length);

        for (let index = 0; index < groupsIDs.length; index++)
        {
            let groupsIDToFind = groupsIDs[index];
            assert(-1 !== allGroupsIDsFromDB.findIndex(async id => {
                return await db.CheckIDsAreEqual(id,groupsIDToFind);
            }));
        }
    }

    @test("BindOptionToOptionGroupTest")
    async BindOptionToOptionGroupTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;


        let group: SelectableOptionGroup = new SelectableOptionGroup("TestGroup");
        let option1: SelectableOption = new SelectableOption("TestOption_1");
        let option2: SelectableOption = new SelectableOption("TestOption_2");
        let option3: SelectableOption = new SelectableOption("TestOption_3");
        let option4NoBind: SelectableOption = new SelectableOption("TestOption_4");

        let groupID = await db.AddOptionGroup(group);

        assert(groupID);

        let option1ID = await db.AddOption(option1);
        let option2ID = await db.AddOption(option2);
        let option3ID = await db.AddOption(option3);
        let option4ID = await db.AddOption(option4NoBind);

        assert(option1ID && option2ID && option3ID && option4ID);

        assert(await db.BindOptionToOptionGroup(option1ID, groupID));
        assert(await db.BindOptionToOptionGroup(option2ID, groupID));
        assert(await db.BindOptionToOptionGroup(option3ID, groupID));

        let optionsIDSFromDB = await db.GetOptionsIDsByGroupID(groupID);

        assert(optionsIDSFromDB);

        assert(optionsIDSFromDB.length === 3);

        assert(-1 !== optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option1ID!);}));
        assert(-1 !== optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option2ID!);}));
        assert(-1 !== optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option3ID!);}));
        assert(-1 === optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option4ID!);}));

        let option1FromDB = await db.GetOptionById(option1ID);
        let option2FromDB = await db.GetOptionById(option2ID);
        let option3FromDB = await db.GetOptionById(option3ID);
        let option4FromDB = await db.GetOptionById(option4ID);

        assert(option1FromDB && option2FromDB && option3FromDB && option4FromDB);

        SelectableOption.AreEqual(option1, option1FromDB);
        SelectableOption.AreEqual(option2, option2FromDB);
        SelectableOption.AreEqual(option3, option3FromDB);
        SelectableOption.AreEqual(option4NoBind, option4FromDB);


        //Bind same option again
        let doubleAssignStatus = await db.BindOptionToOptionGroup(option3ID, groupID);
        assert(false === doubleAssignStatus);

    }

    @test("BindOptionToUserTest")
    async BindOptionToUserTest()
    {
        const db = await this.databaseMaker();

        if (!await GeneralDatabaseTester.AssertDatabaseConnected(db)) return;


        let group: User = new User("TestName", "TestEmail", "TestPhone", UserGender.WOMAN);
        let option1: SelectableOption = new SelectableOption("TestOption_1");
        let option2: SelectableOption = new SelectableOption("TestOption_2");
        let option3: SelectableOption = new SelectableOption("TestOption_3");
        let option4NoBind: SelectableOption = new SelectableOption("TestOption_4");

        let userId = await db.AddUser(group);

        assert(userId);

        let option1ID = await db.AddOption(option1);
        let option2ID = await db.AddOption(option2);
        let option3ID = await db.AddOption(option3);
        let option4ID = await db.AddOption(option4NoBind);

        assert(option1ID && option2ID && option3ID && option4ID);

        assert(await db.BindOptionToUser(option1ID, userId));
        assert(!await db.BindOptionToUser(option1ID, userId));
        assert(await db.BindOptionToUser(option2ID, userId));
        assert(await db.BindOptionToUser(option3ID, userId));

        let optionsIDSFromDB = await db.GetUserOptionsIDsByUserId(userId);

        assert(optionsIDSFromDB);

        assert(optionsIDSFromDB.length === 3);

        assert(-1 !== optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option1ID!);}));
        assert(-1 !== optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option2ID!);}));
        assert(-1 !== optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option3ID!);}));
        assert(-1 === optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option4ID!);}));


        let option1FromDB = await db.GetOptionById(option1ID);
        let option2FromDB = await db.GetOptionById(option2ID);
        let option3FromDB = await db.GetOptionById(option3ID);
        let option4FromDB = await db.GetOptionById(option4ID);

        assert(option1FromDB && option2FromDB && option3FromDB && option4FromDB);

        SelectableOption.AreEqual(option1, option1FromDB);
        SelectableOption.AreEqual(option2, option2FromDB);
        SelectableOption.AreEqual(option3, option3FromDB);
        SelectableOption.AreEqual(option4NoBind, option4FromDB);


        //Test not existing user

        let fakeID = this.notExistedIdMaker();

        assert(false === await db.BindOptionToUser(option3ID, fakeID));
    }
}