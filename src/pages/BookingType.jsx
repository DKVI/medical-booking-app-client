import React, { useEffect, useState } from "react";
import authApi from "../api/auth.api";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 40 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.15 * i,
      duration: 0.6,
      type: "spring",
      bounce: 0.35,
    },
  }),
};

function BookingType() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const getUser = async (token) => {
    try {
      const res = await authApi.getByToken(token);
      setUser(res.user);
    } catch (error) {
      navigate("/account");
    }
  };

  const verifyUser = async (token) => {
    const res = await authApi.verify(token);
    if (!res.success) {
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
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center justify-center">
      <motion.div
        className="w-full max-w-4xl mx-auto mt-[100px] px-4 py-10"
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.35 }}
      >
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-bold text-[var(--base-color)] mb-2 tracking-wide">
            Choose Booking Type
          </h1>
          <div className="h-[3px] w-24 bg-gradient-to-r from-blue-400  via-blue-200 to-blue-400 rounded-full mt-2"></div>
        </div>
        <div className="flex flex-col md:flex-row gap-14 justify-center items-center">
          {/* FIND FACILITY */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              scale: 0.97,
              background:
                "linear-gradient(120deg, oklch(0.882 0.059 254.128) 60%, #dbeafe 100%)", // bg xanh nhạt hơn
              color: "#fff",
              boxShadow: "0 8px 32px rgba(80,112,255,0.12)",
            }}
            className="cursor-pointer bg-white border-2 border-blue-200 shadow-xl w-[260px] h-[410px] px-4 py-10 rounded-[28px] flex flex-col justify-between items-center transition-all duration-300 hover:text-white group"
            onClick={() => navigate("/booking")}
          >
            <h2 className="text-[var(--base-color)] font-bold text-xl mb-4 group-hover:text-white transition-all duration-300">
              FIND FACILITY
            </h2>
            <div
              className="flex h-[200px] w-full mb-4 rounded-xl bg-cover bg-center transition-all duration-300"
              style={{
                backgroundImage: "url(/vector-hospital.png)",
              }}
            ></div>
            <div className="description text-[15px] text-gray-600 group-hover:text-white text-center transition-all duration-300">
              Easily schedule appointments through partnered hospitals. Browse
              departments and choose the right specialist for your needs.
            </div>
          </motion.div>
          {/* FIND DOCTOR */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              scale: 0.97,
              background:
                "linear-gradient(120deg, oklch(0.882 0.059 254.128) 60%, #dbeafe 100%)", // bg xanh nhạt hơn
              color: "#fff",
              boxShadow: "0 8px 32px rgba(80,112,255,0.12)",
            }}
            className="cursor-pointer bg-white border-2 border-blue-200 shadow-xl w-[260px] h-[410px] px-4 py-10 rounded-[28px] flex flex-col justify-between items-center transition-all duration-300 hover:text-white group"
            onClick={() => navigate("/doctor")}
          >
            <h2 className="text-[var(--base-color)] font-bold text-xl mb-4 group-hover:text-white transition-all duration-300">
              FIND DOCTOR
            </h2>
            <div
              className="flex h-[200px] w-full mb-4 rounded-xl bg-cover bg-center transition-all duration-300"
              style={{
                backgroundImage: "url(/vector-doctor.png)",
              }}
            ></div>
            <div className="description text-[15px] text-gray-600 group-hover:text-white text-center transition-all duration-300">
              Connect with your preferred doctor and book an appointment
              instantly. Personalized care at your convenience.
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default BookingType;
