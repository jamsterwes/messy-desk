import React from "react";
import ReactDOM from "react-dom";

// Get electron ipcRenderer
const { ipcRenderer } = window.require('electron');

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

    // Avoid re-sending init state to electron
    lastUpdateWasInit: boolean = false;

    // Load state from electron
    componentDidMount() {
        ipcRenderer.send("GET_APP_STATE", "");
        ipcRenderer.once("GET_APP_STATE_REPLY", (_: any, appStateJSON: string) => {
            this.lastUpdateWasInit = true;
            this.setState(JSON.parse(appStateJSON));
        });
    }

    // Send state to electron
    componentDidUpdate() {
        if (!this.lastUpdateWasInit) {
            ipcRenderer.send("SET_APP_STATE", JSON.stringify(this.state));
        }
        this.lastUpdateWasInit = false;
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

// Load one App element into #view
ReactDOM.render(<App />, document.getElementById("view"));