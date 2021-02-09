import { Database } from 'sqlite3';


export type AppState = {
    selectedTab: string
}

type GetDocDBResponse = {
    ItemObject: string
}

type GetSlideFilenameResponse = {
    File: string
}

export default class DataStore {
    private db: Database;

    // TODO: init db file if doesn't exist
    constructor(file: string) {
        this.db = new Database(file);
    }

    // Get filename from slide name
    /* Internally File is derived from:
       sha256(Name + "$" + currentEpochTime.toString()) + ".png" */
    getSlideFilename(slideName: string): Promise<string> {
        return new Promise<string>((res, rej) => {
            let stmt = this.db.prepare("SELECT File FROM Slides WHERE Name=?");
            stmt.get(slideName, (err: Error, row: GetSlideFilenameResponse) => {
                if (err) {
                    rej(err);
                } else {
                    res(`${row.File}`);
                }
            })
        });
    }

    /* DOC DB */

    getDocDB<T extends object>(itemKey: string): Promise<T> {
        return new Promise<T>((res, rej) => {
            let stmt = this.db.prepare("SELECT ItemObject FROM DocDB WHERE ItemKey=?");
            stmt.get(itemKey, (err: Error, row: GetDocDBResponse) => {
                if (err) {
                    rej(err);
                } else {
                    res(JSON.parse(row.ItemObject) as T);
                }
            })
        })
    }

    setDocDB<T extends object>(itemKey: string, itemObject: T) {
        let itemJSON: string = JSON.stringify(itemObject);
        let insertStmt = this.db.prepare("INSERT OR IGNORE INTO DocDB (ItemKey, ItemObject) VALUES (?, ?)");
        let updateStmt = this.db.prepare("UPDATE DocDB SET ItemObject = ? WHERE ItemKey=?");
        this.db.serialize(() => {
            insertStmt.run(itemKey, itemJSON);
            updateStmt.run(itemJSON, itemKey);
        });
    }
}