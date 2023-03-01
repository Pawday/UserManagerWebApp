import {test} from '@testdeck/mocha';
import IDatabase from "../../src/api/database/IDatabase";
import {User, UserGender} from "../../src/api/database/entities/User";
import {assert} from "chai";
import {DBEntityID} from "../../src/api/database/entities/DBEntityID";
import {UserAdditionalInfo} from "../../src/api/database/entities/UserAdditionalInfo";
import {SelectableOption} from "../../src/api/database/entities/SelectableOption";
import {SelectableOptionGroup} from "../../src/api/database/entities/SelectableOptionGroup";


// see https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures
export interface DatabaseMaker {(): IDatabase; }
export interface RandomIDMaker {(): DBEntityID; }



export class GeneralDatabaseTester
{
    protected databaseMaker: DatabaseMaker;
    protected randomIdMaker: RandomIDMaker;

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

    @test("AccessToNotExistedTest")
    AccessToNotExistedTest()
    {
        const db = this.databaseMaker();

        if (!GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        let randomId = this.randomIdMaker();

        assert(null === db.GetAllOptionsIDs());
        assert(null === db.GetAllOptionGroupsIDs());

        assert(null === db.GetOptionsByIDs([randomId]));
        assert(null === db.GetUsersByIds([randomId]));

        assert(false === db.BindUserInfoToUser(randomId, randomId));
        assert(false === db.BindOptionToOptionGroup(randomId, randomId));
        assert(false === db.BindOptionToUser(randomId, randomId));


        assert(false === db.UpdateUser(randomId, new User("NewName", "NewEmail", "NewPhone", UserGender.WOMAN)));


        assert(null === db.GetOptionById(randomId));
        assert(null === db.GetUserById(randomId));
        assert(null === db.GetUserOptionsIDsByUserId(randomId));
        assert(null === db.GetUserInfoByUserId(randomId));
        assert(null === db.GetUserAdditionalInfoById(randomId));
        assert(null === db.GetUserInfoIdByUserId(randomId));
        assert(null === db.GetOptionGroupByID(randomId));
        assert(null === db.GetOptionsIDsByGroupID(randomId));
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
    AddGetAndUpdateUserAdditionalInfo()
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

        // this "Abote" string is not a mistake
        // and its helped me to find user and additional info related tests place
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
            db.IsOptionExistById(optionID);
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


    @test("AddAndGetOptionsGroupTest")
    AddAndGetOptionsGroupTest()
    {
        const db = this.databaseMaker();

        if (!GeneralDatabaseTester.AssertDatabaseConnected(db)) return;


        const group: SelectableOptionGroup = new SelectableOptionGroup("Group 1");

        let groupID = db.AddOptionGroup(group);
        assert(groupID);

        let groupFromDB = db.GetOptionGroupByID(groupID);

        assert(groupFromDB);

        assert(SelectableOptionGroup.AreEqual(group, groupFromDB));
    }

    @test("GetAllOptionGroupsIDsTest")
    GetAllOptionGroupsIDs()
    {
        const db = this.databaseMaker();

        if (!GeneralDatabaseTester.AssertDatabaseConnected(db)) return;

        const groups: Array<SelectableOptionGroup> = new Array<SelectableOptionGroup>(100);
        const groupsIDs: Array<DBEntityID> = new Array<DBEntityID>(100);

        for (let index = 0; index < groups.length; index++)
        {
            groups[index] = new SelectableOptionGroup(`TestOptionGroup_${index}`);
            let groupID = db.AddOptionGroup(groups[index]);
            assert(groupID);
            groupsIDs[index] = groupID;
        }

        let allGroupsIDsFromDB = db.GetAllOptionGroupsIDs();

        assert(allGroupsIDsFromDB);

        assert(allGroupsIDsFromDB.length === groupsIDs.length);
        assert(allGroupsIDsFromDB.length === groups.length);

        for (let index = 0; index < groupsIDs.length; index++)
        {
            let groupsIDToFind = groupsIDs[index];
            assert(-1 !== allGroupsIDsFromDB.findIndex(id => {
                return db.CheckIDsAreEqual(id,groupsIDToFind);
            }));
        }
    }

    @test("BindOptionToOptionGroupTest")
    BindOptionToOptionGroupTest()
    {
        const db = this.databaseMaker();

        if (!GeneralDatabaseTester.AssertDatabaseConnected(db)) return;


        let group: SelectableOptionGroup = new SelectableOptionGroup("TestGroup");
        let option1: SelectableOption = new SelectableOption("TestOption_1");
        let option2: SelectableOption = new SelectableOption("TestOption_2");
        let option3: SelectableOption = new SelectableOption("TestOption_3");
        let option4NoBind: SelectableOption = new SelectableOption("TestOption_4");

        let groupID = db.AddOptionGroup(group);

        assert(groupID);

        let option1ID = db.AddOption(option1);
        let option2ID = db.AddOption(option2);
        let option3ID = db.AddOption(option3);
        let option4ID = db.AddOption(option4NoBind);

        assert(option1ID && option2ID && option3ID && option4ID);

        assert(db.BindOptionToOptionGroup(option1ID, groupID));
        assert(db.BindOptionToOptionGroup(option2ID, groupID));
        assert(db.BindOptionToOptionGroup(option3ID, groupID));

        let optionsIDSFromDB = db.GetOptionsIDsByGroupID(groupID);

        assert(optionsIDSFromDB);

        assert(optionsIDSFromDB.length === 3);

        assert(-1 !== optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option1ID!);}));
        assert(-1 !== optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option2ID!);}));
        assert(-1 !== optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option3ID!);}));
        assert(-1 === optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option4ID!);}));

        let option1FromDB = db.GetOptionById(option1ID);
        let option2FromDB = db.GetOptionById(option2ID);
        let option3FromDB = db.GetOptionById(option3ID);
        let option4FromDB = db.GetOptionById(option4ID);

        assert(option1FromDB && option2FromDB && option3FromDB && option4FromDB);

        SelectableOption.AreEqual(option1, option1FromDB);
        SelectableOption.AreEqual(option2, option2FromDB);
        SelectableOption.AreEqual(option3, option3FromDB);
        SelectableOption.AreEqual(option4NoBind, option4FromDB);

    }

    @test("BindOptionToUserTest")
    BindOptionToUserTest()
    {
        const db = this.databaseMaker();

        if (!GeneralDatabaseTester.AssertDatabaseConnected(db)) return;


        let group: User = new User("TestName", "TestEmail", "TestPhone", UserGender.WOMAN);
        let option1: SelectableOption = new SelectableOption("TestOption_1");
        let option2: SelectableOption = new SelectableOption("TestOption_2");
        let option3: SelectableOption = new SelectableOption("TestOption_3");
        let option4NoBind: SelectableOption = new SelectableOption("TestOption_4");

        let userId = db.AddUser(group);

        assert(userId);

        let option1ID = db.AddOption(option1);
        let option2ID = db.AddOption(option2);
        let option3ID = db.AddOption(option3);
        let option4ID = db.AddOption(option4NoBind);

        assert(option1ID && option2ID && option3ID && option4ID);

        assert(db.BindOptionToUser(option1ID, userId));
        assert(!db.BindOptionToUser(option1ID, userId));
        assert(db.BindOptionToUser(option2ID, userId));
        assert(db.BindOptionToUser(option3ID, userId));

        let optionsIDSFromDB = db.GetUserOptionsIDsByUserId(userId);

        assert(optionsIDSFromDB);

        assert(optionsIDSFromDB.length === 3);

        assert(-1 !== optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option1ID!);}));
        assert(-1 !== optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option2ID!);}));
        assert(-1 !== optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option3ID!);}));
        assert(-1 === optionsIDSFromDB.findIndex((id) => {return db.CheckIDsAreEqual(id, option4ID!);}));


        let option1FromDB = db.GetOptionById(option1ID);
        let option2FromDB = db.GetOptionById(option2ID);
        let option3FromDB = db.GetOptionById(option3ID);
        let option4FromDB = db.GetOptionById(option4ID);

        assert(option1FromDB && option2FromDB && option3FromDB && option4FromDB);

        SelectableOption.AreEqual(option1, option1FromDB);
        SelectableOption.AreEqual(option2, option2FromDB);
        SelectableOption.AreEqual(option3, option3FromDB);
        SelectableOption.AreEqual(option4NoBind, option4FromDB);
    }
}