import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/auth.api";
import Cookies from "universal-cookie";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CssBaseline,
  Alert,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingScreen from "./LoadingScreen";
import VerifyEmail from "./VerifyEmail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";

function FormAuth() {
  const cookies = new Cookies();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [generalError, setGeneralError] = useState("");
  const [onLoading, setOnLoading] = useState(false); // Thêm state onLoading
  const navigate = useNavigate();

  const onLogin = async (data) => {
    const res = await authApi.login(data);
    if (res.success) {
      const cookieValue = res.token;
      cookies.set("token", cookieValue, { path: "/", maxAge: 3600 });
      navigate("/dashboard");
    } else {
      setOnLoading(false);
      setGeneralError(res.message);
    }
  };

  const onRegister = async (data) => {
    const res = await authApi.register(data);
    if (res.success) {
      const cookieValue = res.token;
      setToken(cookieValue);
      setOnLoading(false);
      cookies.set("token", cookieValue, { path: "/", maxAge: 3600 });
      setCreateAccount(true);
    } else {
      setOnLoading(false);
      setGeneralError(res.message);
    }
  };
  const validate = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!isLogin && !email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!isLogin && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    if (validate()) {
      setOnLoading(true); // Bật trạng thái loading
      console.log(onLoading);
      try {
        if (isLogin) {
          if (onLogin) {
            onLogin({ username, password });
          }
        } else {
          if (onRegister) {
            onRegister({ username, email, password });
          }
        }
      } catch (error) {
        setGeneralError(error.message || "An error occurred");
      }
    }
  };

  return (
    <Container component="main" className="pt-[100px]" maxWidth="xs">
      <CssBaseline />
      {onLoading && <LoadingScreen />}
      <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 px-7 pb-10 pt-1 rounded-[24px] shadow-2xl border border-blue-100">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <FontAwesomeIcon
              icon={isLogin ? faUser : faUserPlus}
              className="text-blue-500 text-3xl"
            />
            <Typography
              component="h1"
              variant="h5"
              fontWeight="bold"
              className="text-[var(--base-color)] text-2xl drop-shadow"
            >
              {isLogin ? "User Login" : "Register"}
            </Typography>
          </div>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 2,
                boxShadow: "0 1px 8px #e0e7ff44",
              }}
            />
            {!isLogin && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  boxShadow: "0 1px 8px #e0e7ff44",
                }}
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              sx={{
                background: "#fff",
                borderRadius: 2,
                mb: 2,
                boxShadow: "0 1px 8px #e0e7ff44",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {!isLogin && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  mb: 2,
                  boxShadow: "0 1px 8px #e0e7ff44",
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
            {generalError && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {generalError}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                fontWeight: "bold",
                fontSize: 18,
                borderRadius: 3,
                letterSpacing: 1,
                background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
              }}
            >
              {isLogin ? "Login" : "Register"}
            </Button>
            {isLogin && (
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                <Link href="/forgot-password">Forgot Password?</Link>
              </Typography>
            )}
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link
                href="#"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  });
                  setGeneralError("");
                  setUsername("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                }}
              >
                {isLogin ? "Register here" : "Login here"}
              </Link>
            </Typography>
          </Box>
        </Box>
        {createAccount && (
          <VerifyEmail username={username} email={email} token={token} />
        )}
      </div>
    </Container>
  );
}

export default FormAuth;
