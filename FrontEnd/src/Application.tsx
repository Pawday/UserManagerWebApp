import React from "react";

import LoginScreen from "./loginScreen/LoginScreen";
import {createStore} from "effector";
import {useStore} from "effector-react";
import {authenticateUserFx} from "./loginScreen/LoginEvents";
import {EditScreen} from "./editScreen/EditScreen";

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

export default function Application()
{
    let currenState = useStore<ApplicationState>(applicationStateStore);

    if (!currenState.HasToken())
        return <LoginScreen />

    return <EditScreen />

}

