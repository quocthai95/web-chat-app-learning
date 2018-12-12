import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Chatroom from './components/Chatroom';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      <div className="App">
        <Route path="/" exact component={Dashboard} />
        <Route path="/chatroom" exact component={Chatroom} />
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
