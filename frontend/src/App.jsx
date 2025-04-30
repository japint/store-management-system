import { useState } from "react";
import axios from "axios";

function App() {
  const [registerForm, setRegisterForm] = useState({
    name: "",
    pw: "",
    username: "",
  });
  const [loginForm, setLoginForm] = useState({ pw: "", username: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const registerChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };
  const loginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    await new Promise((res) => setTimeout(res, 3000));

    try {
      const res = await axios.post(
        "http://localhost:4000/user/register",
        registerForm
      );
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response?.data || "Error registering");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    await new Promise((res) => setTimeout(res, 3000));

    try {
      const res = await axios.post("http://localhost:4000/login", loginForm);
      setMessage(res.data);
    } catch (err) {
      setMessage(err.response?.data || "Error login");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Register</h2>
      <form
        onSubmit={handleRegister}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: 300,
        }}
      >
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={registerForm.name}
          onChange={registerChange}
          required
        />
        <input
          type="password"
          name="pw"
          placeholder="Password"
          value={registerForm.pw}
          onChange={registerChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={registerForm.username}
          onChange={registerChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Register"}
        </button>
      </form>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}

      <h2>Log In</h2>
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: 300,
        }}
      >
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={loginForm.username}
          onChange={loginChange}
          required
        />
        <input
          type="password"
          name="pw"
          placeholder="Password"
          value={loginForm.pw}
          onChange={loginChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default App;
