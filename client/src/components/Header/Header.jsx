import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './Header.css';
import HeaderLink from './HeaderLink';

function Header() {
  const routes = new Map([
    ['/', 'Home'],
    ['/login', 'Login'],
    ['/register', 'Register'],
    ['/place', 'Place'],
  ]);

  return (
    <Router>
      <div>
        <nav>
          <ul />
          {
              Object.entries(routes)
                .map(([key, value]) => <HeaderLink route={key} name={value} />)
              }
        </nav>
      </div>
    </Router>
  );
}

export default Header;
