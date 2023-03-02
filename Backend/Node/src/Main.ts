import Express from 'express';

import APIRouter from "./api/APIRouter";
import NotApiCallHandler from "./NotApiCallHandler";

import {RootUser} from "./RootUser";

RootUser.Init("admin", "123456");

console.log(`Root login: admin`)
console.log(`Root password: 123456`)


let app = Express();

app.use("/api", APIRouter);

app.use("*", NotApiCallHandler);

async function main()
{
    //await MongooseInit();

    app.listen(3000, () =>
    {
        console.log("Server started");
    });
}

main();




