import Express from "express";

import cors from "cors";
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
import DeleteUserHandler from "./handlers/DeleteUserHandler";
import {GetAllOptionGroupsWithOptionsHandler} from "./handlers/complexHandlers/GetAllOptionGroupsWithOptionsHandler";
import {AddUserWithFullInfoHandler} from "./handlers/complexHandlers/AddUserWithFullInfoHandler";
import {GetFullUserInfoHandler} from "./handlers/complexHandlers/GetFullUserInfoHandler";
import {UpdateFullUserHandler} from "./handlers/complexHandlers/UpdateFullUserHandler";



const APIRouter = Express.Router();

APIRouter.use(APIErrorHandler);
APIRouter.use(BodyParser.json({limit : "10mb"}));


const corsParams =
{
    credentials: true,
    origin: true
};

APIRouter.use(cors(corsParams));

APIRouter.options("*", cors(corsParams));


APIRouter.post("/auth", AuthenticateHandler);

APIRouter.post("/user/info", TokenAuthorization, RootAuthorization, PostSingleUserInfoHandler);
APIRouter.post("/user/get", TokenAuthorization, RootAuthorization, GetSingleUserHandler);
APIRouter.post("/user/get/full", TokenAuthorization, RootAuthorization, GetFullUserInfoHandler);
APIRouter.post("/user/delete", TokenAuthorization, RootAuthorization, DeleteUserHandler);
APIRouter.post("/user/update/full", TokenAuthorization, RootAuthorization, UpdateFullUserHandler);

APIRouter.post("/options/fullTree", TokenAuthorization, RootAuthorization, GetAllOptionGroupsWithOptionsHandler);

APIRouter.post("/users", TokenAuthorization, RootAuthorization, GetMultipleUsersHandler);

APIRouter.post("/users/ids", TokenAuthorization, RootAuthorization, GetAllUsersIDSHandler);
APIRouter.post("/user/add", TokenAuthorization, RootAuthorization, AddSingleUserHandler);
APIRouter.post("/user/add/full", TokenAuthorization, RootAuthorization, AddUserWithFullInfoHandler);

APIRouter.post("/db/init", TokenAuthorization, RootAuthorization, DatabaseInitialiseHandler);




APIRouter.all("*", (req, resp) =>
{
    resp.statusCode = 400;
    resp.send("Not found api entry " + req.url + " \n Invalid route for /api");
    resp.end();
});

export default APIRouter;




