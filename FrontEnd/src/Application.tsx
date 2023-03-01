import React from "react";

import LoginScreen from "./loginScreen/LoginScreen";
import {createEvent, createStore} from "effector";
import {useStore} from "effector-react";

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

export const set_token_event = createEvent<string>("set_user_token");

applicationStateStore.on<string>(set_token_event, (state, newToken) =>
{
    return new ApplicationState(newToken);
});

export default function Application()
{
    let currenState = useStore<ApplicationState>(applicationStateStore);

    if (!currenState.HasToken())
        return <LoginScreen />

    return <h1>Hello {currenState.temporary_get_for_demo()}</h1>

}

