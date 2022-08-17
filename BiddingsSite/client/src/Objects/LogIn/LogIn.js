import React from 'react';
import axios from "axios";
import { useState } from "react";
import "./LogIn.css"
import { useNavigate } from "react-router-dom";

function LogIn() {

  let navigate=useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    const data = {username: username, password: password};
    axios.post("http://localhost:8080/Users/login", data).then((res) => {

    if (res.data.error) alert(res.data.error);
    sessionStorage.setItem("AccT", res.data);

    });
  };
  return (
    <div className="LogIn">
      <label>Username:</label>
      <input
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <button onClick={login}> Login </button>
    </div>
  );
}

export default LogIn;
