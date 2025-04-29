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
import { motion } from "framer-motion"; // Import Framer Motion

export default function SideBar() {
  const cookies = new Cookies();
  const navigate = new useNavigate();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [onLoading, setOnLoading] = useState(false);

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleLogout = () => {
    cookies.remove("token");
    setOnLoading(true);
    navigate("/account");
  };

  const slideInVariants = {
    hidden: { opacity: 0, x: -200 }, // Bắt đầu ở ngoài màn hình bên trái
    visible: { opacity: 1, x: 0 }, // Hiển thị và trượt vào vị trí ban đầu
  };

  return (
    <motion.div
      className="w-[200px] shadow-2xl p-5 flex flex-col justify-between"
      style={{
        position: "fixed",
        top: "80px",
        bottom: "0",
        left: "0",
        backgroundColor: "white",
      }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }} // Thời gian hiệu ứng
      variants={slideInVariants}
    >
      {/* Main Menu (Phần trên) */}
      <div className="main-menu flex flex-col gap-4">
        <Link className="flex items-center gap-2" to={"/dashboard"}>
          <FontAwesomeIcon
            icon={faChartSimple}
            className="text-[var(--base-color)] text-xl"
          />
          <p className="text-[var(--base-color)]">Dashboard</p>
        </Link>
        <Link className="flex items-center gap-2" to={"/booking-type"}>
          <FontAwesomeIcon
            icon={faCalendarDays}
            className="text-[var(--base-color)] text-xl"
          />
          <p className="text-[var(--base-color)]">Booking</p>
        </Link>
        <Link className="flex items-center gap-2" to={"/profile"}>
          <FontAwesomeIcon
            icon={faUser}
            className="text-[var(--base-color)] text-xl"
          />
          <p className="text-[var(--base-color)]">Profile</p>
        </Link>
      </div>

      {/* Sub Menu (Phần dưới) */}
      <div className="sub-menu flex flex-col gap-4">
        <Link className="flex items-center gap-2" to={"/setting"}>
          <FontAwesomeIcon
            icon={faGear}
            className="text-[var(--base-color)] text-xl"
          />
          <p className="text-[var(--base-color)]">Setting</p>
        </Link>
        <Link
          className="flex items-center gap-2"
          onClick={() => {
            setOpenLogoutDialog(true);
          }}
        >
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="text-[var(--base-color)] text-xl"
          />
          <p className="text-[var(--base-color)]">Logout</p>
        </Link>
        <ConfirmDialog
          isOpen={openLogoutDialog}
          handleClose={handleCloseLogoutDialog}
          title={"Come back soon!"}
          description={"Are you sure you want to Log out?"}
          callback={handleLogout}
        />
        {onLoading && <LoadingScreen />}{" "}
      </div>
    </motion.div>
  );
}
