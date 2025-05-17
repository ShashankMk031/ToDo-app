import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));

  useEffect(() => {
    if (token) {
      axios.get('http://127.0.0.1:8000/api/auth/user/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
      email,
      password,
    });
    setToken(res.data.key);
    localStorage.setItem('authToken', res.data.key);
  };

  const logout = async () => {
    await axios.post('http://127.0.0.1:8000/api/auth/logout/', {}, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const signup = async (email, username, password1, password2) => {
    const res = await axios.post('http://127.0.0.1:8000/api/auth/registration/', {
      email,
      username,
      password1,
      password2,
    });
    setToken(res.data.key);
    localStorage.setItem('authToken', res.data.key);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
