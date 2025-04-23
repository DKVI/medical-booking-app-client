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
  return (
    <div
      className="w-[200px] shadow-2xl p-5 flex flex-col justify-between"
      style={{
        position: "fixed",
        top: "80px",
        bottom: "0",
        left: "0",
      }}
    >
      {/* Main Menu (Phần trên) */}
      <div className="main-menu flex flex-col gap-4">
        <Link className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faChartSimple}
            className="text-[var(--base-color)] text-xl"
          />
          <p className="text-[var(--base-color)]">Dashboard</p>
        </Link>
        <Link className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faCalendarDays}
            className="text-[var(--base-color)] text-xl"
          />
          <p className="text-[var(--base-color)]">Booking</p>
        </Link>
        <Link className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faUser}
            className="text-[var(--base-color)] text-xl"
          />
          <p className="text-[var(--base-color)]">Profile</p>
        </Link>
      </div>

      {/* Sub Menu (Phần dưới) */}
      <div className="sub-menu flex flex-col gap-4">
        <Link className="flex items-center gap-2">
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
    </div>
  );
}
