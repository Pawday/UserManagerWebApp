import {GeneralDatabaseTester} from "./GeneralDatabaseTester";
import {MongoDatabase, MongoDBEntityID} from "../../src/api/database/implementations/mongoose/MongoDatabase";

import * as crypto from "crypto";

import mongoose from "mongoose";
import {test, suite} from "@testdeck/mocha";
import {assert} from "chai";
import IDatabase from "../../src/api/database/IDatabase";


@suite class MongooseDBDatabaseTests extends GeneralDatabaseTester
{
    private static TEST_DATABASE_NAME_PREFIX: string = "__test_database__";
    private static TEST_DATABASES_CREATED_SO_FAR: number = 0;
    private static TEST_DATABASE_CONNECTION_STRING_BASE: string = "mongodb://127.0.0.1:5000";

    private static TEST_DATABASE_CONNECTION_TIMEOUT_MS: number = 1000;

    constructor()
    {
        super();

        MongooseDBDatabaseTests.TEST_DATABASES_CREATED_SO_FAR++;
        this.databaseMaker = () => new Promise<IDatabase>((resolve,reject) =>
        {
            let connectionString = MongooseDBDatabaseTests.TEST_DATABASE_CONNECTION_STRING_BASE
                + "/" + crypto.randomUUID() + MongooseDBDatabaseTests.TEST_DATABASE_NAME_PREFIX + "_"
                + MongooseDBDatabaseTests.TEST_DATABASES_CREATED_SO_FAR;

            console.log(`Creating test database: ${connectionString}`)

            const database = new MongoDatabase(connectionString);

            database.connection.once("open", () =>
            {
                resolve(database);
            });


            setTimeout(() =>
            {
                reject("test database connection probably cannot be established ->" +
                    "Check MongooseDBDatabaseTests.TEST_DATABASE_CONNECTION_TIMEOUT_MS constant");
            }, MongooseDBDatabaseTests.TEST_DATABASE_CONNECTION_TIMEOUT_MS);

        });


        this.notExistedIdMaker = () =>
        {
            return new MongoDBEntityID(new mongoose.Types.ObjectId("000000000000000000000000"))
        };
    }

    @test("ConvertIDTest")
    async ConvertIDTest()
    {
        const db = await this.databaseMaker();

        let validID = "507f191e810c19729de860ea";
        let invalidID = "invalid";
        let invalidID2 = 32465263;

        let convertedID = await db.ConvertToDBEntityIDFrom<String>(validID);
        let convertedInvalidID = await db.ConvertToDBEntityIDFrom<String>(invalidID);
        let convertedInvalidID2 = await db.ConvertToDBEntityIDFrom<number>(invalidID2);

        assert(convertedID);
        assert(null === convertedInvalidID);
        assert(null === convertedInvalidID2);
        assert(validID === (convertedID as MongoDBEntityID).id.toString());
    }

}