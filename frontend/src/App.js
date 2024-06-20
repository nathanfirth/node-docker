import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Chat from './components/Chat';
import Register from './components/Register';
import Login from './components/Login';

const socket = io('http://localhost:4000');

function App() {
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch initial messages from the backend
    axios.get('http://localhost:4000/api/chat/messages')
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });

    // Set up socket.io listener
    socket.on('message', message => {
      setMessages(messages => [...messages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const sendMessage = (message) => {
    socket.emit('message', { message, user_id: userId });
  };

  if (!token) {
    return (
      <div>
        <h2>Register</h2>
        <Register />
        <h2>Login</h2>
        <Login setToken={setToken} setUserId={setUserId} />
      </div>
    );
  }

  return (
    <div className="App">
      <Chat messages={messages} sendMessage={sendMessage} userId={userId} />
    </div>
  );
}

export default App;
