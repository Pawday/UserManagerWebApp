import IDatabase from "./database/IDatabase";
import {MongoDatabase} from "./database/implementations/mongoose/MongoDatabase";

const APIDatabase: IDatabase = new MongoDatabase("mongodb://127.0.0.1:5000/app");

export default APIDatabase;
