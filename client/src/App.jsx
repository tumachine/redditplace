import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Session from './components/Session';
import Place from './components/Place';
import Header from './components/Header/Header';
import './App.css';

function App() {
  return (
    <div>
      <Header />
      <Router>
        <Route exact path="/" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/session" component={Session} />
        <Route path="/place" component={Place} />
      </Router>
    </div>
  );
}

export default App;
