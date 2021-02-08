import React from 'react';

type SlidesViewProps = {
    isSelected?: boolean
}

// TODO: make base class view and extend
export default class SlidesView extends React.Component<SlidesViewProps> {
    getClassName(): string {
        let baseName = "content-view";
        if (!this.props.isSelected) {
            baseName += " invisible";
        }
        return baseName;
    }

    render() {
        return (<div id="slides-view" className={this.getClassName()}>
            <img src="slide://test-slide-1.png" />
        </div>);
    }
}