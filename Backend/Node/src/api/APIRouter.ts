import Express from "express";
import BodyParser from "body-parser";

import ErrorHandler from "./ErrorHandler";

import PostSingleUserHandler from "./post/PostSingleUserHandler";
import GetUsersHandler from "./get/GetUsersHandler";
import GetSingleUserHandler from "./get/GetSingleUserHandler";
import GetMultipleUsersHandler from "./post/GetMultipleUsersHandler";

const APIRouter = Express.Router();

APIRouter.use(ErrorHandler);
APIRouter.use(BodyParser.json({limit : "10mb"}));

APIRouter.get("/users", GetUsersHandler);
APIRouter.get("/user/:id", GetSingleUserHandler);

APIRouter.post("/user", PostSingleUserHandler);
APIRouter.post("/users", GetMultipleUsersHandler); //JSON payload for multiple users ids



APIRouter.all("*", (req, resp) =>
{
    resp.send("Not found api entry " + req.url + " \n Invalid route for /api");
    resp.statusCode = 400;
    resp.end();
});

export default APIRouter;




