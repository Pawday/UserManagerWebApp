import Express from "express";
import BodyParser from "body-parser";

import APIErrorHandler from "./APIErrorHandler";


import TokenAuthorization from "./authorize/TokenAuthorization";
import AdminAuthorization from "./authorize/AdminAuthorization"

import PostSingleUserHandler from "./handlers/PostSingleUserHandler";
import GetSingleUserHandler from "./handlers/GetSingleUserHandler";
import GetMultipleUsersHandler from "./handlers/GetMultipleUsersHandler";
import GetAllUsersIDSHandler from "./handlers/GetAllUsersIDSHandler";
import DatabaseInitialiseHandler from "./handlers/DatabaseInitialiseHandler";
import PostSingleUserInfoHandler from "./handlers/PostSingleUserInfoHandler";


const APIRouter = Express.Router();

APIRouter.use(APIErrorHandler);
APIRouter.use(BodyParser.json({limit : "10mb"}));

// Request info

// TODO: next 2 routs fight each other
APIRouter.post("/user/info", TokenAuthorization, AdminAuthorization, PostSingleUserInfoHandler);
APIRouter.post("/user/:user_id", TokenAuthorization, AdminAuthorization, GetSingleUserHandler);


APIRouter.post("/users", TokenAuthorization, AdminAuthorization, GetMultipleUsersHandler);

APIRouter.post("/users/ids", TokenAuthorization, AdminAuthorization, GetAllUsersIDSHandler);
APIRouter.post("/user", TokenAuthorization, AdminAuthorization, PostSingleUserHandler);

APIRouter.post("/db/init", TokenAuthorization, AdminAuthorization, DatabaseInitialiseHandler);




APIRouter.all("*", (req, resp) =>
{
    resp.send("Not found api entry " + req.url + " \n Invalid route for /api");
    resp.statusCode = 400;
    resp.end();
});

export default APIRouter;




