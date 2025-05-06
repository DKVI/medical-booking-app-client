import React, { useState } from "react";
import "../App.css";
import {
  faCalendarDays,
  faChartSimple,
  faGear,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";
import Cookies from "universal-cookie";
import LoadingScreen from "./LoadingScreen";
import { motion } from "framer-motion";

export default function SideBar() {
  const cookies = new Cookies();
  const navigate = new useNavigate();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [onLoading, setOnLoading] = useState(false);
  const [onHover, setOnHover] = useState(false);

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleLogout = () => {
    cookies.remove("token");
    setOnLoading(true);
    navigate("/account");
  };

  return (
    <motion.div
      className={`shadow-2xl p-5 flex flex-col justify-between transition-all duration-300 ${
        onHover ? "w-[200px]" : "w-[60px]"
      }`}
      style={{
        position: "fixed",
        top: "80px",
        bottom: "0",
        left: "0",
        backgroundColor: "white",
        overflow: "hidden",
      }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      {/* Main Menu */}
      <div className="main-menu flex flex-col gap-4">
        <Link className="flex items-center gap-2" to={"/dashboard"}>
          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={faChartSimple}
              className="text-[var(--base-color)] text-xl"
            />
          </div>
          <p
            className={`text-[var(--base-color)] transition-opacity duration-300 ${
              onHover ? "opacity-100" : "opacity-0"
            }`}
          >
            Dashboard
          </p>
        </Link>
        <Link className="flex items-center gap-2" to={"/booking-type"}>
          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="text-[var(--base-color)] text-xl"
            />
          </div>
          <p
            className={`text-[var(--base-color)] transition-opacity duration-300 ${
              onHover ? "opacity-100" : "opacity-0"
            }`}
          >
            Booking
          </p>
        </Link>
        <Link className="flex items-center gap-2" to={"/profile"}>
          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={faUser}
              className="text-[var(--base-color)] text-xl"
            />
          </div>
          <p
            className={`text-[var(--base-color)] transition-opacity duration-300 ${
              onHover ? "opacity-100" : "opacity-0"
            }`}
          >
            Profile
          </p>
        </Link>
      </div>

      {/* Sub Menu */}
      <div className="sub-menu flex flex-col gap-4">
        <Link className="flex items-center gap-2" to={"/setting"}>
          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={faGear}
              className="text-[var(--base-color)] text-xl"
            />
          </div>
          <p
            className={`text-[var(--base-color)] transition-opacity duration-300 ${
              onHover ? "opacity-100" : "opacity-0"
            }`}
          >
            Setting
          </p>
        </Link>
        <Link
          className="flex items-center gap-2"
          onClick={() => {
            setOpenLogoutDialog(true);
          }}
        >
          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="text-[var(--base-color)] text-xl"
            />
          </div>
          <p
            className={`text-[var(--base-color)] transition-opacity duration-300 ${
              onHover ? "opacity-100" : "opacity-0"
            }`}
          >
            Logout
          </p>
        </Link>
        <ConfirmDialog
          isOpen={openLogoutDialog}
          handleClose={handleCloseLogoutDialog}
          title={"Come back soon!"}
          description={"Are you sure you want to Log out?"}
          callback={handleLogout}
        />
        {onLoading && <LoadingScreen />}
      </div>
    </motion.div>
  );
}
