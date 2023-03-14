import Express from 'express';

import APIRouter from "./api/APIRouter";
import NotApiCallHandler from "./NotApiCallHandler";

import {RootUser} from "./RootUser";
import {ApiDBInitAsInMemory, ApiDBInitAsMongo} from "./api/APIDatabase";
import {IGNORE_AUTH, SHOW_ROOT_TOKEN_UPDATE} from "./api/DEV_SWITCHES";
import crypto from "crypto";



if (process.argv.length < 3)
{
    console.log("[INFO] Запуск сервиса в автономном режиме")
    ApiDBInitAsInMemory();
}

if (process.argv.length >= 3)
{
    console.log("[INFO] Запуск сервиса с подключением к MongoDB")
    ApiDBInitAsMongo(process.argv[2]);
}

const rootPassword = crypto.randomUUID();

RootUser.Init("admin", "1");

console.log(`[INFO] Логин оператора: admin`)
console.log(`[INFO] Пароль оператора: 1`)


if (IGNORE_AUTH)
    console.log("[WARN_DEV] Авторизация по токену отключена (IGNORE_AUTH == true)");

if (SHOW_ROOT_TOKEN_UPDATE)
    console.log("[WARN_DEV] Включен показ обновления токена оператора (SHOW_ROOT_TOKEN_UPDATE == true)");

let app = Express();

app.use("/api", APIRouter);

app.use("*", NotApiCallHandler);

async function main()
{

    app.listen(3000, () =>
    {
        console.log("[INFO] Сервер запущен");
    });
}

main();




