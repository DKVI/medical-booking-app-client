import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faChartSimple,
  faGear,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import authApi from "../api/auth.api";
import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material"; // Import CircularProgress và các component Dialog từ MUI
import LoadingScreen from "./LoadingScreen";
import baseURL from "../api/baseURL.api";

export default function Header() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false); // State để hiển thị menu người dùng
  const [user, setUser] = useState("");
  const [loadingAvatar, setLoadingAvatar] = useState(true); // State để kiểm tra trạng thái loading avatar
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false); // State để kiểm soát Dialog Logout
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    if (token) {
      getUser(token);
    } else {
      setIsLogin(false);
    }
  }, []);

  const getUser = async (token) => {
    try {
      const res = await authApi.getByToken(token);
      setUser(res.user); // Lưu thông tin người dùng vào state
      setIsLogin(true);
      setLoadingAvatar(false); // Tắt trạng thái loading sau khi fetch xong
    } catch (err) {
      console.error("Failed to fetch user information:", err);
      navigate("/account"); // Điều hướng về trang đăng nhập nếu có lỗi
    }
  };

  const handleLogout = () => {
    setLogoutDialogOpen(true); // Mở Dialog xác nhận Logout
  };

  const confirmLogout = () => {
    setLoading(true);
    const cookies = new Cookies();
    cookies.remove("token"); // Xóa token
    setLogoutDialogOpen(false); // Đóng Dialog
    setTimeout(() => {
      setLoading(false);
      navigate("/account");
    }, 1000);
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false); // Đóng Dialog
  };

  const slideDownVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="flex w-full h-[80px] lg:fixed absolute py-2 px-2 lg:py-3 lg:px-10
      bg-gradient-to-r from-blue-200 via-blue-150 to-blue-100
      "
      style={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        color: "#fff",
        justifyContent: "space-between",
      }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
      variants={slideDownVariants}
    >
      {loading && <LoadingScreen />}
      <div className="h-full">
        <img
          src="/icon.png"
          className="h-full"
          style={{
            filter: "drop-shadow(0px 4px 6px white)",
            cursor: "pointer",
          }}
          onClick={() => {
            navigate("/dashboard");
          }}
        />
      </div>
      <div className="relative text-[var(--base-color)]">
        {isLogin ? (
          <div className="relative group flex gap-5">
            <div className="cursor-pointer group-hover:bg-gray-100">
              <FontAwesomeIcon
                icon={faBell}
                className="text-[var(--base-color)]"
              />
            </div>
            {/* Icon User */}
            <div
              className="cursor-pointer group-hover:bg-gray-100 relative"
              onMouseEnter={() => setShowUserMenu(true)} // Hiển thị menu khi hover vào icon
              onMouseLeave={() => setShowUserMenu(false)} // Ẩn menu khi rời khỏi icon
            >
              <FontAwesomeIcon
                icon={faUser}
                className="text-[var(--base-color)]"
              />
              {showUserMenu && (
                <div
                  className="absolute right-[-20px] w-[240px] z-50"
                  style={{
                    top: "20px",
                    filter: "drop-shadow(0 8px 32px rgba(33,150,243,0.18))",
                  }}
                  onMouseEnter={() => setShowUserMenu(true)}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <div
                    className="rounded-2xl p-5"
                    style={{
                      background:
                        "linear-gradient(120deg, #e3f0ff 0%, #f7fbff 100%)",
                      border: "2px solid #90caf9",
                      boxShadow: "0 8px 32px 0 rgba(33,150,243,0.18)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <div className="px-3 py-1 flex flex-col items-center">
                      {loadingAvatar ? (
                        <div className="flex justify-center items-center h-[120px]">
                          <CircularProgress color="primary" />
                        </div>
                      ) : (
                        <img
                          src={baseURL + user.avatar}
                          width={90}
                          height={90}
                          className="mb-2 drop-shadow-xl rounded-full border-4 border-white"
                          alt="User Avatar"
                          style={{
                            objectFit: "cover",
                            boxShadow: "0 2px 8px #90caf9aa",
                            cursor: "pointer",
                            transition: "transform 0.2s",
                          }}
                          onClick={() => {
                            setShowUserMenu(false); // Thu lại menu khi click
                            navigate("/profile");
                          }}
                        />
                      )}
                      <p className="text-[var(--base-color)] text-[18px] font-bold mt-2 mb-1">
                        Hi, {user.username}!
                      </p>
                      <div
                        style={{
                          width: "100%",
                          borderBottom: "1px solid #90caf9",
                          margin: "8px 0 12px 0",
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-100 transition"
                        style={{ color: "var(--base-color)", fontWeight: 500 }}
                        onClick={() => {
                          setShowUserMenu(false); // Thu lại menu khi click
                          navigate("/dashboard");
                        }}
                      >
                        <FontAwesomeIcon icon={faChartSimple} />
                        Dashboard
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-100 transition"
                        style={{ color: "var(--base-color)", fontWeight: 500 }}
                        onClick={() => {
                          setShowUserMenu(false); // Thu lại menu khi click
                          navigate("/setting");
                        }}
                      >
                        <FontAwesomeIcon icon={faGear} />
                        Settings
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-100 transition"
                        style={{ color: "#e53935", fontWeight: 500 }}
                        onClick={() => {
                          setShowUserMenu(false); // Thu lại menu khi click
                          handleLogout();
                        }}
                      >
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <a
              href="/account"
              style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, #ccccc)",
              }}
            >
              Login
            </a>{" "}
            |{" "}
            <a
              href="/account"
              style={{
                textShadow: "2px 2px 4px rgba(0, 0, 0, #ccccc)",
              }}
            >
              Sign up
            </a>
          </>
        )}
      </div>

      {/* Dialog Logout */}
      <Dialog open={logoutDialogOpen} onClose={handleCloseLogoutDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutDialog} color="primary">
            No
          </Button>
          <Button onClick={confirmLogout} color="secondary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
}
