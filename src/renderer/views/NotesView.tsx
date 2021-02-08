import React from 'react';


type NotesViewProps = {
    isSelected?: boolean
}

export default class NotesView extends React.Component<NotesViewProps> {
    getClassName(): string {
        let baseName = "content-view";
        if (!this.props.isSelected) {
            baseName += " invisible";
        }
        return baseName;
    }

    render() {
        return (<div id="notes-view" className={this.getClassName()}>
            <pre>
    content testing
    eventually will be the notes editor
            </pre>
        </div>);
    }
}