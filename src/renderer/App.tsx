import React from "react";
import ReactDOM from "react-dom";

class App extends React.Component {
    render() {
        return (
            <div className="title-text">Welcome to messy-desk v0.0.1</div>
        );
    }
}

// Are you there?
console.log("Hello?");
// Load one App element into #view
ReactDOM.render(<App />, document.getElementById("view"));