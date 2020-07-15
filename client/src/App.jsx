import React from 'react';
import "@babel/polyfill";
import { Route, NavLink, HashRouter } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Session from './components/Session';
import Place from './components/Place/Place';
import Board from './components/Place/Board';
import './App.css';

function App() {
  return (
    <HashRouter>
      <div>
        <h1>Tumen Portfolio</h1>
        <ul className="header">
          <li><NavLink exact to="/">Home</NavLink></li>
          <li><NavLink to="/login">Login</NavLink></li>
          <li><NavLink to="/register">Register</NavLink></li>
          <li><NavLink to="/session">Session</NavLink></li>
          <li><NavLink to="/place">Place</NavLink></li>
          <li><NavLink to="/board">Board</NavLink></li>
        </ul>
        <div className="content">
          <Route exact path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/session" component={Session} />
          <Route path="/register" component={Register} />
          <Route path="/place" component={Place} />
          <Route path="/board" component={Board} />
        </div>

      </div>
    </HashRouter>
  );
}

export default App;
