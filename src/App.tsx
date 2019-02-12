import React, { Component } from "react";
import Editor from "./components/editor";
import "./App.css";

class App extends Component {
  public render() {
    return (
      <div className="App">
        <Editor />
      </div>
    );
  }
}

export default App;
