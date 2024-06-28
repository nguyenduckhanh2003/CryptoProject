import React, { useState, useEffect } from "react";
import "../css/Login.css";
import loginBg from "../Img/back_form.jpg";
import { setCookies } from "../Helps/Cookies";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const validateForm = () => {
    let isValid = true;
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password!");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Using fetch API
        const response = await fetch(
          "http://localhost:8000/api/v1/auth/login",
          {
            method: "POST",
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": true,
              "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          },
        );

        const data = await response.json();
        console.log(data);
       
          if (data.message) {
            setErrorMessage(data.message);
          }
          else {
            console.log("Login successful", data);
            setCookies("jwt", data.access_token, 30)
            setCookies("role", data.role, 25)
            setCookies("displayName", data.displayName, 30)
            window.alert("Login successful");
            setTimeout(() => {
              if (data.role === "ADMIN") {
                window.location.href = "/admin";
              } else if (data.role === "ADVERTISER") {
                window.location.href = "/adv/*";
              }
              else{
                window.location.href = "/crypto";
              }

            }, 1000);
          }
      } catch (error) {
        console.error("Error during login:", error);
        setErrorMessage(
          "Failed to login. Please check your credentials and try again.",
        );
      }
    }
  };

  return (
    <div className="login">
      <img src={loginBg} alt="image" className="login__bg" />

      <form action="" className="login__form" onSubmit={handleSubmit}>
        <a href="/crypto">
          <i className="bi bi-arrow-left"></i>
        </a>
        <h1 className="login__title">Login</h1>
        <div className="login__inputs">
          <div className="login__box">
            <input
              type="text"
              name="email"
              placeholder="Email ID"
              className="login__input"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="login__box">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="login__input"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          {errorMessage && <p className="login__error">{errorMessage}</p>}
        </div>

        <div className="login__check">
          <div className="login__check-box">
            <input
              type="checkbox"
              className="login__check-input"
              id="user-check"
            />
            <label htmlFor="user-check" className="login__check-label">
              Remember me
            </label>
          </div>

          <a href="/changePassword" className="login__forgot">
            Forgot Password?
          </a>
        </div>

        <button type="submit" className="login__button">
          Login
        </button>

        <div className="login__register">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </form>
    </div>

  );
}

export default Login;
