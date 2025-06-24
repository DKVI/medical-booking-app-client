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
import { Link, useNavigate, useLocation } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";
import Cookies from "universal-cookie";
import LoadingScreen from "./LoadingScreen";
import { motion } from "framer-motion";

export default function SideBar() {
  const cookies = new Cookies();
  const navigate = new useNavigate();
  const location = useLocation();
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
      className={`shadow-2xl flex flex-col justify-between transition-all duration-300
      ${onHover ? "w-[220px]" : "w-[64px]"}
       rounded-br-3xl
      bg-gradient-to-b from-blue-50 via-white to-blue-100
      border-r-4 border-blue-200
      `}
      style={{
        position: "fixed",
        top: "80px",
        bottom: "0",
        left: "0",
        overflow: "hidden",
        zIndex: 50,
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
      }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      {/* Main Menu */}
      <div className="main-menu flex flex-col gap-4 mt-4">
        <Link
          className={`flex items-center gap-3 group px-3 py-2 rounded-xl transition
            ${
              location.pathname === "/dashboard"
                ? "bg-blue-200 font-bold shadow text-blue-600"
                : "hover:bg-blue-100"
            }
          `}
          to={"/dashboard"}
          onClick={() => setOnHover(false)} // Thu lại sidebar khi click
        >
          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={faChartSimple}
              className="text-blue-500 text-2xl group-hover:scale-110 transition"
            />
          </div>
          <p
            className={`transition-opacity duration-300 ${
              onHover ? "opacity-100" : "opacity-0"
            }`}
          >
            Dashboard
          </p>
        </Link>
        <Link
          className={`flex items-center gap-3 group px-3 py-2 rounded-xl transition
            ${
              location.pathname === "/booking-type"
                ? "bg-blue-200 text-blue-600 font-bold shadow"
                : "hover:bg-blue-100"
            }
          `}
          to={"/booking-type"}
          onClick={() => setOnHover(false)} // Thu lại sidebar khi click
        >
          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={faCalendarDays}
              className="text-blue-500 text-2xl group-hover:scale-110 transition"
            />
          </div>
          <p
            className={`transition-opacity duration-300 ${
              onHover ? "opacity-100" : "opacity-0"
            }`}
          >
            Booking Type
          </p>
        </Link>
        <Link
          className={`flex items-center gap-3 group px-3 py-2 rounded-xl transition
            ${
              location.pathname === "/profile"
                ? "bg-blue-200 text-blue-600 font-bold shadow"
                : "hover:bg-blue-100"
            }
          `}
          to={"/profile"}
          onClick={() => setOnHover(false)} // Thu lại sidebar khi click
        >
          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={faUser}
              className="text-blue-500 text-2xl group-hover:scale-110 transition"
            />
          </div>
          <p
            className={`transition-opacity duration-300 ${
              onHover ? "opacity-100" : "opacity-0"
            }`}
          >
            Profile
          </p>
        </Link>
      </div>

      {/* Sub Menu */}
      <div className="sub-menu flex flex-col gap-4 mb-6">
        <Link
          className={`flex items-center gap-3 group px-3 py-2 rounded-xl transition
            ${
              location.pathname === "/setting"
                ? "bg-blue-200 text-blue-600 font-bold shadow"
                : "hover:bg-blue-100"
            }
          `}
          to={"/setting"}
          onClick={() => setOnHover(false)} // Thu lại sidebar khi click
        >
          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={faGear}
              className="text-blue-500 text-2xl group-hover:rotate-12 group-hover:scale-110 transition"
            />
          </div>
          <p
            className={`transition-opacity duration-300 ${
              onHover ? "opacity-100" : "opacity-0"
            }`}
          >
            Setting
          </p>
        </Link>
        <div
          className="flex items-center gap-3 group px-3 py-2 rounded-xl hover:bg-red-100 transition"
          onClick={() => setOpenLogoutDialog(true)}
        >
          <div className="icon-wrapper">
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="text-red-500 text-2xl group-hover:scale-110 transition"
            />
          </div>
          <p
            className={`text-red-700 font-semibold transition-opacity duration-300 ${
              onHover ? "opacity-100" : "opacity-0"
            }`}
          >
            Logout
          </p>
        </div>
        <ConfirmDialog
          isOpen={openLogoutDialog}
          handleClose={handleCloseLogoutDialog}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FontAwesomeIcon
                icon={faRightFromBracket}
                style={{ color: "#e53935", fontSize: 24 }}
              />
              <span
                style={{
                  color: "#1976d2",
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                Come back soon!
              </span>
            </div>
          }
          description={
            <div
              style={{
                color: "#1976d2",
                fontWeight: 500,
                fontSize: 16,
              }}
            >
              Are you sure you want to Log out?
            </div>
          }
          callback={handleLogout}
          dialogProps={{
            PaperProps: {
              sx: {
                borderRadius: 4,
                background: "linear-gradient(120deg, #e3f0ff 0%, #f7fbff 100%)",
                boxShadow: "0 8px 32px 0 rgba(33,150,243,0.15)",
                border: "2px solid #90caf9",
                minWidth: 340,
                textAlign: "center",
                p: 2,
              },
            },
          }}
          actionsProps={{
            sx: { justifyContent: "center", pb: 2 },
          }}
          cancelText="No"
          confirmText="Yes"
          cancelButtonProps={{
            sx: {
              background: "linear-gradient(90deg, #e57373 60%, #e53935 100%)",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "8px",
              px: 4,
              "&:hover": {
                background: "linear-gradient(90deg, #e53935 60%, #e57373 100%)",
              },
            },
          }}
          confirmButtonProps={{
            sx: {
              background: "linear-gradient(90deg, #43e97b 60%, #38f9d7 100%)",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "8px",
              px: 4,
              "&:hover": {
                background: "linear-gradient(90deg, #38f9d7 60%, #43e97b 100%)",
              },
            },
          }}
        />
        {onLoading && <LoadingScreen />}
      </div>
    </motion.div>
  );
}
