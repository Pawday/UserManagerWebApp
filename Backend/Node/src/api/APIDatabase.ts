import IDatabase from "./database/IDatabase";
import {MongoDatabase} from "./database/implementations/mongoose/MongoDatabase";
import {InMemoryDatabase} from "./database/implementations/InMemoryDatabase";

let APIDatabaseInstance: IDatabase | null = null;

function ApiDBInitAsInMemory()
{
    APIDatabaseInstance = new InMemoryDatabase();
    return;
}

function ApiDBInitAsMongo(connectionString: string)
{
    APIDatabaseInstance = new MongoDatabase(connectionString);
}

export default function APIDatabase(): IDatabase
{
    if (APIDatabaseInstance === null)
    {
        console.error("[APIDatabase] requested databaseInstance is null, EXITING PROCESS");
        process.exit(-1);
    }
    return APIDatabaseInstance;
}
