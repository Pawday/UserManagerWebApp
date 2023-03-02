import Express from "express";
import BodyParser from "body-parser";

import APIErrorHandler from "./APIErrorHandler";

import AuthenticateHandler from "./handlers/AuthenticateHandler";

import TokenAuthorization from "./auth/TokenAuthorization";
import RootAuthorization from "./auth/RootAuthorization"

import AddSingleUserHandler from "./handlers/PostSingleUserHandler";
import GetSingleUserHandler from "./handlers/GetSingleUserHandler";
import GetMultipleUsersHandler from "./handlers/GetMultipleUsersHandler";
import GetAllUsersIDSHandler from "./handlers/GetAllUsersIDSHandler";
import DatabaseInitialiseHandler from "./handlers/DatabaseInitialiseHandler";
import PostSingleUserInfoHandler from "./handlers/PostSingleUserInfoHandler";



const APIRouter = Express.Router();

APIRouter.use(APIErrorHandler);
APIRouter.use(BodyParser.json({limit : "10mb"}));

// Request info

APIRouter.post("/auth", AuthenticateHandler);

APIRouter.post("/user/info", TokenAuthorization, RootAuthorization, PostSingleUserInfoHandler);
APIRouter.post("/user/get", TokenAuthorization, RootAuthorization, GetSingleUserHandler);


APIRouter.post("/users", TokenAuthorization, RootAuthorization, GetMultipleUsersHandler);

APIRouter.post("/users/ids", TokenAuthorization, RootAuthorization, GetAllUsersIDSHandler);
APIRouter.post("/user/add", TokenAuthorization, RootAuthorization, AddSingleUserHandler);

APIRouter.post("/db/init", TokenAuthorization, RootAuthorization, DatabaseInitialiseHandler);




APIRouter.all("*", (req, resp) =>
{
    resp.send("Not found api entry " + req.url + " \n Invalid route for /api");
    resp.statusCode = 400;
    resp.end();
});

export default APIRouter;




