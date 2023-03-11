import React, {useEffect} from "react";

import LoginScreen from "./loginScreen/LoginScreen";
import {createEvent, createStore, sample} from "effector";
import {useStore} from "effector-react";
import {authenticateUserFx} from "./loginScreen/LoginEvents";
import {EditScreen} from "./editScreen/EditScreen";
import {RegisterApiEffects} from "./api/ApplicationAPI";
import {userPreviewsLoadFx} from "./api/APIEffects";



class ApplicationState
{
    private readonly _token?: string;

    constructor(token?: string)
    {
        this._token = token;
    }

    public HasToken() : boolean
    {
        return !(this._token === undefined);
    }
}

export const applicationStateStore = createStore<ApplicationState>(new ApplicationState());


applicationStateStore.on(authenticateUserFx.doneData, (state, payload) =>
{
    return new ApplicationState(payload.token);
});



const loadUsersOnApplicationStart = createEvent<void>("load_users_on_app_start_event");

sample({
    source: loadUsersOnApplicationStart,
    target: userPreviewsLoadFx
});

export default function Application()
{
    useEffect(() => {loadUsersOnApplicationStart()})

    let currenState = useStore<ApplicationState>(applicationStateStore);

    if (!currenState.HasToken())
        return <LoginScreen />

    RegisterApiEffects();

    return <EditScreen />

}

