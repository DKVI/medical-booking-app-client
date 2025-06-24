import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Paper,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import authenApi from "../api/auth.api";
import mailPattern from "../pattern/mail.pattern";
import mailApi from "../api/mail.api";
import { Link } from "react-router-dom";

function ResetPassword() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // Hàm tạo random password 8 ký tự (chữ hoa, thường, số, ký tự đặc biệt)
  function generateRandomPassword() {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const number = "0123456789";
    const special = "!@#$%^&*";
    const all = upper + lower + number + special;
    let password = "";
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += number[Math.floor(Math.random() * number.length)];
    password += special[Math.floor(Math.random() * special.length)];
    for (let i = 4; i < 8; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    return password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  }

  const handleChangePassword = async () => {
    setLoading(true);
    const newPassword = generateRandomPassword();
    try {
      // Gọi API reset password
      const res = await authenApi.ResetPassword({
        username,
        email,
        newPassword,
      });
      if (res && res.success) {
        // Gửi mail thông báo
        await mailApi.sendResetPassword(email, username, newPassword);
        setStep(3);
      } else {
        alert("Reset password failed. Please check your username and email.");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await handleChangePassword();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <Paper
        elevation={6}
        className="p-8 rounded-2xl flex flex-col items-center w-full max-w-md shadow-2xl"
        sx={{
          background: "linear-gradient(120deg, #f0f6ff 0%, #e3f0ff 100%)",
          border: "1.5px solid #60a5fa",
          boxShadow: "0 8px 32px 0 rgba(37,99,235,0.10)",
        }}
      >
        <div className="flex flex-col items-center mb-4">
          <LockResetIcon sx={{ fontSize: 48, color: "#2563eb" }} />
          <Typography
            variant="h5"
            className="font-extrabold mb-2 text-blue-900"
            sx={{ letterSpacing: 1 }}
          >
            Reset Password
          </Typography>
          <Typography
            className="text-gray-500 text-center mb-2"
            sx={{ fontSize: 15 }}
          >
            Enter your username and email to receive a reset link.
          </Typography>
        </div>
        {step === 1 && (
          <form
            onSubmit={handleUsernameSubmit}
            className="w-full flex flex-col gap-4"
          >
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              autoFocus
              InputProps={{
                startAdornment: (
                  <PersonOutlineIcon sx={{ color: "#2563eb", mr: 1 }} />
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                fontWeight: "bold",
                borderRadius: 2,
                fontSize: 16,
                py: 1.5,
                background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
                boxShadow: "0 2px 8px 0 rgba(37,99,235,0.10)",
                letterSpacing: 1,
              }}
              disabled={!username}
              endIcon={<EmailOutlinedIcon />}
            >
              Next
            </Button>
          </form>
        )}
        {step === 2 && (
          <form
            onSubmit={handleEmailSubmit}
            className="w-full flex flex-col gap-4"
          >
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoFocus
              InputProps={{
                startAdornment: (
                  <EmailOutlinedIcon sx={{ color: "#2563eb", mr: 1 }} />
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                fontWeight: "bold",
                borderRadius: 2,
                fontSize: 16,
                py: 1.5,
                background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
                boxShadow: "0 2px 8px 0 rgba(37,99,235,0.10)",
                letterSpacing: 1,
              }}
              disabled={!email || loading}
              endIcon={!loading && <LockResetIcon />}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Send Reset Email"
              )}
            </Button>
          </form>
        )}
        {step === 3 && (
          <Box className="flex flex-col items-center gap-4 mt-4">
            <Typography
              className="text-green-600 font-semibold text-center"
              sx={{ fontSize: 17 }}
            >
              We are sending a password reset link to your email {email}.
              <br />
              Please check your inbox!
            </Typography>
            <Link
              to="/account"
              style={{ textDecoration: "none", width: "100%" }}
            >
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{
                  borderRadius: 2,
                  fontWeight: "bold",
                  mt: 2,
                  px: 4,
                  borderColor: "#2563eb",
                  color: "#2563eb",
                  background: "#f3f8ff",
                  "&:hover": { background: "#e0e7ff" },
                  fontSize: 16,
                  letterSpacing: 1,
                }}
              >
                Return to login
              </Button>
            </Link>
          </Box>
        )}
      </Paper>
    </div>
  );
}

export default ResetPassword;
