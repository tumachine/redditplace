import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import apiURl from '../api';
import { createCookie, apiPost } from '../utils';

const Login = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
    isSubmitting: false,
    message: '',
  });

  const history = useHistory();

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async () => {
    console.log(state);
    setState({ ...state, isSubmitting: true });

    const { email, password, message } = state;

    try {
      const res = await apiPost('/auth/login', {
        email,
        password,
      });

      if (!res.success) {
        return setState({
          ...state,
          message,
          isSubmitting: false,
        });
      }
      // expire in 30 minutes(same time as the cookie is invalidated on the backend)
      createCookie('token', res.data.token, 0.5);

      return history.push({ pathname: '/session', state: res.data.user });
    } catch (e) {
      return setState({ ...state, message: e.toString(), isSubmitting: false });
    }
  };

  return (
    <div className="wrapper">
      <h1>Login</h1>
      <input
        className="input"
        type="text"
        placeholder="email"
        value={state.email}
        name="email"
        onChange={(e) => {
          handleChange(e);
        }}
      />

      <input
        className="input"
        type="password"
        placeholder="password"
        value={state.password}
        name="password"
        onChange={(e) => {
          handleChange(e);
        }}
      />

      <button type="button" disabled={state.isSubmitting} onClick={() => handleSubmit()}>
        {state.isSubmitting ? '.....' : 'login'}
      </button>
      <div className="message">{state.message}</div>
    </div>
  );
};

export default Login;
