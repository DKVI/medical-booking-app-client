import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import "../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion

export default function Header() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

  const slideDownVariants = {
    hidden: { opacity: 0, y: -50 }, // Bắt đầu ở trên và mờ
    visible: { opacity: 1, y: 0 }, // Hiển thị và trượt xuống
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
      transition={{ duration: 0.5 }} // Thời gian hiệu ứng
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
            <div className="cursor-pointer group-hover:bg-gray-100">
              <FontAwesomeIcon
                icon={faUser}
                className="text-[var(--base-color)]"
              />
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
