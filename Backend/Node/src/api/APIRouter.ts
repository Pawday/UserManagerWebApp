import Express from "express";
import BodyParser from "body-parser";

import APIErrorHandler from "./APIErrorHandler";


import TokenAuthorization from "./authorize/TokenAuthorization";
import AdminAuthorization from "./authorize/AdminAuthorization"

import PostSingleUserHandler from "./handlers/PostSingleUserHandler";
import GetSingleUserHandler from "./handlers/GetSingleUserHandler";
import GetMultipleUsersHandler from "./handlers/GetMultipleUsersHandler";
import GetAllUsersIDSHandler from "./handlers/GetAllUsersIDSHandler";


const APIRouter = Express.Router();

APIRouter.use(APIErrorHandler);
APIRouter.use(BodyParser.json({limit : "10mb"}));


APIRouter.post("/user/:id", TokenAuthorization, AdminAuthorization, GetSingleUserHandler);
APIRouter.post("/user", TokenAuthorization, AdminAuthorization, PostSingleUserHandler);
APIRouter.post("/users", TokenAuthorization, AdminAuthorization, GetMultipleUsersHandler);
APIRouter.post("/users/ids", TokenAuthorization, AdminAuthorization, GetAllUsersIDSHandler);



APIRouter.all("*", (req, resp) =>
{
    resp.send("Not found api entry " + req.url + " \n Invalid route for /api");
    resp.statusCode = 400;
    resp.end();
});

export default APIRouter;




