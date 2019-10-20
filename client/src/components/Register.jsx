import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import apiURl from '../api';
import { apiPost } from '../utils';

const Register = () => {
  const [state, setState] = useState({
    email: '',
    password: '',
    name: '',
    isSubmitting: false,
    message: '',
    errors: null,
  });

  const history = useHistory();

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async () => {
    setState({ ...state, isSubmitting: true });

    const { email, password, username } = state;
    try {
      const res = await apiPost('/auth/register', {
        email,
        password,
        username,
      });

      if (!res.success) {
        return setState({
          ...state, message: res.message, errors: res.errors, isSubmitting: false,
        });
      }
      return history.push('/login');
    } catch (err) {
      return setState({ ...state, message: err.toString(), isSubmitting: false });
    }
  };

  return (
    <div className="wrapper">
      <h1>Register</h1>
      <input
        className="input"
        type="name"
        placeholder="Name"
        value={state.name}
        name="name"
        onChange={(e) => {
          handleChange(e);
        }}
      />
      <input
        className="input"
        type="text"
        placeholder="Email"
        value={state.email}
        name="email"
        onChange={(e) => {
          handleChange(e);
        }}
      />
      <input
        className="input"
        type="password"
        placeholder="Password"
        value={state.password}
        name="password"
        onChange={(e) => {
          handleChange(e);
        }}
      />

      <button type="button" disabled={state.isSubmitting} onClick={() => handleSubmit()}>
        {state.isSubmitting ? '.....' : 'Sign Up'}
      </button>
      <div className="message">
        {state.message && (
        <p>
&bull;
          {state.message}
        </p>
        )}
      </div>
      <div>
        {state.errors
          && state.errors.map((error, id) => (
            <p key={id}>
              {' '}
&bull;
              {error}
            </p>
          ))}
      </div>
    </div>
  );
};

export default Register;
