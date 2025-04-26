import React, { useEffect, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import Cookies from "universal-cookie";
import authApi from "../api/auth.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faClockRotateLeft,
  faNotesMedical,
  faUser,
  faUserDoctor,
} from "@fortawesome/free-solid-svg-icons";
import LoadingScreen from "../components/LoadingScreen";
import { motion } from "framer-motion";

const zoomInVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

function Dashboard() {
  const [onLoading, setOnLoading] = useState(false);
  const cookies = new Cookies();
  const navigate = new useNavigate();
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
  }, []);
  return (
    <div
      className="dashboard-container ml-[200px] mt-[80px] w-[calc(100vw-200px)] h-[calc(100vh-80px)] flex"
      style={{
        backgroundImage: "url(/3-banner.gif)",
        // backgroundColor: "var(--base-color)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="m-auto">
        {onLoading && <LoadingScreen />}
        <div className="flex gap-[50px] p-[25px]">
          {/* Block 1: Booking */}
          <motion.div
            className="p-[12px] shadow-xl cursor-pointer hover:opacity-80 w-[200px] h-[200px] flex text-[var(--base-color)] bg-white rounded-[20px]"
            onClick={() => navigate("/booking")}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            variants={zoomInVariants}
          >
            <div className="m-auto">
              <div>
                <FontAwesomeIcon
                  className="text-[40px] py-5"
                  icon={faCalendarDays}
                />
              </div>
              <div>Booking</div>
            </div>
          </motion.div>

          {/* Block 2: Find Doctor */}
          <motion.div
            onClick={() => navigate("/doctor")}
            className="p-[12px] shadow-xl cursor-pointer hover:opacity-80 w-[200px] h-[200px] flex text-[var(--base-color)] bg-white rounded-[20px]"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={zoomInVariants}
          >
            <div className="m-auto">
              <div>
                <FontAwesomeIcon
                  className="text-[40px] py-5"
                  icon={faUserDoctor}
                />
              </div>
              <div>Find Doctor</div>
            </div>
          </motion.div>

          {/* Block 3: History */}
          <motion.div
            className="p-[12px] shadow-xl cursor-pointer hover:opacity-80 w-[200px] h-[200px] flex text-[var(--base-color)] bg-white rounded-[20px]"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.3 }}
            variants={zoomInVariants}
          >
            <div className="m-auto">
              <div>
                <FontAwesomeIcon
                  className="text-[40px] py-5"
                  icon={faClockRotateLeft}
                />
              </div>
              <div>History</div>
            </div>
          </motion.div>
        </div>
        <div className="flex gap-[50px] p-[25px]">
          {/* Block 4: Medical Note */}
          <motion.div
            className="p-[12px] shadow-xl cursor-pointer hover:opacity-80 w-[200px] h-[200px] flex text-[var(--base-color)] bg-white rounded-[20px]"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
            variants={zoomInVariants}
          >
            <div className="m-auto">
              <div>
                <FontAwesomeIcon
                  className="text-[40px] py-5"
                  icon={faNotesMedical}
                />
              </div>
              <div>Medical Note</div>
            </div>
          </motion.div>

          {/* Block 5: Empty Block */}
          <motion.div
            className="p-[12px] shadow-xl cursor-pointer hover:opacity-80 w-[200px] h-[200px] flex text-[var(--base-color)] bg-white rounded-[20px]"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.5 }}
            variants={zoomInVariants}
          ></motion.div>

          {/* Block 6: Profile */}
          <motion.div
            className="p-[12px] shadow-xl cursor-pointer hover:opacity-80 w-[200px] h-[200px] flex text-[var(--base-color)] bg-white rounded-[20px]"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.6 }}
            variants={zoomInVariants}
          >
            <div className="m-auto">
              <div>
                <FontAwesomeIcon className="text-[40px] py-5" icon={faUser} />
              </div>
              <div>Profile</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
