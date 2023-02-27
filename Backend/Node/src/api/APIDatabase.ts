import {InMemoryDatabase} from "./database/implementations/InMemoryDatabase";
import IDatabase from "./database/IDatabase";

const APIDatabase: IDatabase = new InMemoryDatabase();


export default APIDatabase;
