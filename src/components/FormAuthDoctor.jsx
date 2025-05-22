import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/auth.api";
import Cookies from "universal-cookie";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserDoctor } from "@fortawesome/free-solid-svg-icons";

function FormAuthDoctor() {
  const cookies = new Cookies();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [generalError, setGeneralError] = useState("");
  const [onLoading, setOnLoading] = useState(false);
  const navigate = useNavigate();

  const onLogin = async (data) => {
    setOnLoading(true);
    try {
      const res = await authApi.loginDoctor(data);
      if (res.success) {
        const cookieValue = res.token;
        cookies.set("token", cookieValue, { path: "/", maxAge: 3600 });
        navigate("/for-doctor/dashboard");
      } else {
        setGeneralError(res.message);
      }
    } catch (error) {
      setGeneralError("An error occurred. Please try again.");
    } finally {
      setOnLoading(false);
    }
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {
      username: "",
      password: "",
    };

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    if (validate()) {
      onLogin({ username, password });
    }
  };

  return (
    <Box
      className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-2xl border border-blue-100 px-8 py-8 flex flex-col items-center w-full"
      sx={{ maxWidth: 400, margin: "0 auto" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <FontAwesomeIcon
          icon={faUserDoctor}
          className="text-blue-500 text-3xl"
        />
        <span className="text-[26px] font-extrabold text-[var(--base-color)] drop-shadow">
          Doctor Login
        </span>
      </div>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        className="w-full"
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
          disabled={onLoading}
        >
          {onLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </Box>
    </Box>
  );
}

export default FormAuthDoctor;
