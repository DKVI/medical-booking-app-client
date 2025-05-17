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
} from "@mui/material";
import patientApi from "../api/patient.api";
import LoadingScreen from "../components/LoadingScreen";
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
  });

  const [errors, setErrors] = useState({}); // State để lưu lỗi
  const [dialogOpen, setDialogOpen] = useState(false); // State để quản lý dialog
  const [dialogMessage, setDialogMessage] = useState(""); // Nội dung thông báo trong dialog
  const [loading, setLoading] = useState(false);
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

      setFormData({
        username: user.username || "",
        fullname: user.fullname || "",
        idNumber: user.identity_no || "",
        insuranceNumber: user.insurance_no || "",
        phoneNumber: user.phone_no || "",
        gmail: user.email || "",
        gender: user.gender || "",
      });
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
  };

  // Animation Variants
  const fieldVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <motion.div
        className="dashboard-container ml-[200px] mt-[80px] w-[calc(100vw-200px)] p-[60px] bg-[#f4f6f8] gap-[20px]"
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.05 }}
          style={{
            color: "var(--base-color)",
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Profile
        </motion.h1>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 4,
            backgroundColor: "white",
            borderRadius: 2,
            maxWidth: 600,
            mx: "auto",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
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
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "5px",
                  }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.2 }}
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
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "5px",
                  }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.3 }}
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
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "5px",
                  }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.4 }}
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
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "5px",
                  }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.5 }}
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
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "5px",
                  }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.6 }}
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
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "5px",
                  }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.7 }}
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
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "5px",
                  }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
              </motion.div>
            </Grid>
            <Grid item xs={12}>
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    borderRadius: "5px",
                  }}
                >
                  Save
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>{dialogMessage}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Profile;
