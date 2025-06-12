import {
  faCalendarDays,
  faChartBar,
  faGear,
  faHospitalAlt,
  faHospitalSymbol,
  faRightFromBracket,
  faStethoscope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Cookie } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import authApi from "../api/auth.api";
import baseURL from "../api/baseURL.api";
import LoadingScreen from "../components/LoadingScreen";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function SideBarDoctor() {
  const cookie = new Cookies();
  const doctorToken = cookie.get("token");
  const navigate = useNavigate();
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
  const [logoutDialog, setLogoutDialog] = useState(false);
  const [loading, setLoading] = useState(false);

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
    getDoctorByToken(doctorToken);
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    setLogoutDialog(true);
  };

  const confirmLogout = () => {
    setLogoutDialog(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      cookie.remove("token");
      navigate("/for-doctor/login");
    }, 1000);
  };

  return (
    <div className="px-5 py-6 w-[300px] shadow-2xl bg-gradient-to-br from-white via-blue-50 to-blue-100 h-full fixed top-0 left-0 border-r-2 border-blue-100">
      {loading && <LoadingScreen />}
      <div>
        <div className="h-[150px] w-full flex items-center justify-center">
          <div className="rounded-full border-4 border-blue-200 shadow-lg p-1 bg-white">
            <img
              className="h-[110px] w-[110px] object-cover rounded-full"
              src={
                doctor.avatar ? baseURL + doctor.avatar : "/default-avatar.png"
              }
              alt="avatar"
            />
          </div>
        </div>
        <div className="text-center mt-4">
          <h3 className="text-[24px] pt-2 text-[var(--base-color)] font-extrabold drop-shadow">
            {doctor.fullname}
          </h3>
          <p className="text-[16px] pt-2 font-semibold text-blue-800">
            <FontAwesomeIcon
              icon={faStethoscope}
              className="mr-2 text-blue-300"
            />
            {doctor.specialty_name}
          </p>
          <p className="text-[16px] py-3 border-b-2 border-blue-200 font-medium text-blue-800">
            <FontAwesomeIcon
              icon={faHospitalAlt}
              className="mr-2 text-blue-300"
            />
            {doctor.facility_name}
          </p>
        </div>
        <nav className="mt-12 px-4 flex">
          <div className="flex flex-col gap-8 w-full">
            <NavLink
              to="/for-doctor/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-blue-100 text-[var(--base-color)] font-bold shadow"
                    : "text-gray-600"
                } hover:bg-blue-50 hover:text-[var(--base-color)] hover:shadow`
              }
            >
              <FontAwesomeIcon icon={faChartBar} className="text-xl" />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/for-doctor/appointment"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-blue-100 text-[var(--base-color)] font-bold shadow"
                    : "text-gray-600"
                } hover:bg-blue-50 hover:text-[var(--base-color)] hover:shadow`
              }
            >
              <FontAwesomeIcon icon={faCalendarDays} className="text-xl" />
              <span>Appointment</span>
            </NavLink>
            <NavLink
              to="/for-doctor/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-blue-100 text-[var(--base-color)] font-bold shadow"
                    : "text-gray-600"
                } hover:bg-blue-50 hover:text-[var(--base-color)] hover:shadow`
              }
            >
              <FontAwesomeIcon icon={faUser} className="text-xl" />
              <span>Profile</span>
            </NavLink>
            <NavLink
              to="/for-doctor/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-blue-100 text-[var(--base-color)] font-bold shadow"
                    : "text-gray-600"
                } hover:bg-blue-50 hover:text-[var(--base-color)] hover:shadow`
              }
            >
              <FontAwesomeIcon icon={faGear} className="text-xl" />
              <span>Settings</span>
            </NavLink>
            <a
              href="#logout"
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:shadow"
              style={{ cursor: "pointer" }}
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="text-xl" />
              <span>Logout</span>
            </a>
          </div>
        </nav>
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
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="text-red-400 mr-2"
            />
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
              No
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
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default SideBarDoctor;
