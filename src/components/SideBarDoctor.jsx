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
  return (
    <div className="px-5 py-6 w-[300px] shadow-2xl bg-gradient-to-br from-white via-blue-50 to-blue-100 h-full fixed top-0 left-0 border-r-2 border-blue-100">
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
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-red-100 text-red-600 font-bold shadow"
                    : "text-gray-600"
                } hover:bg-red-50 hover:text-red-600 hover:shadow`
              }
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="text-xl" />
              <span>Logout</span>
            </NavLink>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default SideBarDoctor;
