import React, { useEffect, useState } from "react";
import authApi from "../api/auth.api";
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const pageVariants = {
  hidden: { opacity: 0, scale: 0.8 }, // Bắt đầu nhỏ và mờ
  visible: { opacity: 1, scale: 1 }, // Hiển thị rõ ràng và kích thước bình thường
};

function BookingType() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const getUser = async (token) => {
    try {
      const res = await authApi.getByToken(token);
      const user = res.user;
      setUser(user);
      console.log(res.user);
    } catch (error) {
      navigate("/account");
    }
  };
  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    if (!token) {
      navigate("/account");
    }
    verifyUser(token);
    getUser(token);
  }, []);

  const verifyUser = async (token) => {
    const res = await authApi.verify(token);
    if (!res.success) {
      navigate("/account");
    }
  };

  return (
    <motion.div
      className="dashboard-container flex"
      style={{
        marginLeft: "200px",
        marginTop: "80px",
        width: "calc(100vw - 200px)",
        padding: "40px",
        height: "calc(100vh - 120px)",
        backgroundColor: "#f4f6f8",
      }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }} // Thời gian hiệu ứng
      variants={pageVariants} // Sử dụng animation variants
    >
      <div className="flex gap-[100px] m-auto">
        {/* FIND FACILITY */}
        <div
          onClick={() => {
            navigate("/booking");
          }}
          className="h-[400px] cursor-pointer bg-[var(--base-color)] shadow-2xl w-[250px] px-3 py-[40px] rounded-3xl flex flex-col justify-between"
        >
          <h2
            className="text-white font-bold"
            style={{
              textShadow: "2px 2px 4px #cccc", // Shadow cho tiêu đề
            }}
          >
            FIND FACILITY
          </h2>
          <div
            className="flex h-[200px]"
            style={{
              backgroundImage: "url(/vector-hospital.png)",
              backgroundPosition: "center",
              backgroundSize: "cover",
              borderRadius: "10px", // Bo góc cho ảnh
            }}
          ></div>
          <div
            className="description text-white text-[12px]"
            style={{
              textShadow: "1px 1px 3px #cccc", // Shadow cho mô tả
            }}
          >
            Easily schedule appointments through partnered hospitals. Browse
            departments and choose the right specialist for your needs.
          </div>
        </div>

        {/* FIND DOCTOR */}
        <div
          onClick={() => {
            navigate("/doctor");
          }}
          className="h-[400px] cursor-pointer bg-[var(--base-color)] shadow-2xl w-[250px] px-3 py-[40px] rounded-3xl flex flex-col justify-between"
        >
          <h2
            className="text-white font-bold"
            style={{
              textShadow: "2px 2px 4px #cccc", // Shadow cho tiêu đề
            }}
          >
            FIND DOCTOR
          </h2>
          <div
            className="flex h-[200px]"
            style={{
              backgroundImage: "url(/vector-doctor.png)",
              backgroundPosition: "center",
              backgroundSize: "cover",
              borderRadius: "10px", // Bo góc cho ảnh
            }}
          ></div>
          <div
            className="description text-white text-[12px]"
            style={{
              textShadow: "1px 1px 3px #cccc", // Shadow cho mô tả
            }}
          >
            Connect with your preferred doctor and book an appointment
            instantly. Personalized care at your convenience.
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default BookingType;
