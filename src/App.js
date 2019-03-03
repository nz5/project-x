import React, { Component } from 'react';
import './App.css';
import MyNav from './myComponents/MyNav';

class App extends Component {
  render() {
    return (
      <div className="App">
        <MyNav className="Nav"/>
      </div>
    );
  }
}

export default App;
