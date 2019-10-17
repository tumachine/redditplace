import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import apiURl from '../api';
import { deleteCookie, apiAuthorize } from '../utils';

const Session = () => {
  const [state, setState] = useState({
    isFetching: false,
    message: null,
    user: null,
  });

  const history = useHistory();

  const getUserInfo = async () => {
    setState({ ...state, isFetching: true, message: 'fetching details...' });
    try {
      const res = await apiAuthorize(`${apiURl}/auth/session`);

      if (!res.success) {
        history.push('/login');
      }
      console.log(res.data.username);
      return setState({
        ...state, user: res.data, message: null, isFetching: false,
      });
    } catch (e) {
      return setState({ ...state, message: e.toString(), isFetching: false });
    }
  };

  const handleLogout = () => {
    deleteCookie('token');
    history.push('/login');
  };

  useEffect(() => {
    if (history.location.state) {
      return setState({ ...state, user: { ...history.location.state } });
    }
    getUserInfo();
    return setState({ ...state });
  }, []);

  return (
    <div className="wrapper">
      <h1>
Welcome,
        {state.user && state.user.name}
      </h1>
      {state.user && state.user.email}
      <div className="message">
        {state.isFetching ? 'fetching details..' : state.message}
      </div>

      <button
        type="button"
        style={{ height: '30px' }}
        onClick={() => {
          handleLogout();
        }}
      >
        logout
      </button>
    </div>
  );
};

export default Session;
