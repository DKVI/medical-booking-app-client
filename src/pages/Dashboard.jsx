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
    setOnLoading(true);
    setTimeout(() => {
      setOnLoading(false);
    }, 3000);
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
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="m-auto">
        {onLoading && <LoadingScreen />}{" "}
        <div className="flex gap-[50px] p-[25px]">
          <div
            className="p-[12px] shadow-xl cursor-pointer hover:opacity-80 w-[200px] h-[200px] flex text-[var(--base-color)] bg-white rounded-[20px]"
            onClick={() => {
              navigate("/booking");
            }}
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
          </div>
          <div className="p-[12px] shadow-xl cursor-pointer hover:opacity-80 w-[200px] h-[200px] flex text-[var(--base-color)] bg-white rounded-[20px]">
            <div className="m-auto">
              <div>
                <FontAwesomeIcon
                  className="text-[40px] py-5"
                  icon={faUserDoctor}
                />
              </div>
              <div>Find Doctor</div>
            </div>
          </div>
          <div className="p-[12px] shadow-xl cursor-pointer hover:opacity-80 w-[200px] h-[200px] flex text-[var(--base-color)] bg-white rounded-[20px]">
            <div className="m-auto">
              <div>
                <FontAwesomeIcon
                  className="text-[40px] py-5"
                  icon={faClockRotateLeft}
                />
              </div>
              <div>History</div>
            </div>
          </div>
        </div>
        <div className="flex gap-[50px] p-[25px]">
          <div className="p-[12px] shadow-xl cursor-pointer hover:opacity-80 w-[200px] h-[200px] flex text-[var(--base-color)] bg-white rounded-[20px]">
            <div className="m-auto">
              <div>
                <FontAwesomeIcon
                  className="text-[40px] py-5"
                  icon={faNotesMedical}
                />
              </div>
              <div>Medical Note</div>
            </div>
          </div>
          <div className="p-[12px] shadow-xl cursor-pointer hover:opacity-80 w-[200px] h-[200px] flex text-[var(--base-color)] bg-white rounded-[20px]"></div>
          <div className="p-[12px] shadow-xl cursor-pointer hover:opacity-80 w-[200px] h-[200px] flex text-[var(--base-color)] bg-white rounded-[20px]">
            <div className="m-auto">
              <div>
                <FontAwesomeIcon className="text-[40px] py-5" icon={faUser} />
              </div>
              <div>Profile</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
