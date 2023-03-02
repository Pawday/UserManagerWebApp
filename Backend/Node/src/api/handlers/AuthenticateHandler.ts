import {Request, Response} from "express";
import {SendInputNotProvidedError, SendInputNotValidError} from "./ResponseUtils";
import {RootUser} from "../../RootUser";
import {APIError, APIErrorType, APIResponse} from "../APIResponse";




async function AuthenticateHandler(req: Request, resp: Response)
{
    let loginInput = req.body.login;
    let passwordInput = req.body.password;

    if (!loginInput)
    {
        SendInputNotProvidedError(resp, "login");
        return;
    }

    if (!passwordInput)
    {
        SendInputNotProvidedError(resp, "password");
        return;
    }

    if (typeof loginInput !== "string")
    {
        SendInputNotValidError(resp, "login");
        return;
    }

    if (typeof passwordInput !== "string")
    {
        SendInputNotValidError(resp, "password");
        return;
    }

    const apiResponse: APIResponse = new APIResponse();

    const login: string = loginInput as string;
    const password: string = passwordInput as string;



    if (!RootUser.CompareLogin(login))
    {
        apiResponse.error = new APIError(APIErrorType.AUTHENTICATE_ERROR, "Only root user allowed to authenticate for now")
        apiResponse.SendTo(resp);
        return;
    }


    if (!RootUser.ComparePassword(password))
    {
        apiResponse.error = new APIError(APIErrorType.AUTHENTICATE_ERROR, "Incorrect password")
        apiResponse.SendTo(resp);
        return;
    }

    let newToken = RootUser.UpdateToken(login, password);

    if (newToken === null)
    {
        apiResponse.error = new APIError(APIErrorType.UNKNOWN_ERROR, "" +
            "I actually dont know whats happened " +
            "you provided correct login and password but " +
            "\"RootUser.UpdateToken()\" method decided you dont");
        apiResponse.SendTo(resp);
        return;
    }


    apiResponse.response = {token: newToken};
    apiResponse.SendTo(resp);

}

export default AuthenticateHandler;