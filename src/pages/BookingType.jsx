import React, { useEffect, useState } from "react";
import authApi from "../api/auth.api";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

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
          <h1 className="text-4xl font-extrabold text-[var(--base-color)] mb-2 tracking-wide drop-shadow-lg">
            Choose Booking Type
          </h1>
          <div className="h-[4px] w-32 bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500 rounded-full mt-2 shadow-md"></div>
          <p className="mt-4 text-gray-500 text-lg text-center max-w-xl">
            Select the type of booking you want to make. You can search for a
            medical facility or find a doctor that suits your needs.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-14 justify-center items-center">
          {/* FIND FACILITY */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              scale: 1.03,
              background: "linear-gradient(120deg, #e0e7ff 60%, #dbeafe 100%)",
              color: "#2563eb",
              boxShadow: "0 12px 36px rgba(80,112,255,0.18)",
            }}
            className="cursor-pointer bg-white border-2 border-blue-200 shadow-xl w-[270px] h-[340px] px-6 py-12 rounded-[32px] flex flex-col justify-between items-center transition-all duration-300 hover:text-[var(--base-color)] group relative overflow-hidden"
            onClick={() => navigate("/booking")}
          >
            <div className="flex items-center justify-center h-[180px] w-full mb-4 rounded-xl bg-blue-50">
              <LocalHospitalIcon sx={{ fontSize: 100, color: "#2563eb" }} />
            </div>
            <h2 className="text-[var(--base-color)] font-bold text-2xl mb-4 group-hover:text-[var(--base-color)] transition-all duration-300 drop-shadow">
              FIND FACILITY
            </h2>
            <p className="text-gray-500 text-sm text-center">
              Search for hospitals, clinics, and medical centers near you.
            </p>
          </motion.div>
          {/* FIND DOCTOR */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{
              scale: 1.03,
              background: "linear-gradient(120deg, #e0e7ff 60%, #dbeafe 100%)",
              color: "#2563eb",
              boxShadow: "0 12px 36px rgba(80,112,255,0.18)",
            }}
            className="cursor-pointer bg-white border-2 border-blue-200 shadow-xl w-[270px] h-[340px] px-6 py-12 rounded-[32px] flex flex-col justify-between items-center transition-all duration-300 hover:text-[var(--base-color)] group relative overflow-hidden"
            onClick={() => navigate("/doctor")}
          >
            <div className="flex items-center justify-center h-[180px] w-full mb-4 rounded-xl bg-blue-50">
              <PersonOutlineIcon sx={{ fontSize: 100, color: "#2563eb" }} />
            </div>
            <h2 className="text-[var(--base-color)] font-bold text-2xl mb-4 group-hover:text-[var(--base-color)] transition-all duration-300 drop-shadow">
              FIND DOCTOR
            </h2>
            <p className="text-gray-500 text-sm text-center">
              Find and book appointments with qualified doctors.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default BookingType;
