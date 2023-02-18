import Express from "express"


const APIRouter = Express.Router();

APIRouter.get("/users", (req, resp) =>
{
    resp.send("No users for you");
    resp.end();
});



export default APIRouter;




