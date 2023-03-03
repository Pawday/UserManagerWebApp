const AUTHENTICATE_URI: string = "http://127.0.0.1:3000/api/auth"

export type AuthenticateError =
{
    errorMessage: string,
    loginErrorMessage: string | null,
    passwordErrorMessage: string | null
};

export function AuthenticateUser(params : {
    login: string,
    password: string
}): Promise<{ token: string }>
{
/*
    Держимся на обещании reject-ить то, что ждет от нас эффект "authenticateUserFx"
    к большой беде reject не может быть типизированным
    https://github.com/Microsoft/TypeScript/issues/7588
*/

    const payload =
        {
            login: params.login,
            password: params.password
        };


    return new Promise<{token: string}>(async (resolve, reject) =>
    {
        try
        {
            const response = await fetch(AUTHENTICATE_URI, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });

            const jsonResp = await response.json();

            if (jsonResp.error)
            {
                reject({
                    errorMessage: jsonResp.error.errorString,
                    loginErrorMessage: "",
                    passwordErrorMessage: ""
                });
                return;
            }

            resolve({token: jsonResp.response.token})
            return;

        } catch (e: any)
        {
            const serverError: AuthenticateError = {
                errorMessage: "Проблемма с подключением к API",
                loginErrorMessage: null,
                passwordErrorMessage: null
            }
            reject(serverError);
        }
    });
}