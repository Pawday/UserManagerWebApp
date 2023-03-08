import Express from 'express';

import APIRouter from "./api/APIRouter";
import NotApiCallHandler from "./NotApiCallHandler";

import {RootUser} from "./RootUser";

RootUser.Init("admin", "1");

console.log(`Root login: admin`)
console.log(`Root password: 1`)


let app = Express();

app.use("/api", APIRouter);

app.use("*", NotApiCallHandler);

async function main()
{

    app.listen(3000, () =>
    {
        console.log("Server started");
    });
}

main();




