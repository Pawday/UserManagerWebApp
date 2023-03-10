import {test, suite} from "@testdeck/mocha";
import {assert} from "chai";

import {GeneralDatabaseTester} from "./GeneralDatabaseTester";
import {InMemoryDatabase, InMemoryDBEntityId} from "../../src/api/database/implementations/InMemoryDatabase";


@suite class InMemoryDatabaseTests extends GeneralDatabaseTester
{
    constructor()
    {
        super();
        this.databaseMaker = () => Promise.resolve(new InMemoryDatabase());
        this.notExistedIdMaker = () => {return new InMemoryDBEntityId(9999999999)}
    }

    @test("ConvertIDTest")
    async ConvertIDTest()
    {
        const db = await this.databaseMaker();


        let validID = "1";
        let invalidID = "invalid";
        let invalidID2 = 32465263;

        let convertedID = await db.ConvertToDBEntityIDFrom<String>(validID);
        let convertedInvalidID = await db.ConvertToDBEntityIDFrom<String>(invalidID);
        let convertedInvalidID2 = await db.ConvertToDBEntityIDFrom<number>(invalidID2);

        assert(convertedID);
        assert(null === convertedInvalidID);
        assert(null === convertedInvalidID2);
        assert(1 === (convertedID as InMemoryDBEntityId).id);
    }
}