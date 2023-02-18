import process from "node:process";
import Mongoose from "mongoose";

const mongoConnection: string = "mongodb://127.0.0.1:5000/test";
const mongoConnectionTimeoutMS: number = 1000;


export default async function MongooseInit()
{
    Mongoose.set('strictQuery', true);

    await MongooseConnect();
}

async function MongooseConnect()
{
    // TODO: Deal with JetBrains Webstorm inspection, it think i use result of await somewhere
    // noinspection JSVoidFunctionReturnValueUsed
    await Mongoose.connect(mongoConnection,{serverSelectionTimeoutMS:mongoConnectionTimeoutMS}).catch((e) =>
    {
        console.error(e);
        console.log("Error connection to mongodb server");
        process.exit(-1);
    });
}