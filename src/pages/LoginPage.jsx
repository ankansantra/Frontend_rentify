import React, { useState } from "react";
import "../styles/Login.scss"
import { setLogin } from "../redux/state";
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch ("https://rentify-backend-bi7v.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
        return;
      }

      /* Get data after fetching */
      const loggedIn = await response.json()

      if (loggedIn) {
        dispatch (
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token
          })
        )
        navigate("/")
      }else {
        setError("Invalid login response");
      }

    } catch (err) {
      console.log("Login failed", err.message);
      setError("An unexpected error occurred");
    }
  }

  return (
    <div className="login">
      <div className="login_content">
      <h1 className="login_title">Rentify</h1>
        <form className="login_content_form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error_message">{error}</p>}
          <button type="submit">LOG IN</button>
        </form>
        <a href="https://frontend-rentify.vercel.app/register">Don't have an account? Sign In Here</a>
      </div>
    </div>
  );
};

export default LoginPage;
