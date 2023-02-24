import React from "react";
import {createRoot} from "react-dom/client";

import Application from "./Application";

function Main()
{
    let appMountElement = document.createElement("div");
    appMountElement.id = "mount";
    appMountElement.style.height = "100vh";
    document.body.appendChild(appMountElement);
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    let root = createRoot(appMountElement);

    root.render(<Application />)
}

console.log("Launching application")

document.addEventListener("DOMContentLoaded", Main);
