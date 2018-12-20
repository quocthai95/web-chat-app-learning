import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Chatroom from './components/Chatroom';
import Login from './components/Login';

class App extends Component {
  render() {
    return (
      <>
      <BrowserRouter>
      <div className="App">
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/chatroom" exact component={Chatroom} />
        <Route render={() => <h1>Not Found</h1>}/>
      </Switch>
      </div>
      </BrowserRouter>
      <div id="loaderContainer"><div className="loader"></div><div className="err_loader">Can't connect to Server. Reconnecting...</div></div>
      </>
    );
  }
}

export default App;
