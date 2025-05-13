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
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
    <Container component="main" className="pt-[100px]" maxWidth="xs">
      <CssBaseline />
      {onLoading && <div>Loading...</div>}
      <div
        className="bg-white px-5 pb-10 pt-1 rounded-[20px]"
        style={{
          boxShadow: "2px 2px 12px 4px #cccc",
        }}
      >
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            fontWeight="bold"
            className="text-[var(--base-color)]"
          >
            Login for Doctor
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
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
              <Alert severity="error" sx={{ mt: 2 }}>
                {generalError}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </div>
    </Container>
  );
}

export default FormAuthDoctor;
