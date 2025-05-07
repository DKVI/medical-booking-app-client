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
import { CircularProgress } from "@mui/material"; // Import CircularProgress từ MUI

export default function Header() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false); // State để hiển thị menu người dùng
  const [user, setUser] = useState("");
  const [loadingAvatar, setLoadingAvatar] = useState(true); // State để kiểm tra trạng thái loading avatar

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
    const cookies = new Cookies();
    cookies.remove("token");
    navigate("/account");
  };

  const slideDownVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="flex glass-morphism w-full h-[80px] lg:fixed absolute py-2 px-2 lg:py-3 lg:px-10"
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
                  className="absolute right-0 w-[200px] bg-white shadow-lg rounded-lg p-5 z-50"
                  style={{
                    border: "1px solid var(--base-color)",
                  }}
                  onMouseEnter={() => setShowUserMenu(true)} // Giữ menu hiển thị khi hover vào menu
                  onMouseLeave={() => setShowUserMenu(false)} // Ẩn menu khi rời khỏi menu
                >
                  <div className="p-3">
                    {/* Hiển thị loading hoặc avatar */}
                    {loadingAvatar ? (
                      <div className="flex justify-center items-center h-[150px]">
                        <CircularProgress color="primary" />
                      </div>
                    ) : (
                      <img
                        src={user.avatar}
                        width={150}
                        height={150}
                        className="mb-2 drop-shadow-2xl"
                        alt="User Avatar"
                      />
                    )}
                    <div className="flex mb-4">
                      <p className="text-[var(--base-color)] text-[20px] font-bold m-auto">
                        Hi, {user.username}!
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[12px]">
                    <div>
                      <FontAwesomeIcon icon={faChartSimple} />
                      <Link
                        className="w-full text-left text-[var(--base-color)] hover:bg-gray-100 py-2 px-3 text-[14px] rounded"
                        to={"/dashboard"}
                        onClick={() => setShowUserMenu(false)}
                      >
                        Go to Dashboard
                      </Link>
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faGear} />
                      <Link
                        className="w-full text-left text-[var(--base-color)] hover:bg-gray-100 py-2 px-3 text-[14px] rounded"
                        onClick={() => setShowUserMenu(false)}
                        to={"/setting"}
                      >
                        Settings
                      </Link>
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faRightFromBracket} color="red" />
                      <Link
                        className="w-full text-left text-red-500 hover:bg-gray-100 py-2 px-3 text-[14px] rounded"
                        onClick={handleLogout}
                      >
                        Logout
                      </Link>
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
    </motion.div>
  );
}
