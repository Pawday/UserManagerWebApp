import {Router} from "express";

const NotApiCallHandler = Router();


const ResponseString: string = "Bad request,\n url should begin with /api";

NotApiCallHandler.all("*", (req, resp) =>
{
    resp.send(ResponseString);
    resp.end();
})

export default NotApiCallHandler;