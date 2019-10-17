import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Header.css';

function HeaderLink(props) {
  const { route, routeName } = props;
  return (
    <li>
      <div className="arr">
        <Link to={route}>{routeName}</Link>
      </div>
    </li>
  );
}

HeaderLink.propTypes = {
  route: PropTypes.string,
  routeName: PropTypes.string,
};

HeaderLink.defaultProps = {
  route: PropTypes.string,
  routeName: PropTypes.string,
};

export default HeaderLink;
