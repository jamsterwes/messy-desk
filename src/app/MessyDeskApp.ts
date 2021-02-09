import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";

const defaultProps: BrowserWindowConstructorOptions = {
    width: 900,
    height: 1000,
    show: false,
    webPreferences: {
        nodeIntegration: true
    },
    autoHideMenuBar: true
}

export default class MessyDeskApp {
    public win: BrowserWindow;

    constructor(file: string, windowSettings?: BrowserWindowConstructorOptions) {
        // Initialize superclass with optional additional options
        this.win = new BrowserWindow({...defaultProps, ...windowSettings});
        // Load HTML file
        this.win.loadFile(file);
        // Defer showing until ready to avoid load flicker
        this.win.once('ready-to-show', () => {
            this.win.show();
        });
    }

    sendMessage(channel: string, ...args: any[]) {
        this.win.webContents.send(channel, ...args);
    }
}