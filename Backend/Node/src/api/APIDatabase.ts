import {InMemoryDatabase} from "./database/implementations/InMemoryDatabase";

const APIDatabase: IDatabase = new InMemoryDatabase();


export default APIDatabase;
