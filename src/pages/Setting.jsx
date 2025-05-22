import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import authApi from "../api/auth.api";
import uploadAvatar from "../api/upload.api";
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
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import LoadingScreen from "../components/LoadingScreen";
import {
  Lock,
  Logout,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import patientApi from "../api/patient.api";
import axios from "axios";
import axiosInstance from "../api/axios.config";
import baseURL from "../api/baseURL.api";

function Setting() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Thêm state cho xem trước avatar
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  useEffect(() => {
    const token = cookies.get("token");
    if (!token) {
      navigate("/account");
    } else {
      verifyUser(token);
    }
    // eslint-disable-next-line
  }, []);

  const getUser = async (token) => {
    try {
      const res = await authApi.getByToken(token);
      setUser(res.user);

      if (res.user.avatar) {
        setAvatar(() => {
          console.log(res.user.avatar);
          return baseURL + res.user.avatar;
        });
      } else {
        setAvatar("");
      }
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

  const handlePasswordChange = async () => {
    const newErrors = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    // Validation rules
    if (!oldPassword) {
      newErrors.oldPassword = "Old Password is required.";
    }

    if (!newPassword) {
      newErrors.newPassword = "New Password is required.";
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "New Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(newPassword)) {
      newErrors.newPassword =
        "New Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(newPassword)) {
      newErrors.newPassword =
        "New Password must contain at least one lowercase letter.";
    } else if (!/[0-9]/.test(newPassword)) {
      newErrors.newPassword = "New Password must contain at least one number.";
    } else if (!/[!@#$%^&*]/.test(newPassword)) {
      newErrors.newPassword =
        "New Password must contain at least one special character (!@#$%^&*).";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Nếu có lỗi, cập nhật state errors và dừng xử lý
    if (
      newErrors.oldPassword ||
      newErrors.newPassword ||
      newErrors.confirmPassword
    ) {
      setErrors(newErrors);
      return;
    }

    // Nếu không có lỗi, tiếp tục xử lý
    setLoading(true);
    setTimeout(async () => {
      try {
        const res = await authApi.changePassword({
          username: user.username,
          password: oldPassword,
          new_password: newPassword,
        });
        if (res.success) {
          cookies.remove("token");
          setDialogMessage(
            "Password changed successfully! Please log in again."
          );
          setTimeout(() => {
            navigate("/account");
          }, 2000);
        } else {
          setDialogMessage("Failed to change password. Please try again.");
        }
      } catch (error) {
        setDialogMessage("An error occurred. Please try again.");
      }
      setDialogOpen(true);
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    setLogoutDialogOpen(false);
    setLoading(true);
    setTimeout(() => {
      cookies.remove("token");
      setLoading(false);
      navigate("/account");
    }, 1000);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  // Khi chọn file, chỉ xem trước, chưa upload
  const handleChooseAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewAvatar(URL.createObjectURL(file));
  };

  // Khi nhấn Save mới upload và cập nhật
  const handleSaveAvatar = async () => {
    if (!selectedFile) return;
    setLoadingAvatar(true);
    try {
      const res = await uploadAvatar(selectedFile);
      if (res.success) {
        try {
          await patientApi.changeAvt({
            id: user.user_id,
            avatar: res.avatarUrl,
          });
          setAvatar(res.avatar);
          setDialogMessage("Avatar updated successfully!");
          setPreviewAvatar(null);
          setSelectedFile(null);
        } catch (err) {
          setDialogMessage(err);
        }
      } else {
        setDialogMessage("Failed to update avatar. Please try again.");
      }
    } catch (error) {
      setDialogMessage("An error occurred while uploading avatar.");
    }
    setLoadingAvatar(false);
    setDialogOpen(true);
  };

  // Hủy xem trước
  const handleCancelPreview = () => {
    setPreviewAvatar(null);
    setSelectedFile(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "80px",
          width: { xs: "98%", md: "65%" },
          padding: { xs: "16px", md: "40px" },
          background: "linear-gradient(135deg, #e0e7ff 0%, #f4f6f8 100%)",
          textAlign: "center",
          borderRadius: "28px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          minHeight: "80vh",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{
              color: "var(--base-color)",
              paddingBottom: "30px",
              fontWeight: "bold",
              letterSpacing: 2,
              textShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            Settings
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {/* Change Avatar */}
          <Grid item xs={12} sm={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card
                sx={{
                  padding: "28px 20px",
                  borderRadius: "20px",
                  boxShadow: "0 1px 4px rgba(80, 112, 255, 0.04)", // giảm bóng đổ hơn nữa
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px) scale(1.01)",
                    boxShadow: "0 2px 8px rgba(80, 112, 255, 0.08)", // bóng nhẹ khi hover
                  },
                  background:
                    "linear-gradient(120deg, #fafdff 60%, #f1f4fa 100%)", // màu nền nhạt hơn
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: "var(--base-color)",
                      paddingY: "12px",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Person sx={{ marginRight: "8px" }} />
                    Change Avatar
                  </Typography>
                  <div className="flex flex-col items-center">
                    {loadingAvatar ? (
                      <CircularProgress color="primary" />
                    ) : (
                      <Avatar
                        src={previewAvatar || avatar || user?.avatar}
                        alt="User Avatar"
                        sx={{
                          width: 110,
                          height: 110,
                          marginBottom: "18px",
                          boxShadow: "0 4px 16px rgba(80, 112, 255, 0.18)",
                          border: "4px solid #fff",
                          background: "#e0e7ff",
                        }}
                      />
                    )}
                    <div className="flex gap-3 mt-2">
                      <Button
                        component="label"
                        variant="contained"
                        sx={{
                          background:
                            "linear-gradient(90deg, #5061ff 60%, #7f9cf5 100%)",
                          color: "white",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          boxShadow: "0 2px 8px rgba(80, 112, 255, 0.10)",
                          "&:hover": {
                            background:
                              "linear-gradient(90deg, #3b47b6 60%, #5061ff 100%)",
                          },
                        }}
                      >
                        Upload Avatar
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={handleChooseAvatar}
                        />
                      </Button>
                    </div>
                    {previewAvatar && (
                      <div className="flex gap-3 mt-4">
                        <Button
                          variant="contained"
                          color="success"
                          onClick={handleSaveAvatar}
                          sx={{
                            borderRadius: "8px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 8px rgba(34,197,94,0.10)",
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={handleCancelPreview}
                          sx={{
                            borderRadius: "8px",
                            fontWeight: "bold",
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Change Password */}
          <Grid item xs={12} sm={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card
                sx={{
                  padding: "28px 20px",
                  borderRadius: "20px",
                  boxShadow: "0 1px 4px rgba(80, 112, 255, 0.04)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px) scale(1.01)",
                    boxShadow: "0 2px 8px rgba(80, 112, 255, 0.08)",
                  },
                  background:
                    "linear-gradient(120deg, #fafdff 60%, #f1f4fa 100%)",
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: "var(--base-color)",
                      paddingY: "12px",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Lock sx={{ marginRight: "8px" }} />
                    Change Password
                  </Typography>
                  <TextField
                    label="Old Password"
                    type={showOldPassword ? "text" : "password"}
                    fullWidth
                    value={oldPassword}
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                      setErrors({ ...errors, oldPassword: "" });
                    }}
                    error={!!errors.oldPassword}
                    helperText={errors.oldPassword}
                    sx={{ marginBottom: "16px" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleShowOldPassword}>
                            {showOldPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="New Password"
                    type={showNewPassword ? "text" : "password"}
                    fullWidth
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors({ ...errors, newPassword: "" });
                    }}
                    error={!!errors.newPassword}
                    helperText={errors.newPassword}
                    sx={{ marginBottom: "16px" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleShowNewPassword}>
                            {showNewPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Confirm New Password"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({ ...errors, confirmPassword: "" });
                    }}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    sx={{ marginBottom: "16px" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={toggleShowConfirmPassword}>
                            {showConfirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    component="label"
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(90deg, #5061ff 60%, #7f9cf5 100%)",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(80, 112, 255, 0.10)",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #3b47b6 60%, #5061ff 100%)",
                      },
                    }}
                    onClick={handlePasswordChange}
                  >
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Logout */}
          <Grid item xs={12}>
            <Card
              sx={{
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 1px 4px rgba(80, 112, 255, 0.04)",
                background:
                  "linear-gradient(120deg, #fafdff 60%, #f1f4fa 100%)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px) scale(1.01)",
                  boxShadow: "0 2px 8px rgba(80, 112, 255, 0.08)",
                },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "var(--base-color)",
                    paddingY: "12px",
                    fontWeight: "bold",
                  }}
                >
                  <Logout sx={{ marginRight: "8px" }} />
                  Logout
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleLogout}
                  fullWidth
                  sx={{
                    padding: "10px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    color: "#fff",
                    background:
                      "linear-gradient(90deg, #ff4d4f 0%, #ff9a8b 100%)", // đỏ sang cam nhạt
                    border: "none",
                    boxShadow: "0 2px 8px rgba(255, 77, 79, 0.10)",
                    transition: "background 0.2s, color 0.2s",
                    "&:hover": {
                      background:
                        "linear-gradient(90deg, #d32f2f 0%, #ff6a6a 100%)", // đỏ đậm sang hồng
                      color: "#fff",
                      border: "none",
                    },
                  }}
                >
                  Logout
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Notification</DialogTitle>
          <DialogContent>
            <Typography>{dialogMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setDialogOpen(false);
                window.location.reload();
              }}
              color="primary"
            >
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
