import {Request, Response} from "express";
import {CheckDBConnectionAndSendError} from "./ResponseUtils";
import APIDatabase from "../APIDatabase";
import {SelectableOptionGroup} from "../database/entities/SelectableOptionGroup";
import {SelectableOption} from "../database/entities/SelectableOption";
import {DBEntityID} from "../database/entities/DBEntityID";


function SendError(resp: Response, message: string)
{
    resp.statusCode = 500;
    resp.send(message);
    return;
}


async function DatabaseInitialiseHandler(req: Request, resp: Response)
{
    CheckDBConnectionAndSendError(resp);

    let movieGenresGroupDBID: DBEntityID | null = await APIDatabase.AddOptionGroup(new SelectableOptionGroup("Жанры фильмов"));

    if (movieGenresGroupDBID == null)
    {
        SendError(resp, "Fail to create option group \"Жанры фильмов\"")
        return;
    }

    const movieOptionsAsStrings: string[] = [
        "Боевик",
        "Вестерн",
        "Детектив",
        "Драма",
        "Комедия",
        "Мелодрама",
        "Мультфильм"];

    for (let optionToAddIndex = 0; optionToAddIndex < movieOptionsAsStrings.length; optionToAddIndex++)
    {
        const value = movieOptionsAsStrings[optionToAddIndex];
        let optionId = await APIDatabase.AddOption(new SelectableOption(value));
        if (optionId == null)
        {
            resp.send(`Inserting ${value} to option list failed`);
            resp.end();
            return;
        }
        let optionBindStatus = await APIDatabase.BindOptionToOptionGroup(optionId, movieGenresGroupDBID);
        if (!optionBindStatus)
        {
            resp.send(`Binding option ${value} to its option group failed`);
            resp.end();
            return;
        }
    }

    let hobbyGroupDBID = await APIDatabase.AddOptionGroup(new SelectableOptionGroup("Хобби"));


    if (hobbyGroupDBID == null)
    {
        SendError(resp, "Fail to create option group \"Хобби\"")
        return;
    }


    const hobbyOptionAsStrings : string[] = [
        "Танцы",
        "Музыка",
        "Стендап",
        "Рукоделие",
        "Фотография",
        "Рисование",
        "Лепка",
        "Оригами",
    ];

    for (let optionToAddIndex = 0; optionToAddIndex < hobbyOptionAsStrings.length; optionToAddIndex++)
    {
        const value = hobbyOptionAsStrings[optionToAddIndex];
        let optionId = await APIDatabase.AddOption(new SelectableOption(value));
        if (optionId == null)
        {
            resp.send(`Inserting ${value} to option list failed`);
            resp.end();
            return;
        }
        let optionBindStatus = await APIDatabase.BindOptionToOptionGroup(optionId, hobbyGroupDBID);
        if (!optionBindStatus)
        {
            resp.send(`Binding option ${value} to its option group failed`);
            resp.end();
            return;
        }
    }

    resp.send("Success");
    resp.end();
}

export default DatabaseInitialiseHandler;