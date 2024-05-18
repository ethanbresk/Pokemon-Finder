import React, { Component } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from "react-router-dom";
import Main from './pages/Main.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import "./App.css";
import {useState, useEffect} from 'react';
import axios from "axios";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    const currentToken = localStorage.getItem("token");
    if (loggedInUser) {
      axios.get('http://localhost:8000/check-auth/', { params: { username: loggedInUser, token: currentToken }})
      .then (res => {
        if (res.data.is_authenticated === 'true') {
          setIsAuthenticated(true)
        }
      })
    }
  }, []);

  return (
    <>
      <Router>
          <Routes>
              <Route
                  path="/"
                  element={<Main />}
              ></Route>
              <Route
                  path="/login"
                  element={isAuthenticated ? <Main /> : <Login />}
              ></Route>
              <Route
                  path="/register"
                  element={isAuthenticated ? <Main /> : <Register />}
              ></Route>
          </Routes>
      </Router>
    </>
  );
}


export default App;