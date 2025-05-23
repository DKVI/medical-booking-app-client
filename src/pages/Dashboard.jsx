import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import authApi from "../api/auth.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faClockRotateLeft,
  faGear,
  faNotesMedical,
  faUser,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import LoadingScreen from "../components/LoadingScreen";
import { motion } from "framer-motion";
import CalendarBlock from "../components/CalendarBlock";
import DigitalClock from "../components/DigitalClock";

const zoomInVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.7,
      type: "spring",
      bounce: 0.45,
    },
  },
};

function Dashboard() {
  const [onLoading, setOnLoading] = useState(false);
  const cookies = new Cookies();
  const navigate = useNavigate();

  const verifyUser = async (token) => {
    const res = await authApi.verify(token);
    if (!res.success) {
      navigate("/account");
    }
  };

  useEffect(() => {
    const token = cookies.get("token");
    if (!token) {
      navigate("/account");
    }
    verifyUser(token);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      <div className="dashboard-container ml-0 mt-0 w-full min-h-screen flex flex-col items-center justify-start pt-[60px]">
        <div className="w-full max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col items-center gap-10">
            {onLoading && <LoadingScreen />}
            {/* Header */}
            <div className="w-full flex flex-col items-center mb-8">
              <div className="h-[3px] w-24 bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 rounded-full mt-2"></div>
            </div>
            {/* Main blocks in grid */}
            <div className="w-full flex flex-col md:flex-row gap-10 justify-between">
              {/* 6 blocks: 2 rows, 3 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full md:w-2/3">
                {/* 6 motion.div blocks giữ nguyên */}
                <motion.div
                  className="p-[18px] shadow-2xl cursor-pointer hover:scale-105 hover:bg-[var(--base-color)] hover:text-white w-[220px] h-[220px] flex flex-col items-center justify-center text-[var(--base-color)] bg-white rounded-[24px] transition-all duration-300 border-2 border-blue-200"
                  onClick={() => navigate("/booking")}
                  initial="hidden"
                  animate="visible"
                  variants={zoomInVariants}
                  transition={{ delay: 0.1 }}
                >
                  <FontAwesomeIcon
                    className="text-[48px] mb-4"
                    icon={faCalendarDays}
                  />
                  <div className="font-bold text-lg">Booking</div>
                </motion.div>
                <motion.div
                  onClick={() => navigate("/doctor")}
                  className="p-[18px] shadow-2xl cursor-pointer hover:scale-105 hover:bg-[var(--base-color)] hover:text-white w-[220px] h-[220px] flex flex-col items-center justify-center text-[var(--base-color)] bg-white rounded-[24px] transition-all duration-300 border-2 border-blue-200"
                  initial="hidden"
                  animate="visible"
                  variants={zoomInVariants}
                  transition={{ delay: 0.2 }}
                >
                  <FontAwesomeIcon
                    className="text-[48px] mb-4"
                    icon={faUserDoctor}
                  />
                  <div className="font-bold text-lg">Find Doctor</div>
                </motion.div>
                <motion.div
                  className="p-[18px] shadow-2xl cursor-pointer hover:scale-105 hover:bg-[var(--base-color)] hover:text-white w-[220px] h-[220px] flex flex-col items-center justify-center text-[var(--base-color)] bg-white rounded-[24px] transition-all duration-300 border-2 border-blue-200"
                  onClick={() => navigate("/history")}
                  initial="hidden"
                  animate="visible"
                  variants={zoomInVariants}
                  transition={{ delay: 0.3 }}
                >
                  <FontAwesomeIcon
                    className="text-[48px] mb-4"
                    icon={faClockRotateLeft}
                  />
                  <div className="font-bold text-lg">History Purchase</div>
                </motion.div>
                <motion.div
                  className="p-[18px] shadow-2xl cursor-pointer hover:scale-105 hover:bg-[var(--base-color)] hover:text-white w-[220px] h-[220px] flex flex-col items-center justify-center text-[var(--base-color)] bg-white rounded-[24px] transition-all duration-300 border-2 border-blue-200"
                  onClick={() => navigate("/appointments")}
                  initial="hidden"
                  animate="visible"
                  variants={zoomInVariants}
                  transition={{ delay: 0.4 }}
                >
                  <FontAwesomeIcon
                    className="text-[48px] mb-4"
                    icon={faNotesMedical}
                  />
                  <div className="font-bold text-lg">Appointments</div>
                </motion.div>
                <motion.div
                  className="p-[18px] shadow-2xl cursor-pointer hover:scale-105 hover:bg-[var(--base-color)] hover:text-white w-[220px] h-[220px] flex flex-col items-center justify-center text-[var(--base-color)] bg-white rounded-[24px] transition-all duration-300 border-2 border-blue-200"
                  onClick={() => navigate("/profile")}
                  initial="hidden"
                  animate="visible"
                  variants={zoomInVariants}
                  transition={{ delay: 0.5 }}
                >
                  <FontAwesomeIcon className="text-[48px] mb-4" icon={faUser} />
                  <div className="font-bold text-lg">Profile</div>
                </motion.div>
                <motion.div
                  className="p-[18px] shadow-2xl cursor-pointer hover:scale-105 hover:bg-[var(--base-color)] hover:text-white w-[220px] h-[220px] flex flex-col items-center justify-center text-[var(--base-color)] bg-white rounded-[24px] transition-all duration-300 border-2 border-blue-200"
                  onClick={() => navigate("/setting")}
                  initial="hidden"
                  animate="visible"
                  variants={zoomInVariants}
                  transition={{ delay: 0.6 }}
                >
                  <FontAwesomeIcon className="text-[48px] mb-4" icon={faGear} />
                  <div className="font-bold text-lg">Setting</div>
                </motion.div>
              </div>
              {/* Calendar & Clock: xếp dọc */}
              <div className="flex flex-col gap-8 w-full md:w-1/3 mt-8 md:mt-0">
                <motion.div
                  className="calendar-container border-2 border-blue-200 rounded-[24px] p-[25px] shadow-xl bg-white overflow-hidden w-full"
                  initial="hidden"
                  animate="visible"
                  variants={zoomInVariants}
                  transition={{ delay: 0.7 }}
                >
                  <CalendarBlock />
                </motion.div>
                <motion.div
                  className="time-container border-2 border-blue-200 rounded-[24px] p-[25px] shadow-xl bg-white overflow-hidden w-full flex flex-col items-center justify-center"
                  initial="hidden"
                  animate="visible"
                  variants={zoomInVariants}
                  transition={{ delay: 0.8 }}
                >
                  <DigitalClock />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
