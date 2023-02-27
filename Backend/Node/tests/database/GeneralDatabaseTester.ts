import {test} from '@testdeck/mocha';
import IDatabase from "../../src/api/database/IDatabase";
import {User, UserGender} from "../../src/api/database/entities/User";
import {assert} from "chai";
import {DBEntityID} from "../../src/api/database/entities/DBEntityID";


// see https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures
export interface DatabaseMaker {(): IDatabase; }



export class GeneralDatabaseTester
{
    protected databaseMaker: DatabaseMaker;

    @test("PutAndGetUser")
    PutAndGetUser()
    {
        const db = this.databaseMaker();

        assert(db.CheckConnection(), "Database is not connected");
        const user: User = new User("a", "Asd", "asd", UserGender.WOMAN);
        let userId = db.AddUser(user);

        assert(userId !== null);
        let userFromDb = db.GetUserById(userId);

        assert(userFromDb !== null);

        assert(User.AreEqual(userFromDb, user));
    }

    private GenerateUsersAndSendThemToDBWithNullCheck(database: IDatabase,usersAmount: number): [User[], DBEntityID[]]
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

    @test("PutAndGetUsers")
    PutAndGetUsers()
    {
        const db = this.databaseMaker();


        assert(db.CheckConnection(), "Database is not connected");

        let [users, userIds] = this.GenerateUsersAndSendThemToDBWithNullCheck(db, 100);

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

        assert(db.CheckConnection(), "Database is not connected");

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

        assert(db.EditUser(userId, newUser), "Database is not able to update user");

        const newUserFromDB = db.GetUserById(userId);

        assert(newUserFromDB !== null);

        assert(User.AreEqual(newUserFromDB, newUser));
    }



    @test("GetAllUsersIdsTest")
    GetAllUsersIdsTest()
    {
        const db = this.databaseMaker();

        assert(db.CheckConnection(), "Database is not connected");

        let [users, usersIds] = this.GenerateUsersAndSendThemToDBWithNullCheck(db, 43);

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
}