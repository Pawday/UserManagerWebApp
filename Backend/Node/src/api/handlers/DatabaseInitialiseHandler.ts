import {Request, Response} from "express";
import OptionModel from "../models/OptionModel";
import OptionGroupModel from "../models/OptionGroupModel";


async function DatabaseInitialiseHandler(req: Request, resp: Response)
{
    (await OptionGroupModel.deleteMany({}));
    (await OptionModel.deleteMany({}));

    let movieGenresGroup = (await OptionGroupModel.create({optionGroupName: "Жанры фильмов"}));

    movieGenresGroup.options.push((await OptionModel.create({name: "Боевик"})).id);
    movieGenresGroup.options.push((await OptionModel.create({name: "Вестерн"})).id);
    movieGenresGroup.options.push((await OptionModel.create({name: "Детектив"})).id);
    movieGenresGroup.options.push((await OptionModel.create({name: "Драма"})).id);
    movieGenresGroup.options.push((await OptionModel.create({name: "Комедия"})).id);
    movieGenresGroup.options.push((await OptionModel.create({name: "Мелодрама"})).id);
    movieGenresGroup.options.push((await OptionModel.create({name: "Мультфильм"})).id);

    await movieGenresGroup.save();

    let hobbyGroup = (await OptionGroupModel.create({optionGroupName: "Хобби"}));

    hobbyGroup.options.push((await OptionModel.create({name: "Танцы"})).id);
    hobbyGroup.options.push((await OptionModel.create({name: "Музыка"})).id);
    hobbyGroup.options.push((await OptionModel.create({name: "Стендап"})).id);
    hobbyGroup.options.push((await OptionModel.create({name: "Рукоделие"})).id);
    hobbyGroup.options.push((await OptionModel.create({name: "Фотография"})).id);
    hobbyGroup.options.push((await OptionModel.create({name: "Рисование"})).id);
    hobbyGroup.options.push((await OptionModel.create({name: "Лепка"})).id);
    hobbyGroup.options.push((await OptionModel.create({name: "Оригами"})).id);

    await hobbyGroup.save();

    resp.send("Success");
    resp.end();
}

export default DatabaseInitialiseHandler;