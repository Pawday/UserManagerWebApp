import UserModel from "../models/UserModel";
import {Request, Response} from "express";

async function GetUsersHandler(req: Request, resp: Response)
{
    let users = await UserModel.find({}, "_id");
    resp.send(JSON.stringify(users));
    resp.end();
}

export default GetUsersHandler;