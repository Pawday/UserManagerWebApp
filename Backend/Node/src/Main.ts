import Express from 'express';

import APIRouter from "./APIRouter";
import NotApiCallHandler from "./NotApiCallHandler";

import MongooseInit from "./MongooseInit";


let app = Express();

app.use("/api", APIRouter);

app.use("*", NotApiCallHandler);

async function main()
{
    await MongooseInit();

    app.listen(3000, () =>
    {
        console.log("Server started");
    });
}

main();




