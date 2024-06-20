import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken, setUserId }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.post('http://localhost:4000/api/users/login', { email, password });
      setToken(response.data.token);
      setUserId(response.data.userId); // Ensure the backend sends userId in the response
      setMessage('Login successful');
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
