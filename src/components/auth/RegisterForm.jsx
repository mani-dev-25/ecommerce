import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { api } from "../../utils/api";
import "./auth.css";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [otp, setOtp] = useState("");
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Handle OTP resend cooldown timer
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setOtpLoading(true);
    try {
      const res = await api.sendOtp(email);
      setOtpSent(true);
      setTimer(60); // 60 seconds resend cooldown
      toast.success(res.message || "Verification code sent successfully!");
      
      // If we are in mock fallback, res will contain mockOtp. We show it in a toast.
      if (res.mockOtp) {
        toast.info(`DEVELOPER MOCK OTP: ${res.mockOtp}`, {
          autoClose: 15000,
          position: "top-center"
        });
      }
    } catch (err) {
      toast.error(err.message || "Failed to send verification code.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!otpSent) {
      toast.error("Please verify your email by requesting an OTP");
      return;
    }

    if (!otp) {
      toast.error("Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, phone, address, otp);
      toast.success("Account created successfully!");
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-banner">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
            alt="fashion"
            className="auth-banner-img"
          />

          <div className="auth-banner-overlay"></div>

          <a href="/" className="auth-banner-logo">
            Vy<span>nex</span>
          </a>

          <div className="auth-banner-content">
            <span className="auth-banner-tagline">
              Join Vynex
            </span>

            <h1 className="auth-banner-headline">
              Create Your Premium Account
            </h1>

            <p className="auth-banner-sub">
              Start exploring curated fashion and lifestyle products.
            </p>
          </div>
        </div>

        <div className="auth-panel">
          <div className="auth-panel-inner">
            <div className="auth-panel-header">
              <span className="auth-step-label">
                Create Account
              </span>

              <h2 className="auth-panel-title">
                Register
              </h2>

              <p className="auth-panel-sub">
                Join the next generation ecommerce platform
              </p>
            </div>

            <div className="auth-field">
              <label className="auth-label">
                Full Name *
              </label>

              <input
                type="text"
                placeholder="Enter Name"
                className="auth-input"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">
                Email Address *
              </label>

              <div className="otp-input-row">
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="auth-input"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  disabled={otpSent}
                />
                <button
                  type="button"
                  className="btn-otp-action"
                  onClick={handleSendOtp}
                  disabled={otpLoading || (otpSent && timer > 0)}
                >
                  {otpLoading ? "Sending..." : otpSent ? (timer > 0 ? `Resend (${timer}s)` : "Resend") : "Send OTP"}
                </button>
              </div>
              
              {otpSent && (
                <button
                  type="button"
                  className="btn-otp-change-email"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                >
                  Change Email
                </button>
              )}
            </div>

            {otpSent && (
              <div className="auth-field fade-slide-down">
                <label className="auth-label">
                  Verification Code *
                </label>

                <input
                  type="text"
                  placeholder="Enter 6-Digit OTP"
                  className="auth-input"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  maxLength={6}
                />
                <span className="otp-helper-text">
                  Enter the 6-digit verification code sent to your email.
                </span>
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label">
                Password *
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

            <div className="auth-field">
              <label className="auth-label">
                Phone Number (Encrypted in DB)
              </label>

              <input
                type="text"
                placeholder="Enter Phone Number"
                className="auth-input"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">
                Shipping Address (Encrypted in DB)
              </label>

              <input
                type="text"
                placeholder="Enter Address"
                className="auth-input"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
              />
            </div>

            <button
              className="btn-auth-primary"
              onClick={handleRegister}
              disabled={loading}
            >
              <span>{loading ? "Registering..." : "Register"}</span>
            </button>

            <div className="auth-redirect">
              Already have an account?

              <Link to="/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;