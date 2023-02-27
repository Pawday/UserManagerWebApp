import {GeneralDatabaseTester} from "./GeneralDatabaseTester";
import {suite} from "@testdeck/mocha";
import {InMemoryDatabase} from "../../src/api/database/implementations/InMemoryDatabase";


@suite class InMemoryDatabaseTests extends GeneralDatabaseTester
{
    constructor()
    {
        super();
        this.databaseMaker = () => {return new InMemoryDatabase()};
    }
}