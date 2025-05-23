import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import doctorApi from "../api/doctor.api";
import { useNavigate } from "react-router-dom";
import authApi from "../api/auth.api";
import baseURL from "../api/baseURL.api";
import { Button, Typography } from "@mui/material";
import prescriptionApi from "../api/prescription.api";
import { motion } from "framer-motion";

// Animation variants
const fadeScale = {
  hidden: { opacity: 0, scale: 0.85, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
};

function Appointments() {
  const [appointment, setAppointment] = useState([]);
  const [doctor, setDoctor] = useState({
    user_id: null,
    doctor_id: null,
    fullname: null,
    username: null,
    email: null,
    phone_no: null,
    identity_no: null,
    gender: null,
    avatar: null,
    facility_name: null,
    specialty_name: null,
  });
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const navigate = useNavigate();

  const getAllAppointments = async (id) => {
    try {
      const res = await doctorApi.getAllAppointments(id);
      setAppointment(res.appointments || []);
      console.log(res.appointments);
    } catch (err) {
      console.log(err);
    }
  };

  const getDoctorByToken = async (doctorToken) => {
    try {
      const res = await authApi.getDoctorByToken(doctorToken);
      if (res.success) {
        setDoctor(res.doctor);
        getAllAppointments(res.doctor.doctor_id);
      } else {
        navigate("/for-doctor/login");
      }
    } catch (err) {
      navigate("/for-doctor/login");
    }
  };

  const cookie = new Cookies();
  const token = cookie.get("token");

  useEffect(() => {
    getDoctorByToken(token);
  }, []);

  // Group appointments by date, with "Today" first
  const groupAppointmentsByDate = (appointments) => {
    if (!appointments || appointments.length === 0) return {};

    const todayStr = new Date().toLocaleDateString("vi-VN");
    const grouped = {};

    appointments.forEach((item) => {
      const dateStr = item.date
        ? new Date(item.date).toLocaleDateString("vi-VN")
        : "";
      if (dateStr === todayStr) {
        if (!grouped["Today"]) grouped["Today"] = [];
        grouped["Today"].push(item);
      } else {
        if (!grouped[dateStr]) grouped[dateStr] = [];
        grouped[dateStr].push(item);
      }
    });

    // Sort dates descending (except Today always first)
    const sortedKeys = [
      "Today",
      ...Object.keys(grouped)
        .filter((k) => k !== "Today")
        .sort((a, b) => {
          const [da, db] = [a, b].map((d) => {
            const [day, month, year] = d.split("/");
            return new Date(`${year}-${month}-${day}`);
          });
          return db - da;
        }),
    ];

    return { grouped, sortedKeys };
  };

  const { grouped, sortedKeys } = groupAppointmentsByDate(appointment);

  return (
    <div>
      {/* Header */}
      <div className="fixed top-0 left-[300px] right-0 py-5 px-10 font-bold text-[32px] text-[var(--base-color)] text-left shadow-2xl bg-gradient-to-r from-white via-blue-50 to-blue-100 z-[10000] flex items-center gap-4">
        Appointments
      </div>
      <div className="mt-[100px] ml-[300px] py-10 px-[50px] w-[calc(100vw-300px)] min-h-[calc(100vh-100px)] bg-gradient-to-br from-white via-blue-50 to-blue-100">
        {sortedKeys && sortedKeys.length > 0 ? (
          sortedKeys.map((dateKey, i) =>
            grouped[dateKey] && grouped[dateKey].length > 0 ? (
              <motion.div
                key={dateKey}
                className="mb-10"
                initial="hidden"
                animate="visible"
                variants={fadeScale}
                transition={{ delay: i * 0.08 }}
              >
                <Typography
                  variant="h5"
                  className="font-bold text-[var(--base-color)] mb-4 text-left"
                >
                  {dateKey}
                </Typography>
                <div className="flex flex-wrap gap-8">
                  {grouped[dateKey].map((item, idx) => {
                    // Kiểm tra expired
                    let isExpired = false;
                    if (item.scheduling_status === "Expired") {
                      isExpired = true;
                    } else if (item.date && item.times) {
                      const appointmentDate = new Date(item.date);
                      const [hour, minute] = item.times.split(":").map(Number);
                      appointmentDate.setHours(hour);
                      appointmentDate.setMinutes(minute);
                      if (appointmentDate < new Date()) isExpired = true;
                    }

                    return (
                      <motion.div
                        key={item.id || idx}
                        className="relative w-[320px] min-w-[270px] bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col items-center cursor-pointer hover:shadow-2xl transition-all duration-300"
                        initial="hidden"
                        animate="visible"
                        variants={fadeScale}
                        transition={{ delay: i * 0.08 + idx * 0.05 }}
                        onClick={() => setCurrentAppointment(item)}
                      >
                        {/* Status badge */}
                        <div className="absolute top-4 right-4">
                          {isExpired ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold shadow bg-orange-50 text-orange-600 border border-orange-400">
                              Expired
                            </span>
                          ) : (
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${
                                item.scheduling_status === "Process"
                                  ? "bg-red-100 text-red-600 border border-red-400"
                                  : "bg-green-100 text-green-600 border border-green-400"
                              }`}
                            >
                              {item.scheduling_status === "Process"
                                ? "In process"
                                : "Done"}
                            </span>
                          )}
                        </div>
                        <img
                          src={
                            item.avatar
                              ? baseURL + item.avatar
                              : "/default-avatar.png"
                          }
                          alt="avatar"
                          className="w-20 h-20 rounded-full object-cover border-4 border-[var(--base-color)] shadow mb-3"
                        />
                        <div className="font-bold text-[var(--base-color)] text-xl mb-1">
                          {item.fullname}
                        </div>
                        <div className="text-gray-500 text-sm mb-1">
                          {item.gender === "male"
                            ? "Male"
                            : item.gender === "female"
                            ? "Female"
                            : ""}
                        </div>
                        <div className="text-gray-600 text-xs mb-1">
                          <span className="font-semibold">Phone:</span>{" "}
                          {item.phone_no}
                        </div>
                        <div className="text-gray-600 text-xs mb-1">
                          <span className="font-semibold">Email:</span>{" "}
                          {item.email}
                        </div>
                        <div className="text-gray-600 text-xs mb-1">
                          <span className="font-semibold">Time:</span>{" "}
                          {item.times}
                        </div>
                        <div className="text-gray-600 text-xs mb-1">
                          <span className="font-semibold">DOB:</span>{" "}
                          {item.dob
                            ? new Date(item.dob).toLocaleDateString("vi-VN")
                            : ""}
                        </div>
                        <div className="flex gap-2 mt-4">
                          <a
                            href={`https://wa.me/84${item.phone_no?.replace(
                              /^0/,
                              ""
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            <Button
                              variant="outlined"
                              color="primary"
                              sx={{
                                borderRadius: "20px",
                                textTransform: "none",
                                fontSize: "12px",
                                px: 2,
                              }}
                            >
                              WhatsApp
                            </Button>
                          </a>
                          <a
                            href={`mailto:${item.email}`}
                            style={{ textDecoration: "none" }}
                          >
                            <Button
                              variant="outlined"
                              color="error"
                              sx={{
                                borderRadius: "20px",
                                textTransform: "none",
                                fontSize: "12px",
                                px: 2,
                              }}
                            >
                              Email
                            </Button>
                          </a>
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                              borderRadius: "20px",
                              textTransform: "none",
                              fontSize: "12px",
                              px: 2,
                              bgcolor: "var(--base-color)",
                              color: "#fff",
                              "&:hover": { bgcolor: "#1e40af" },
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Xử lý chuyển trang hoặc mở chi tiết
                              navigate(
                                `/for-doctor/appointment/detail?id=${item.id}`
                              );
                            }}
                          >
                            Detail
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : null
          )
        ) : (
          <motion.div
            className="text-gray-400 text-center mt-10 text-lg"
            initial="hidden"
            animate="visible"
            variants={fadeScale}
          >
            No appointments found.
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Appointments;
