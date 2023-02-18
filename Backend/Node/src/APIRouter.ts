import Express from "express";
import bodyParser from "body-parser";

import UserModel from "./models/UserModel";
import {APIError, APIErrorType, APIResponse} from "./APIResponse";

const APIRouter = Express.Router();

APIRouter.use(bodyParser.json({limit : "10mb"}));

APIRouter.get("/users", async (req, resp) =>
{
    resp.setHeader('Content-Type', 'application/json');
    let users = await UserModel.find({});
    resp.send(JSON.stringify(users));
    resp.end();
});

APIRouter.post("/users", async (req,resp) =>
{
    let apiResponse: APIResponse = new APIResponse();

    let userName = req.body.name;
    let userEmail = req.body.email;

    if (!userName)
    {
        let errorString = "request field \"name\" should be defined";
        apiResponse.error =  new APIError(APIErrorType.INVALID_PARAMS, errorString);
        apiResponse.SendTo(resp);
        return;
    }

    if (!userEmail)
    {
        let errorString = "request field \"email\" should be defined";
        apiResponse.error = new APIError(APIErrorType.INVALID_PARAMS, errorString);
        apiResponse.SendTo(resp);
        return;
    }

    let user = new UserModel(
    {
        name: userName,
        email: userEmail
    });

    user.save();
    apiResponse.response = "Success";
    apiResponse.SendTo(resp);
});

APIRouter.all("*", (req, resp) =>
{
    resp.send("Not found api entry" + req.url);
    resp.end();
});



export default APIRouter;




