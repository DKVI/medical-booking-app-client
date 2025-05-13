import {
  faCalendarDays,
  faChartBar,
  faGear,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { NavLink } from "react-router-dom";

function SideBarDoctor() {
  return (
    <div className="px-5 py-3 w-[300px] shadow-2xl bg-white h-full fixed top-0 left-0">
      <div>
        <div className="h-[150px] w-full flex">
          <img className="h-full m-auto shadow" src="/doctor-avt-male.png" />
        </div>
        <div className="text-center">
          <h3 className="text-[24px] pt-6 text-[var(--base-color)] font-bold">
            Dr. Hoàng Văn An
          </h3>
          <p className="text-[16px] py-3 border-b-2 opacity-70 text-[var(--base-color)]">
            Nội tổng quát
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
