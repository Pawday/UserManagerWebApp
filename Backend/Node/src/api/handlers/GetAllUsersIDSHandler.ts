import UserModel from "../models/UserModel";
import {Request, Response} from "express";

async function GetAllUsersIDSHandler(req: Request, resp: Response)
{
    let users = await UserModel.find({}, "_id");

    users = users.map((user: any) =>
    {
        return user._id.toString();
    });

    resp.setHeader("Content-Type", "application/json");
    resp.send(JSON.stringify(users));
    resp.end();
}

export default GetAllUsersIDSHandler;