import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Avatar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import authApi from "../api/auth.api";
import baseURL from "../api/baseURL.api";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import uploadAvatar from "../api/upload.api"; // Đảm bảo đã có hàm này
import doctorApi from "../api/doctor.api";

function ProfileDoctor() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const navigate = useNavigate();

  // Lấy token từ localStorage hoặc context
  const cookie = new Cookies();
  const doctorToken = cookie.get("token");

  // Hàm xác thực và lấy thông tin bác sĩ
  const getDoctorByToken = async (doctorToken) => {
    try {
      const res = await authApi.getDoctorByToken(doctorToken);
      if (res.success) {
        setDoctor({
          ...res.doctor,
          gender: res.doctor.gender ? res.doctor.gender.toLowerCase() : "",
        });
        console.log(res.doctor);
      } else {
        navigate("/for-doctor/login");
      }
    } catch (err) {
      navigate("/for-doctor/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctorByToken(doctorToken);
    // eslint-disable-next-line
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  // Xử lý chọn avatar mới
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Validate required fields (except avatar)
  const validateDoctorProfile = (doctor) => {
    const requiredFields = [
      "fullname",
      "dob",
      "email",
      "identity_no",
      "phone_no",
      "gender",
    ];
    const newErrors = {};
    for (let field of requiredFields) {
      if (!doctor[field] || doctor[field].toString().trim() === "") {
        newErrors[field] = "This field is required";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Lưu thông tin và avatar cùng lúc
  const handleSave = async () => {
    if (!validateDoctorProfile(doctor)) {
      return;
    }
    setSaving(true);
    try {
      let avatarUrl = doctor.avatar;
      if (avatarFile) {
        // Upload avatar mới nếu có
        const res = await uploadAvatar(avatarFile);
        if (res.success && res.avatarUrl) {
          avatarUrl = res.avatarUrl;
        }
      }
      // Gọi API update info (bao gồm avatar mới nếu có)
      await doctorApi.updateInfo(doctor.user_id, {
        fullname: doctor.fullname,
        dob: doctor.dob,
        email: doctor.email,
        identity_no: doctor.identity_no,
        phone_no: doctor.phone_no,
        gender: doctor.gender,
        avatar: avatarUrl,
      });
      setDialogMessage("Profile updated successfully!");
      setDialogOpen(true);
      setAvatarFile(null);
      setAvatarPreview(null);
      // Reload lại thông tin mới
      getDoctorByToken(doctorToken);
    } catch (err) {
      setDialogMessage("Update failed! Please try again.");
      setDialogOpen(true);
    }
    setSaving(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  if (loading || !doctor) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <CircularProgress color="primary" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(120deg, #e3f0ff 0%, #f7fbff 100%)",
        padding: "60px 0",
      }}
    >
      <div
        className="max-w-2xl w-full mx-auto p-10 rounded-[28px] shadow-2xl border-2 border-blue-200"
        style={{
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 8px 32px 0 rgba(33,150,243,0.18)",
          backdropFilter: "blur(20px)",
        }}
      >
        <h2
          className="text-3xl font-bold mb-8 text-center"
          style={{
            color: "var(--base-color)",
            textShadow: "2px 2px 8px rgba(33,150,243,0.15)",
            letterSpacing: 1,
          }}
        >
          Doctor Profile
        </h2>
        <div className="flex flex-col items-center mb-8">
          <Avatar
            src={
              avatarPreview ||
              (doctor.avatar ? baseURL + doctor.avatar : "/default-avatar.png")
            }
            alt="Avatar"
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              border: "4px solid #90caf9",
              boxShadow: "0 2px 8px #90caf9aa",
              background: "#e3f0ff",
            }}
          />
          <Button
            variant="outlined"
            component="label"
            sx={{
              mb: 2,
              borderRadius: "12px",
              fontWeight: "bold",
              color: "var(--base-color)",
              borderColor: "#90caf9",
              background: "linear-gradient(90deg, #e3f0ff 60%, #f7fbff 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #90caf9 60%, #e3f0ff 100%)",
                borderColor: "#1976d2",
              },
            }}
          >
            Change Avatar
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </Button>
        </div>
        <form className="flex flex-col gap-5">
          <TextField
            label="Full Name"
            name="fullname"
            value={doctor.fullname || ""}
            onChange={handleChange}
            fullWidth
            sx={{
              background: "#f3f8ff",
              borderRadius: "10px",
            }}
            error={!!errors.fullname}
            helperText={errors.fullname}
          />
          <TextField
            label="Username"
            name="username"
            value={doctor.username || ""}
            disabled
            fullWidth
            sx={{
              background: "#f3f8ff",
              borderRadius: "10px",
            }}
          />
          <TextField
            label="Facility"
            name="facility"
            value={doctor.facility_name || ""}
            disabled
            fullWidth
            sx={{
              background: "#f3f8ff",
              borderRadius: "10px",
            }}
          />
          <TextField
            label="Specialty"
            name="specialty"
            value={doctor.specialty_name || ""}
            disabled
            fullWidth
            sx={{
              background: "#f3f8ff",
              borderRadius: "10px",
            }}
          />
          <TextField
            label="Date of Birth"
            name="dob"
            type="date"
            value={
              doctor.dob
                ? (() => {
                    // Chuyển đổi sang múi giờ Việt Nam (UTC+7)
                    const date = new Date(doctor.dob);
                    const localOffset = date.getTimezoneOffset() * 60000;
                    const vnDate = new Date(
                      date.getTime() - localOffset + 7 * 3600000
                    );
                    return vnDate.toISOString().slice(0, 10);
                  })()
                : ""
            }
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{
              background: "#f3f8ff",
              borderRadius: "10px",
            }}
            error={!!errors.dob}
            helperText={errors.dob}
          />
          <TextField
            label="Email"
            name="email"
            value={doctor.email || ""}
            onChange={handleChange}
            fullWidth
            sx={{
              background: "#f3f8ff",
              borderRadius: "10px",
            }}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Identity Number"
            name="identity_no"
            value={doctor.identity_no || ""}
            onChange={handleChange}
            fullWidth
            sx={{
              background: "#f3f8ff",
              borderRadius: "10px",
            }}
            error={!!errors.identity_no}
            helperText={errors.identity_no}
          />
          <TextField
            label="Phone Number"
            name="phone_no"
            value={doctor.phone_no || ""}
            onChange={handleChange}
            fullWidth
            sx={{
              background: "#f3f8ff",
              borderRadius: "10px",
            }}
            error={!!errors.phone_no}
            helperText={errors.phone_no}
          />
          <TextField
            label="Gender"
            name="gender"
            select
            value={doctor.gender ? doctor.gender.toLowerCase() : ""}
            onChange={handleChange}
            fullWidth
            sx={{
              background: "#f3f8ff",
              borderRadius: "10px",
            }}
            error={!!errors.gender}
            helperText={errors.gender}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
            sx={{
              fontWeight: "bold",
              borderRadius: 3,
              fontSize: 18,
              py: 1.5,
              background: "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
              boxShadow: "0 2px 8px 0 rgba(33,150,243,0.15)",
              letterSpacing: 1,
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
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
            🎉 Notification
          </DialogTitle>
          <DialogContent
            sx={{
              color: dialogMessage.includes("success") ? "#388e3c" : "#d32f2f",
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
                background: "linear-gradient(90deg, #90caf9 60%, #1976d2 100%)",
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
      </div>
    </div>
  );
}

export default ProfileDoctor;
