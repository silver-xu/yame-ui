import React, { Component } from 'react';
import './App.css';
import Editor from './components/editor';

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
