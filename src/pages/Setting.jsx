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
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import LoadingScreen from "../components/LoadingScreen";
import AvatarChoosing from "../components/AvatarChoosing";

function Setting() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false); // State cho dialog logout
  const [loading, setLoading] = useState(false); // State cho loading screen
  const [avatar, setAvatar] = useState("");
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [user, setUser] = useState(null);
  const [openAvtMenu, setOpenAvtMenu] = useState(false);
  useEffect(() => {
    const token = cookies.get("token");
    if (!token) {
      navigate("/account");
    } else {
      verifyUser(token);
    }
  }, []);

  const getUser = async (token) => {
    try {
      const res = await authApi.getByToken(token);
      setUser(res.user);
    } catch (err) {
      console.log(err);
    }
  };

  const verifyUser = async (token) => {
    const res = await authApi.verify(token);
    if (!res.success) {
      navigate("/account");
    } else {
      await getUser(token);
    }
  };

  const saveAvt = () => {};

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
    setLogoutDialogOpen(true); // Mở dialog logout
  };

  const confirmLogout = () => {
    setLogoutDialogOpen(false); // Đóng dialog logout
    setLoading(true); // Hiển thị loading screen
    setTimeout(() => {
      cookies.remove("token");
      setLoading(false); // Tắt loading screen
      navigate("/account"); // Chuyển về trang đăng nhập
    }, 1000); // Loading trong 1 giây
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false); // Đóng dialog logout
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await authApi.updateAvatar(formData); // API cập nhật avatar
      if (res.success) {
        setAvatar(res.avatar); // Cập nhật avatar mới
        setDialogMessage("Avatar updated successfully!");
      } else {
        setDialogMessage("Failed to update avatar. Please try again.");
      }
    } catch (error) {
      setDialogMessage("An error occurred while updating avatar.");
    }

    setLoadingAvatar(false);
    setDialogOpen(true);
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
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "80px",
          width: "50%",
          padding: "40px",
          backgroundColor: "#f4f6f8",
          textAlign: "center",
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

        <Grid container spacing={4} direction="column" alignItems="center">
          {/* Change Avatar */}
          <Grid item xs={5}>
            <Typography variant="h6" gutterBottom>
              Change Avatar
            </Typography>
            <div className="flex flex-col items-center">
              {loadingAvatar ? (
                <div className="flex justify-center items-center h-[150px]">
                  <CircularProgress color="primary" />
                </div>
              ) : (
                <img
                  src={user?.avatar}
                  alt="User Avatar"
                  className="mb-4 rounded-full shadow-lg"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              )}
              <Button
                onClick={() => setOpenAvtMenu(true)}
                variant="contained"
                component="label"
                className="bg-[var(--base-color)]"
              >
                Change Avatar
              </Button>
              {openAvtMenu && (
                <AvatarChoosing onBack={() => setOpenAvtMenu(false)} />
              )}
            </div>
          </Grid>

          {/* Change Password */}
          <Grid item xs={5}>
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
          <Grid item xs={5}>
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

        {/* Logout Dialog */}
        <Dialog open={logoutDialogOpen} onClose={handleCloseLogoutDialog}>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to logout?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseLogoutDialog} color="primary">
              No
            </Button>
            <Button onClick={confirmLogout} color="secondary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Loading Screen */}
        {loading && <LoadingScreen />}
      </Box>
    </motion.div>
  );
}

export default Setting;
