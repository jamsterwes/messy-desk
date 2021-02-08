import { app } from "electron";
import MessyDeskApp from "./MessyDeskApp";

app.on('ready', () => {
    // TODO: init dataStore/slideHost
    let mdApp = new MessyDeskApp("build/renderer/index.html");
    mdApp.win.once('show', () => {
        // TODO: send data to client (is this right event hook?)
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});