import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import authApi from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { motion } from "framer-motion"; // Import Framer Motion

function Setting() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  useEffect(() => {
    const token = cookies.get("token");
    if (!token) {
      navigate("/account");
    } else {
      verifyUser(token);
    }
  }, []);

  const verifyUser = async (token) => {
    const res = await authApi.verify(token);
    if (!res.success) {
      navigate("/account");
    }
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setDialogMessage("Please fill in all fields.");
      setDialogOpen(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setDialogMessage("New Password and Confirm Password do not match.");
      setDialogOpen(true);
      return;
    }

    try {
      const res = await authApi.changePassword({ oldPassword, newPassword });
      if (res.success) {
        setDialogMessage("Password changed successfully!");
      } else {
        setDialogMessage("Failed to change password. Please try again.");
      }
    } catch (error) {
      setDialogMessage("An error occurred. Please try again.");
    }
    setDialogOpen(true);
  };

  const handleLogout = () => {
    cookies.remove("token");
    navigate("/account");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 }, // Bắt đầu từ dưới và mờ
    visible: { opacity: 1, y: 0 }, // Hiện lên và về vị trí ban đầu
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      transition={{ duration: 0.5 }} // Thời gian hiệu ứng
    >
      <Box
        sx={{
          marginLeft: "200px",
          marginTop: "80px",
          width: "calc(100vw - 200px)",
          padding: "40px",
          backgroundColor: "#f4f6f8",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "var(--base-color)", // Màu chữ base color
            paddingBottom: "50px", // Khoảng cách dưới
          }}
        >
          Settings
        </Typography>

        <Grid container spacing={4}>
          {/* Change Password */}
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <TextField
              label="Old Password"
              type="password"
              fullWidth
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              sx={{ marginBottom: "16px" }}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ marginBottom: "16px" }}
            />
            <TextField
              label="Confirm New Password"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ marginBottom: "16px" }}
            />
            <Button
              variant="contained"
              className="bg-[var(--base-color)]"
              onClick={handlePasswordChange}
            >
              Change Password
            </Button>
          </Grid>

          {/* Logout */}
          <Grid item xs={6}>
            <Typography variant="h6" gutterBottom>
              Logout
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleLogout}
              fullWidth
            >
              Logout
            </Button>
          </Grid>
        </Grid>

        {/* Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Notification</DialogTitle>
          <DialogContent>
            <Typography>{dialogMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
}

export default Setting;
