import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./auth.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Logged in successfully as ${user.name}`);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-banner">
          <img
            src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
            alt="fashion"
            className="auth-banner-img"
          />

          <div className="auth-banner-overlay"></div>

          <a href="/" className="auth-banner-logo">
            Vy<span>nex</span>
          </a>

          <div className="auth-banner-content">
            <span className="auth-banner-tagline">
              Premium Fashion
            </span>

            <h1 className="auth-banner-headline">
              Elevate Your Style Journey
            </h1>

            <p className="auth-banner-sub">
              Experience modern ecommerce with curated fashion collections.
            </p>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-panel-inner">
            <div className="auth-panel-header">
              <span className="auth-step-label">
                Welcome Back
              </span>

              <h2 className="auth-panel-title">
                Login
              </h2>

              <p className="auth-panel-sub">
                Login to continue shopping
              </p>
            </div>

            <div className="auth-field">
              <label className="auth-label">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter Email"
                className="auth-input"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter Password"
                className="auth-input"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <div className="auth-check-row">
              <label className="auth-checkbox">
                <input type="checkbox" />
                Remember Me
              </label>

              <a href="/" className="auth-link">
                Forgot Password?
              </a>
            </div>

            {errorMsg && (
              <div className="alert alert-danger py-2 mb-3 mt-2 text-center" style={{ fontSize: "14px", borderRadius: "6px" }} role="alert">
                {errorMsg}
              </div>
            )}

            <button
              className="btn-auth-primary"
              onClick={handleLogin}
              disabled={loading}
            >
              <span>{loading ? "Logging in..." : "Login"}</span>
            </button>

            <div className="auth-redirect">
              Don't have an account?

              <Link to="/register">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;