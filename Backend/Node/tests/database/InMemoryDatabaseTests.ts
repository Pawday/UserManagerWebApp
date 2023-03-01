import {GeneralDatabaseTester} from "./GeneralDatabaseTester";
import {test, suite} from "@testdeck/mocha";
import {InMemoryDatabase, InMemoryDBEntityId} from "../../src/api/database/implementations/InMemoryDatabase";
import {assert} from "chai";


@suite class InMemoryDatabaseTests extends GeneralDatabaseTester
{
    constructor()
    {
        super();
        this.databaseMaker = () => {return new InMemoryDatabase()};
        this.randomIdMaker = () => {return new InMemoryDBEntityId(9999999999)}
    }

    @test("ConvertIDTest")
    ConvertIDTest()
    {
        const db = this.databaseMaker();


        let validID = "1";
        let invalidID = "invalid";
        let invalidID2 = 32465263;

        let convertedID = db.ConvertToDBEntityIDFrom<String>(validID);
        let convertedInvalidID = db.ConvertToDBEntityIDFrom<String>(invalidID);
        let convertedInvalidID2 = db.ConvertToDBEntityIDFrom<number>(invalidID2);

        assert(convertedID);
        assert(null === convertedInvalidID);
        assert(null === convertedInvalidID2);
        assert(1 === (convertedID as InMemoryDBEntityId).id);
    }
}