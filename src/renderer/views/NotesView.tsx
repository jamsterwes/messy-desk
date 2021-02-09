import React from 'react';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/theme-github";
// Get electron ipcRenderer
const { ipcRenderer } = window.require('electron');

type NotesViewProps = {
    isSelected?: boolean
}

type NoteState = {
    text: string
}

export default class NotesView extends React.Component<NotesViewProps, NoteState> {
    
    value: string = "";
    editor: JSX.Element = null;
    state: NoteState = {
        text: ""
    };

    getClassName(): string {
        let baseName = "content-view";
        if (!this.props.isSelected) {
            baseName += " invisible";
        }
        return baseName;
    }

    componentDidMount() {
        console.log("Hello!");
        ipcRenderer.send("GET_NOTE_TEXT", "");
        ipcRenderer.once("GET_NOTE_TEXT_REPLY", (_: any, noteDataJSON: string) => {
            this.setState({
                ...this.state,
                text: JSON.parse(noteDataJSON).text
            });
        });
    }

    setContent(value: string) {
        this.setState({
            ...this.state,
            text: value
        })
        ipcRenderer.send("SET_NOTE_TEXT", JSON.stringify(this.state));
    }

    // TODO: unhook zoom controls from chrome
    // and use them here for font size changing
    render() {
        return (<div id="notes-view" className={this.getClassName()}>
            <AceEditor
                mode="plain_text"
                theme="github"
                name="notes-editor"
                fontSize={16}
                value={this.state.text}
                onChange={value => {
                    this.setContent(value);
                }}
            />
        </div>);
    }
}