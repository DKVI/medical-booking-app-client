import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import authApi from "../api/auth.api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Grid,
  MenuItem,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  CircularProgress,
} from "@mui/material";
import patientApi from "../api/patient.api";
import LoadingScreen from "../components/LoadingScreen";
import uploadAvatar from "../api/upload.api";
import baseURL from "../api/baseURL.api";

function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "john_doe",
    fullname: "",
    idNumber: "",
    insuranceNumber: "",
    phoneNumber: "",
    gmail: "",
    gender: "",
    weight: "", // Thêm weight
    height: "", // Thêm height
  });

  const [errors, setErrors] = useState({}); // State để lưu lỗi
  const [dialogOpen, setDialogOpen] = useState(false); // State để quản lý dialog
  const [dialogMessage, setDialogMessage] = useState(""); // Nội dung thông báo trong dialog
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    if (!token) {
      navigate("/account");
    }
    verifyUser(token);
    getUser(token);
  }, []);

  const verifyUser = async (token) => {
    const res = await authApi.verify(token);
    if (!res.success) {
      navigate("/account");
    }
  };

  const getUser = async (token) => {
    try {
      const res = await authApi.getByToken(token);
      const user = res.user;
      setUser(user);
      setFormData({
        username: user.username || "",
        fullname: user.fullname || "",
        idNumber: user.identity_no || "",
        insuranceNumber: user.insurance_no || "",
        phoneNumber: user.phone_no || "",
        gmail: user.email || "",
        gender: user.gender || "",
        weight: user.weight || "", // Thêm weight
        height: user.height || "", // Thêm height
      });
      // Lấy avatar
      if (user.avatar) {
        setAvatar(baseURL + user.avatar);
      } else {
        setAvatar("");
      }
    } catch (error) {
      navigate("/account");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullname) {
      newErrors.fullname = "Full Name is required";
    }

    if (!formData.idNumber || !/^\d{9,12}$/.test(formData.idNumber)) {
      newErrors.idNumber = "ID Number must be 9-12 digits";
    }

    if (!formData.phoneNumber || !/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone Number must be 10 digits";
    }

    if (!formData.gmail || !/\S+@\S+\.\S+/.test(formData.gmail)) {
      newErrors.gmail = "Invalid email format";
    }

    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }
    if (!formData.height) {
      newErrors.height = "Height is required";
    }
    if (!formData.weight) {
      newErrors.weight = "Weight is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const updatePatient = async (data) => {
    try {
      const res = await patientApi.update(data);
      if (res && res.success) {
        setDialogMessage("Update info successfully!");
      } else {
        setDialogMessage("System error. Please try again.");
      }
      setDialogOpen(true);
      setLoading(false);
    } catch (err) {
      setDialogMessage("System error. Please try again.");
      setDialogOpen(true);
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      if (validate()) {
        await updatePatient(formData);
      } else {
        setDialogMessage("System error. Please try again.");
        setDialogOpen(true);
        setLoading(false);
      }
    }, 1000);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    if (
      dialogMessage === "Update info successfully!" ||
      dialogMessage === "Avatar updated successfully!"
    ) {
      window.location.reload();
    }
  };

  // Animation Variants
  const fieldVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  // Xử lý chọn file avatar
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
          setDialogMessage(err?.message || "Update avatar failed!");
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
    <>
      {loading && <LoadingScreen />}
      <motion.div
        className="dashboard-container ml-[200px] mt-[100px] w-[calc(100vw-200px)] min-h-[100vh] flex items-center justify-center"
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5 }}
        style={{
          background: "linear-gradient(120deg, #e3f0ff 0%, #f7fbff 100%)",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 700,
            mb: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "linear-gradient(120deg, #fff 70%, #e3f0ff 100%)",
            borderRadius: 5,
            boxShadow: "0 8px 32px 0 rgba(33,150,243,0.12)",
            border: "2px solid #90caf9",
            p: 5,
          }}
        >
          <motion.h1
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.05 }}
            style={{
              color: "var(--base-color)",
              textAlign: "center",
              marginBottom: "32px",
              fontWeight: "bold",
              letterSpacing: 2,
              textShadow: "0 2px 8px #90caf9aa",
              fontSize: "3.2em",
            }}
          >
            Profile
          </motion.h1>
          {/* Avatar Block trên cùng */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              marginBottom: 32,
              background: "linear-gradient(120deg, #fafdff 60%, #e3f0ff 100%)",
              borderRadius: 20,
              boxShadow: "0 2px 8px rgba(80, 112, 255, 0.08)",
              padding: 24,
              width: "100%",
              maxWidth: 340,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              {loadingAvatar ? (
                <CircularProgress color="primary" />
              ) : (
                <Avatar
                  src={previewAvatar || avatar}
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
            </div>
            <div className="flex gap-3 mt-2">
              <Button
                component="label"
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(90deg, #90caf9 60%, #1976d2 100%)",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(80, 112, 255, 0.10)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #1976d2 60%, #90caf9 100%)",
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
          </motion.div>
          {/* Profile Form dưới avatar */}
          <Box
            component={motion.form}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            sx={{
              width: "100%",
              p: 0,
              background: "transparent",
              boxShadow: "none",
              border: "none",
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <motion.div
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <TextField
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    disabled
                    sx={{
                      background: "#f7fbff",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#90caf9" },
                        "&:hover fieldset": { borderColor: "#1976d2" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <motion.div
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <TextField
                    label="Full Name"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.fullname}
                    helperText={errors.fullname}
                    sx={{
                      background: "#f7fbff",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#90caf9" },
                        "&:hover fieldset": { borderColor: "#1976d2" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <motion.div
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <TextField
                    label="Identity Number"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.idNumber}
                    helperText={errors.idNumber}
                    sx={{
                      background: "#f7fbff",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#90caf9" },
                        "&:hover fieldset": { borderColor: "#1976d2" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <motion.div
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  <TextField
                    label="Insurance Number (optional)"
                    name="insuranceNumber"
                    value={formData.insuranceNumber}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.insuranceNumber}
                    helperText={errors.insuranceNumber}
                    sx={{
                      background: "#f7fbff",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#90caf9" },
                        "&:hover fieldset": { borderColor: "#1976d2" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <motion.div
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                    sx={{
                      background: "#f7fbff",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#90caf9" },
                        "&:hover fieldset": { borderColor: "#1976d2" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <motion.div
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  <TextField
                    label="Gmail"
                    name="gmail"
                    value={formData.gmail}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.gmail}
                    helperText={errors.gmail}
                    sx={{
                      background: "#f7fbff",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#90caf9" },
                        "&:hover fieldset": { borderColor: "#1976d2" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <motion.div
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <TextField
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    select
                    fullWidth
                    error={!!errors.gender}
                    helperText={errors.gender}
                    sx={{
                      background: "#f7fbff",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#90caf9" },
                        "&:hover fieldset": { borderColor: "#1976d2" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                          borderWidth: 2,
                        },
                      },
                    }}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={3}>
                <motion.div
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <TextField
                    label="Weight (kg)"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      background: "#f7fbff",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#90caf9" },
                        "&:hover fieldset": { borderColor: "#1976d2" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={3}>
                <motion.div
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <TextField
                    label="Height (cm)"
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                      background: "#f7fbff",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#90caf9" },
                        "&:hover fieldset": { borderColor: "#1976d2" },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1976d2",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} sm={6} display="flex" alignItems="end"></Grid>
            </Grid>
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.55 }}
              style={{ width: "100%", display: "flex" }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth // Đảm bảo nút Save chiếm toàn bộ chiều ngang
                sx={{
                  margin: 0, // Xóa margin để full width thật sự
                  background:
                    "linear-gradient(90deg, #90caf9 60%, #1976d2 100%)",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 18,
                  borderRadius: "8px",
                  boxShadow: "0px 4px 16px rgba(33,150,243,0.15)",
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #1976d2 60%, #90caf9 100%)",
                  },
                }}
              >
                Save
              </Button>
            </motion.div>
          </Box>
          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            PaperProps={{
              sx: {
                borderRadius: 4,
                background: "linear-gradient(120deg, #e3f0ff 0%, #f7fbff 100%)",
                boxShadow: "0 8px 32px 0 rgba(33,150,243,0.15)",
                border: "2px solid #90caf9",
                minWidth: 340,
                textAlign: "center",
                p: 2,
              },
            }}
          >
            <DialogTitle
              sx={{
                color: "#1976d2",
                fontWeight: "bold",
                fontSize: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                pb: 0,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#90caf9",
                  width: 36,
                  height: 36,
                  mr: 1,
                }}
              >
                <span role="img" aria-label="info" style={{ fontSize: 22 }}>
                  ℹ️
                </span>
              </Avatar>
              Notification
            </DialogTitle>
            <DialogContent
              sx={{
                color: "#1976d2",
                fontWeight: 500,
                fontSize: 18,
                py: 2,
              }}
            >
              {dialogMessage}
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
              <Button
                onClick={handleCloseDialog}
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(90deg, #90caf9 60%, #1976d2 100%)",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  px: 4,
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #1976d2 60%, #90caf9 100%)",
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </motion.div>
    </>
  );
}

export default Profile;
