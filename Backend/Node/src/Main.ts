import APIRouter from "./APIRouter";

const Mongoose = require("mongoose");
import Express from 'express';


let app = Express();

app.use("/api", APIRouter);

app.listen(3000, () =>
{
    console.log("Server started");
});





