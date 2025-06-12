import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faSignOutAlt,
  faUserSlash,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import authApi from "../api/auth.api";
import { motion } from "framer-motion";
import LoadingScreen from "../components/LoadingScreen";

function SettingDoctor() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const [successDialog, setSuccessDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [disableDialog, setDisableDialog] = useState(false);
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [confirmChangeDialog, setConfirmChangeDialog] = useState(false);
  const [doctor, setDoctor] = useState({
    user_id: null,
    doctor_id: null,
    fullname: null,
    username: null,
    email: null,
    phone_no: null,
    identity_no: null,
    gender: null,
    avatar: null,
    facility_name: null,
    specialty_name: null,
  });
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const cookie = new Cookies();
  const navigate = useNavigate();
  const getDoctorByToken = async (doctorToken) => {
    try {
      const res = await authApi.getDoctorByToken(doctorToken);
      if (res.success) {
        setDoctor(res.doctor);
      } else {
        navigate("/for-doctor/login");
      }
    } catch (err) {
      navigate("/for-doctor/login");
    }
  };

  useEffect(() => {
    const token = cookie.get("token");
    if (token) {
      getDoctorByToken(token);
    } else {
      navigate("/for-doctor/login");
    }
  }, []);
  // Validate password fields
  const validate = () => {
    const err = {};
    if (!oldPassword) err.oldPassword = "Current password is required";
    if (!newPassword) err.newPassword = "New password is required";
    if (newPassword && newPassword.length < 6)
      err.newPassword = "Password must be at least 6 characters";
    if (newPassword !== confirmPassword)
      err.confirmPassword = "Passwords do not match";
    setError(err);
    return Object.keys(err).length === 0;
  };

  // Handle password change
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setConfirmChangeDialog(true);
  };

  const doChangePassword = async () => {
    setConfirmChangeDialog(false);
    try {
      const username = doctor.username;
      const password = oldPassword;
      const new_password = newPassword;
      await authApi.changePassword({ username, password, new_password });
      setSuccessDialog(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        cookie.remove("token");
        navigate("/for-doctor/login");
      }, 1200);
    } catch (err) {
      setErrorDialog(true);
    }
  };

  // Handle disable account
  const handleDisableAccount = async () => {
    try {
      // Gọi API disable tài khoản ở đây
      await authApi.disableDoctorAccount();
      cookie.remove("token");
      navigate("/for-doctor/login");
    } catch (err) {
      setErrorDialog(true);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setLogoutDialog(true);
  };

  const confirmLogout = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      cookie.remove("token");
      navigate("/for-doctor/login");
    }, 1000);
  };

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div>
      {loading && <LoadingScreen />}
      {/* Header */}
      <div className="fixed top-0 left-[300px] right-0 py-5 px-10 font-bold text-[32px] text-[var(--base-color)] text-left shadow-2xl bg-gradient-to-r from-white via-blue-50 to-blue-100 z-[10000] flex items-center gap-4">
        Settings
      </div>
      <div className="mt-[100px] ml-[300px] py-10 px-[50px] w-[calc(100vw-300px)] min-h-[calc(100vh-100px)] bg-gradient-to-br from-white via-blue-50 to-blue-100 flex flex-col items-center">
        <motion.div
          className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-blue-100 p-10 flex flex-col gap-12"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {/* Change Password */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <FontAwesomeIcon
                icon={faLock}
                className="text-blue-500 text-xl"
              />
              <span className="text-[18px] font-bold text-[var(--base-color)]">
                Change Password
              </span>
            </div>
            <form
              className="flex flex-col gap-7"
              onSubmit={handleChangePassword}
            >
              <TextField
                label="Current Password"
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                error={!!error.oldPassword}
                helperText={error.oldPassword}
                fullWidth
                sx={{
                  background: "#f3f8ff",
                  borderRadius: "10px",
                  fontSize: "15px",
                }}
                InputProps={{
                  sx: { fontSize: 15 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowOldPassword((show) => !show)}
                        edge="end"
                        tabIndex={-1}
                      >
                        <FontAwesomeIcon
                          className="text-[12px]"
                          icon={showOldPassword ? faEye : faEyeSlash}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ sx: { fontSize: 15 } }}
              />
              <TextField
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={!!error.newPassword}
                helperText={error.newPassword}
                fullWidth
                sx={{
                  background: "#f3f8ff",
                  borderRadius: "10px",
                  fontSize: "15px",
                }}
                InputProps={{
                  sx: { fontSize: 15 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword((show) => !show)}
                        edge="end"
                        tabIndex={-1}
                      >
                        <FontAwesomeIcon
                          className="text-[12px]"
                          icon={showNewPassword ? faEye : faEyeSlash}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ sx: { fontSize: 15 } }}
              />
              <TextField
                label="Confirm New Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!error.confirmPassword}
                helperText={error.confirmPassword}
                fullWidth
                sx={{
                  background: "#f3f8ff",
                  borderRadius: "10px",
                  fontSize: "15px",
                }}
                InputProps={{
                  sx: { fontSize: 15 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword((show) => !show)}
                        edge="end"
                        tabIndex={-1}
                      >
                        <FontAwesomeIcon
                          className="text-[12px]"
                          icon={showConfirmPassword ? faEye : faEyeSlash}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{ sx: { fontSize: 15 } }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  fontWeight: "bold",
                  borderRadius: 3,
                  fontSize: 15,
                  py: 1.2,
                  background:
                    "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
                  boxShadow: "0 2px 8px 0 rgba(33,150,243,0.15)",
                  letterSpacing: 1,
                }}
                fullWidth
              >
                Change Password
              </Button>
            </form>
          </div>
          {/* Disable Account */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <FontAwesomeIcon
                icon={faUserSlash}
                className="text-orange-500 text-xl"
              />
              <span className="text-[16px] font-bold text-orange-700">
                Disable Account
              </span>
            </div>
            <Button
              variant="outlined"
              color="warning"
              sx={{
                borderRadius: 3,
                fontWeight: "bold",
                fontSize: 14,
                px: 4,
                py: 1,
                borderColor: "#f59e42",
                color: "#f59e42",
                background: "linear-gradient(90deg, #fff7ed 60%, #f3f8ff 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #f59e42 60%, #fff7ed 100%)",
                  borderColor: "#f59e42",
                  color: "#fff",
                },
              }}
              onClick={() => setDisableDialog(true)}
              fullWidth
            >
              Disable My Account
            </Button>
          </div>
          {/* Logout */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="text-red-500 text-xl"
              />
              <span className="text-[16px] font-bold text-red-700">Logout</span>
            </div>
            <Button
              variant="contained"
              color="error"
              sx={{
                borderRadius: 3,
                fontWeight: "bold",
                fontSize: 14,
                px: 4,
                py: 1,
                background: "linear-gradient(90deg, #f87171 60%, #f3f8ff 100%)",
                color: "#fff",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #dc2626 60%, #f87171 100%)",
                },
              }}
              onClick={handleLogout}
              fullWidth
            >
              Logout
            </Button>
          </div>
        </motion.div>
      </div>
      {/* Success Dialog */}
      <Dialog
        open={successDialog}
        onClose={() => setSuccessDialog(false)}
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
            color: "#388e3c",
            fontWeight: "bold",
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            pb: 0,
          }}
        >
          <FontAwesomeIcon icon={faLock} className="text-green-500 mr-2" />
          Password Changed Successfully
        </DialogTitle>
        <DialogContent
          sx={{
            color: "#388e3c",
            fontWeight: 500,
            fontSize: 17,
            py: 2,
          }}
        >
          Your password has been changed.
          <br />
          You will be redirected to the login page to sign in again.
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setSuccessDialog(false)}
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              px: 4,
              background: "linear-gradient(90deg, #1976d2 60%, #90caf9 100%)",
              color: "#fff",
            }}
            disabled
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      {/* Error Dialog */}
      <Dialog open={errorDialog} onClose={() => setErrorDialog(false)}>
        <DialogTitle sx={{ color: "#d32f2f", fontWeight: "bold" }}>
          Error
        </DialogTitle>
        <DialogContent>Something went wrong. Please try again.</DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* Disable Account Confirm Dialog */}
      <Dialog
        open={disableDialog}
        onClose={() => setDisableDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(120deg, #fff7ed 0%, #fffbe8 100%)",
            boxShadow: "0 8px 32px 0 rgba(245,158,66,0.12)",
            border: "2px solid #f59e42",
            minWidth: 340,
            textAlign: "center",
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#f59e42",
            fontWeight: "bold",
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            pb: 0,
          }}
        >
          <FontAwesomeIcon
            icon={faUserSlash}
            className="text-orange-400 mr-2"
          />
          Disable Account
        </DialogTitle>
        <DialogContent
          sx={{
            color: "#f59e42",
            fontWeight: 500,
            fontSize: 17,
            py: 2,
          }}
        >
          Are you sure you want to disable your account? This action cannot be
          undone.
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setDisableDialog(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              color: "#f59e42",
              borderColor: "#f59e42",
              px: 4,
              "&:hover": { background: "#fffbe8" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDisableAccount}
            variant="contained"
            color="warning"
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              px: 4,
              background: "linear-gradient(90deg, #f59e42 60%, #fff7ed 100%)",
              color: "#fff",
            }}
          >
            Disable
          </Button>
        </DialogActions>
      </Dialog>
      {/* Logout Confirm Dialog */}
      <Dialog
        open={logoutDialog}
        onClose={() => setLogoutDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(120deg, #fff0f0 0%, #ffeaea 100%)",
            boxShadow: "0 8px 32px 0 rgba(244,67,54,0.12)",
            border: "2px solid #ef9a9a",
            minWidth: 340,
            textAlign: "center",
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#d32f2f",
            fontWeight: "bold",
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            pb: 0,
          }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="text-red-400 mr-2" />
          Confirm Logout
        </DialogTitle>
        <DialogContent
          sx={{
            color: "#d32f2f",
            fontWeight: 500,
            fontSize: 17,
            py: 2,
          }}
        >
          Are you sure you want to logout?
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setLogoutDialog(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              color: "#d32f2f",
              borderColor: "#ef9a9a",
              px: 4,
              "&:hover": { background: "#ffeaea" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmLogout}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              px: 4,
              background: "linear-gradient(90deg, #dc2626 60%, #f87171 100%)",
              color: "#fff",
            }}
          >
            Yes, Logout
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirm Change Password Dialog */}
      <Dialog
        open={confirmChangeDialog}
        onClose={() => setConfirmChangeDialog(false)}
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
          <FontAwesomeIcon icon={faLock} className="text-blue-400 mr-2" />
          Confirm Change Password
        </DialogTitle>
        <DialogContent
          sx={{
            color: "#1976d2",
            fontWeight: 500,
            fontSize: 17,
            py: 2,
          }}
        >
          Are you sure you want to change your password? You will be logged out
          after changing.
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setConfirmChangeDialog(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              color: "#1976d2",
              borderColor: "#90caf9",
              px: 4,
              "&:hover": { background: "#e3f0ff" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={doChangePassword}
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              px: 4,
              background: "linear-gradient(90deg, #1976d2 60%, #90caf9 100%)",
              color: "#fff",
            }}
          >
            Yes, Change
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SettingDoctor;
