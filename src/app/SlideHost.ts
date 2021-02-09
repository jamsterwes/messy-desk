const electron = require('electron');
const path = require('path');
import DataStore from './DataStore';

export default class SlideHost {
    private dataStore: DataStore;

    constructor(dataStore: DataStore, scheme: string = "slide") {
        this.dataStore = dataStore;
        electron.protocol.registerFileProtocol(scheme, (req, cb) => {
            this.dataStore.getSlideFilename(path.parse(req.url).name).then((filename: string) => {
                cb(`data/slides/${filename}`);
            });
        });
    }
}