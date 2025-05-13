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
  Card,
  CardContent,
  CardActions,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import LoadingScreen from "../components/LoadingScreen";
import AvatarChoosing from "../components/AvatarChoosing";
import {
  Lock,
  Logout,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

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
  const [openAvtMenu, setOpenAvtMenu] = useState(false);
  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await authApi.updateAvatar(formData);
      if (res.success) {
        setAvatar(res.avatar);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Bắt đầu với opacity 0 và trượt từ dưới lên
      animate={{ opacity: 1, y: 0 }} // Hiển thị với opacity 1 và vị trí ban đầu
      exit={{ opacity: 0, y: 50 }} // Khi thoát, trượt xuống và mờ dần
      transition={{ duration: 0.5 }} // Thời gian chuyển đổi
    >
      <Box
        sx={{
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "80px",
          width: "60%",
          padding: "40px",
          backgroundColor: "#f4f6f8",
          textAlign: "center",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} // Bắt đầu với opacity 0 và thu nhỏ
          animate={{ opacity: 1, scale: 1 }} // Hiển thị với opacity 1 và kích thước bình thường
          transition={{ duration: 0.5, delay: 0.2 }} // Thời gian và độ trễ
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "var(--base-color)",
              paddingBottom: "30px",
              fontWeight: "bold",
            }}
          >
            Setting
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          {/* Change Avatar */}
          <Grid item xs={12} sm={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }} // Bắt đầu với opacity 0 và trượt từ trái
              animate={{ opacity: 1, x: 0 }} // Hiển thị với opacity 1 và vị trí ban đầu
              transition={{ duration: 0.5, delay: 0.3 }} // Thời gian và độ trễ
            >
              <Card
                sx={{
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
                    <Person sx={{ marginRight: "8px" }} />
                    Change Avatar
                  </Typography>
                  <div className="flex flex-col items-center">
                    {loadingAvatar ? (
                      <CircularProgress color="primary" />
                    ) : (
                      <Avatar
                        src={user?.avatar}
                        alt="User Avatar"
                        sx={{
                          width: 100,
                          height: 100,
                          marginBottom: "16px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        }}
                      />
                    )}
                    <Button
                      onClick={() => setOpenAvtMenu(true)}
                      variant="contained"
                      sx={{
                        backgroundColor: "var(--base-color)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "darkblue",
                        },
                      }}
                    >
                      Change Avatar
                    </Button>
                    {openAvtMenu && (
                      <AvatarChoosing
                        idUser={user.user_id}
                        onBack={() => setOpenAvtMenu(false)}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Change Password */}
          <Grid item xs={12} sm={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }} // Bắt đầu với opacity 0 và trượt từ phải
              animate={{ opacity: 1, x: 0 }} // Hiển thị với opacity 1 và vị trí ban đầu
              transition={{ duration: 0.5, delay: 0.4 }} // Thời gian và độ trễ
            >
              <Card
                sx={{
                  padding: "20px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
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
                    <Lock sx={{ marginRight: "8px" }} />
                    Change Password
                  </Typography>
                  <TextField
                    label="Old Password"
                    type={showOldPassword ? "text" : "password"} // Hiển thị hoặc ẩn mật khẩu
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
                    type={showNewPassword ? "text" : "password"} // Hiển thị hoặc ẩn mật khẩu
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
                    variant="contained"
                    sx={{
                      backgroundColor: "var(--base-color)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "darkblue",
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
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "var(--base-color)", // Màu base color
                    paddingY: "12px", // py-3
                    fontWeight: "bold",
                  }}
                >
                  <Logout sx={{ marginRight: "8px" }} />
                  Logout
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleLogout}
                  fullWidth
                  sx={{
                    padding: "10px",
                    borderRadius: "8px",
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
