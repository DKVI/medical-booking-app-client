import {
  faCalendarDays,
  faChartBar,
  faGear,
  faRightFromBracket,
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
        console.log(res.doctor);
      } else {
        navigate("/for-doctor/login");
        console.log(res.message);
      }
    } catch (err) {
      navigate("/for-doctor/login");
      console.log(err);
    }
  };
  useEffect(() => {
    getDoctorByToken(doctorToken);
  }, []);
  return (
    <div className="px-5 py-3 w-[300px] shadow-2xl bg-white h-full fixed top-0 left-0">
      <div>
        <div className="h-[150px] w-full flex">
          <img
            className="h-full m-auto shadow rounded-full"
            src={baseURL + doctor.avatar}
          />
        </div>
        <div className="text-center">
          <h3 className="text-[24px] pt-6 text-[var(--base-color)] font-bold">
            {doctor.fullname}
          </h3>
          <p className="text-[16px] pt-3 opacity-90 text-[var(--base-color)]">
            {doctor.specialty_name}
          </p>
          <p className="text-[16px] py-3 border-b-2 opacity-90 text-[var(--base-color)]">
            {doctor.facility_name}
          </p>
        </div>
        <nav className="mt-16 px-6 flex">
          <div className="flex flex-col gap-10">
            <NavLink
              to="/for-doctor/dashboard"
              className={({ isActive }) =>
                `flex items-center transition-all duration-300 transform ${
                  isActive
                    ? "text-[var(--base-color)] font-bold scale-120"
                    : "text-gray-600"
                } hover:text-[var(--base-color)] hover:scale-105`
              }
            >
              <FontAwesomeIcon icon={faChartBar} />
              <span className="ml-5">Dashboard</span>
            </NavLink>
            <NavLink
              to="/for-doctor/appointment"
              className={({ isActive }) =>
                `flex items-center transition-all duration-300 transform ${
                  isActive
                    ? "text-[var(--base-color)] font-bold scale-120"
                    : "text-gray-600"
                } hover:text-[var(--base-color)] hover:scale-105`
              }
            >
              <FontAwesomeIcon icon={faCalendarDays} />
              <span className="ml-5">Appointment</span>
            </NavLink>
            <NavLink
              to="/for-doctor/profile"
              className={({ isActive }) =>
                `flex items-center transition-all duration-300 transform ${
                  isActive
                    ? "text-[var(--base-color)] font-bold scale-120"
                    : "text-gray-600"
                } hover:text-[var(--base-color)] hover:scale-105`
              }
            >
              <FontAwesomeIcon icon={faUser} />
              <span className="ml-5">Profile</span>
            </NavLink>
            <NavLink
              to="/for-doctor/settings"
              className={({ isActive }) =>
                `flex items-center transition-all duration-300 transform ${
                  isActive
                    ? "text-[var(--base-color)] font-bold scale-120"
                    : "text-gray-600"
                } hover:text-[var(--base-color)] hover:scale-105`
              }
            >
              <FontAwesomeIcon icon={faGear} />
              <span className="ml-5">Settings</span>
            </NavLink>
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                `flex items-center transition-all duration-300 transform ${
                  isActive
                    ? "text-[var(--base-color)] font-bold scale-120"
                    : "text-gray-600"
                } hover:text-red-600 hover:scale-105`
              }
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
              <span className="ml-5">Logout</span>
            </NavLink>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default SideBarDoctor;
