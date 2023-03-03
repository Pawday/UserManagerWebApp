import React from "react";

import LoginScreen from "./loginScreen/LoginScreen";
import {createStore} from "effector";
import {useStore} from "effector-react";
import {authenticateUserFx} from "./loginScreen/LoginEvents";

class ApplicationState
{
    private readonly _token?: string;

    constructor(token?: string)
    {
        this._token = token;
    }


    temporary_get_for_demo()
    {
        return this._token;
    }

    public HasToken() : boolean
    {
        return !(this._token === undefined);
    }
}

const applicationStateStore = createStore<ApplicationState>(new ApplicationState());


applicationStateStore.on(authenticateUserFx.doneData, (state, payload) =>
{
    return new ApplicationState(payload.token);
});

export default function Application()
{
    let currenState = useStore<ApplicationState>(applicationStateStore);

    if (!currenState.HasToken())
        return <LoginScreen />

    return <h1>Hello {currenState.temporary_get_for_demo()}</h1>

}

