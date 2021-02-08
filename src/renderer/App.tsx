import React from "react";
import ReactDOM from "react-dom";

// Import components
import Navbar from "./components/Navbar";
import NavbarItem from "./components/NavbarItem";
// Import views
import NotesView from "./views/NotesView";
import SlidesView from "./views/SlidesView";


type AppState = {
    selectedTab: string
}

export class App extends React.Component<{}, AppState> {
    state = {
        selectedTab: "notes"
    }

    isTabSelected(name: string) {
        return this.state.selectedTab === name;
    }

    selectTab(name: string) {
        this.setState({
            ...this.state,
            selectedTab: name
        });
    }

    // TODO: refactor slide selection
    render() {
        return (<div>
            <Navbar app={this} tabs={["notes", "slides", "settings"]} />
            <div id="content">
                {/* TODO: sidebar */}
                <NotesView isSelected={this.state.selectedTab === "notes"} />
                <SlidesView isSelected={this.state.selectedTab === "slides"} />
            </div>
        </div>);
    }
}

// Are you there?
console.log("Hello?");
// Load one App element into #view
ReactDOM.render(<App />, document.getElementById("view"));