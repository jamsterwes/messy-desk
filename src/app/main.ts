import { app, ipcMain, ipcRenderer } from "electron";
import MessyDeskApp from "./MessyDeskApp";
import DataStore, { AppState } from './DataStore';
import SlideHost from './SlideHost';
import { Rectangle } from "electron/main";

/* TODO: move all data into dataStore? 
   and/or encapsulate database queries and data management into two classes */
let appState: AppState;
let dataStore: DataStore;
let slideHost: SlideHost;

type WindowSize = {
    width: number,
    height: number
}

type NoteData = {
    text: string
}

function loadAppAndHookData(size: WindowSize) {
    let mdApp = new MessyDeskApp("build/renderer/index.html", {
        ...size
    });

    mdApp.win.on("will-resize", (e: Event, newBounds: Rectangle) => {
        let newSize: WindowSize = {width: newBounds.width, height: newBounds.height};
        dataStore.setDocDB<WindowSize>("windowSize", newSize);
    });

    ipcMain.on("GET_APP_STATE", () => {
        mdApp.sendMessage("GET_APP_STATE_REPLY", JSON.stringify(appState));
    });

    ipcMain.on("SET_APP_STATE", (_: any, appStateJSON: string) => {
        appState = JSON.parse(appStateJSON) as AppState;
        dataStore.setDocDB<AppState>("appState", appState);
    });

    ipcMain.on("GET_NOTE_TEXT", () => {
        dataStore.getDocDB<NoteData>("testNote").then((note) => {
            mdApp.sendMessage("GET_NOTE_TEXT_REPLY", JSON.stringify(note));
        });
    });

    ipcMain.on("SET_NOTE_TEXT", (_: any, noteDataJSON: string) => {
        dataStore.setDocDB<NoteData>("testNote", JSON.parse(noteDataJSON) as NoteData);
    });
}


app.on('ready', () => {
    // Init data store
    dataStore = new DataStore("./data/messy-desk.db");
    // Init slide host
    slideHost = new SlideHost(dataStore);
    // Only execute app after loading state data, window size
    dataStore.getDocDB<AppState>("appState").then((state) => {
        appState = state;
    }).then(() => {
        dataStore.getDocDB<WindowSize>("windowSize").then((size) => {
            loadAppAndHookData(size);
        })
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});