import {
  faCalendarCheck,
  faUserClock,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import authApi from "../api/auth.api";
import doctorApi from "../api/doctor.api";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import baseURL from "../api/baseURL.api";
import rateApi from "../api/rate.api";
import { motion } from "framer-motion";
import statisticApi from "../api/statitics.api";

function DashboardDoctor() {
  const navigate = useNavigate();
  const cookie = new Cookies();
  const doctorToken = cookie.get("token");
  const [totalPatients, setTotalPatients] = useState(null);
  const [totalAppointments, setTotalAppointments] = useState(null);
  const [totalAppointmentsToday, setTotalAppointmentsToday] = useState(null);
  const [appointmentToday, setAppointmentToday] = useState(null);
  const [currentAppointments, setCurrentAppointments] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [rate, setRate] = useState(null);
  // Lấy ngày hôm nay và định dạng
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  }).format(today);
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

  // Chart data mẫu (có thể thay bằng API thực tế)
  const [appointmentsByMonth, setAppointmentsByMonth] = useState([]);

  const getTotalPatients = async (id) => {
    try {
      const res = await doctorApi.getTotalPatients(id);
      setTotalPatients(res.total_patients);
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalAppointmentsToday = async (id) => {
    try {
      const res = await doctorApi.getTotalAppointmentsToday(id);
      setTotalAppointmentsToday(res.total_appointments_today);
    } catch (err) {
      console.log(err);
    }
  };

  const getRate = async (id) => {
    try {
      const res = await rateApi.getByDoctorId(id);
      console.log(res);
      setRate(res.rates);
      console.log(res.rates);
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalAppoiments = async (id) => {
    try {
      const res = await doctorApi.getTotalAppointments(id);
      setTotalAppointments(res.total_appointments);
    } catch (err) {
      console.log(err);
    }
  };

  const getAppointmentsToday = async (id) => {
    try {
      const res = await doctorApi.getAppointmentsToday(id);
      console.log(res);
      setAppointmentToday(res.appointments);
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
        await getTotalPatients(res.doctor.doctor_id);
        await getTotalAppointmentsToday(res.doctor.doctor_id);
        await getTotalAppoiments(res.doctor.doctor_id);
        await getAppointmentsToday(res.doctor.doctor_id);
        await getRate(res.doctor.doctor_id);
        await getStatistic(res.doctor.doctor_id);
        // TODO: Gọi API lấy appointmentsByMonth nếu có
      } else {
        navigate("/for-doctor/login");
      }
    } catch (err) {
      navigate("/for-doctor/login");
    }
  };

  const getStatistic = async (id) => {
    try {
      const result = await statisticApi.getByDoctorAndYear(id);
      console.log(result.statistics);
      const list = Array.from(result.statistics).map((item) => {
        console.log(item);
        return item.total;
      });
      setAppointmentsByMonth(list);
    } catch (err) {
      console.log(err);
    }
  };

  // Hàm giả lập để lấy thông báo (cần thay thế bằng API thực tế)
  const fetchNotifications = () => {
    const dummyNotifications = [
      {
        title: "New patient registered",
        content: "You have a new patient registered today.",
        time: "10 minutes ago",
      },
      {
        title: "Appointment reminder",
        content: "Don't forget your appointment with Dr. Smith at 3 PM.",
        time: "2 hours ago",
      },
    ];
    setNotifications(dummyNotifications);
  };

  useEffect(() => {
    getDoctorByToken(doctorToken);
    fetchNotifications();
  }, []);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div>
      {/* Header */}
      <div className="fixed top-0 left-[300px] right-0 py-5 px-10 font-bold text-[32px] text-[var(--base-color)] text-left shadow-2xl bg-gradient-to-r from-white via-blue-50 to-blue-100 z-[2] flex items-center gap-4">
        Dashboard
      </div>
      <div className="mt-[100px] ml-[300px] py-10 px-[50px] w-[calc(100vw-300px)] min-h-[calc(100vh-100px)] bg-gradient-to-br from-white via-blue-50 to-blue-100">
        {/* Top Stats */}
        <motion.div
          className="w-full flex justify-between gap-8 mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {/* Total Patients */}
          <motion.div
            className="flex-1 flex items-center gap-5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg p-6 border border-blue-200"
            variants={fadeUp}
            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #60a5fa55" }}
          >
            <div className="flex items-center justify-center w-[80px] h-[80px] rounded-full bg-white shadow border-4 border-blue-300">
              <FontAwesomeIcon
                icon={faUserClock}
                className="text-[32px] text-blue-500"
              />
            </div>
            <div>
              <div className="text-[18px] font-semibold text-blue-700">
                Total Patients
              </div>
              <div className="text-[32px] font-extrabold text-[var(--base-color)]">
                {totalPatients ?? 0}
              </div>
              <div className="text-[14px] text-gray-500">Till Today</div>
            </div>
          </motion.div>
          {/* Today's Appointments */}
          <motion.div
            className="flex-1 flex items-center gap-5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg p-6 border border-blue-200"
            variants={fadeUp}
            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #60a5fa55" }}
          >
            <div className="flex items-center justify-center w-[80px] h-[80px] rounded-full bg-white shadow border-4 border-blue-300">
              <FontAwesomeIcon
                icon={faUsers}
                className="text-[32px] text-blue-500"
              />
            </div>
            <div>
              <div className="text-[18px] font-semibold text-blue-700">
                Appointments Today
              </div>
              <div className="text-[32px] font-extrabold text-[var(--base-color)]">
                {totalAppointmentsToday ?? 0}
              </div>
              <div className="text-[14px] text-gray-500">{formattedDate}</div>
            </div>
          </motion.div>
          {/* Total Appointments */}
          <motion.div
            className="flex-1 flex items-center gap-5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl shadow-lg p-6 border border-blue-200"
            variants={fadeUp}
            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #60a5fa55" }}
          >
            <div className="flex items-center justify-center w-[80px] h-[80px] rounded-full bg-white shadow border-4 border-blue-300">
              <FontAwesomeIcon
                icon={faCalendarCheck}
                className="text-[32px] text-blue-500"
              />
            </div>
            <div>
              <div className="text-[18px] font-semibold text-blue-700">
                Total Appointments
              </div>
              <div className="text-[32px] font-extrabold text-[var(--base-color)]">
                {totalAppointments ?? 0}
              </div>
              <div className="text-[14px] text-gray-500">{formattedDate}</div>
            </div>
          </motion.div>
        </motion.div>
        {/* Chart & Rates */}
        <motion.div
          className="w-full flex gap-8 mb-10"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {/* Chart */}
          <motion.div
            className="w-1/2 bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col"
            variants={fadeUp}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px #60a5fa33" }}
          >
            <div className="font-bold text-[var(--base-color)] text-lg mb-4">
              Appointments in 12 Months
            </div>
            <BarChart
              xAxis={[
                {
                  id: "months",
                  data: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  scaleType: "band",
                  label: "Month",
                },
              ]}
              yAxis={[{ label: "Appointments" }]}
              series={[
                {
                  data: appointmentsByMonth,
                  label: "Appointments",
                  color: "var(--base-color)",
                },
              ]}
              className="w-full"
              height={320}
            />
          </motion.div>
          {/* Rates & Review */}
          <motion.div
            className="w-1/2 bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col"
            variants={fadeUp}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px #60a5fa33" }}
          >
            <div className="font-bold text-[var(--base-color)] text-lg mb-4">
              Rates & Review
            </div>
            <div className="overflow-y-auto h-[320px] pr-2">
              {rate && rate.length > 0 ? (
                rate.map((item, idx) => (
                  <div
                    key={idx}
                    className="mb-4 pb-2 flex items-start gap-4 border-b border-blue-50"
                  >
                    <img
                      src={
                        item.avatar
                          ? baseURL + item.avatar
                          : "/default-avatar.png"
                      }
                      alt="avatar"
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[var(--base-color)]">
                          {item.fullname}
                        </span>
                      </div>
                      <div className="text-yellow-500 text-base text-left">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < item.star_no ? "★" : "☆"}</span>
                        ))}
                      </div>
                      <div className="text-gray-500 text-xs mt-1 text-left">
                        {item.date
                          ? new Date(item.date).toLocaleDateString("vi-VN")
                          : ""}
                      </div>
                      <div className="text-gray-700 text-sm mt-1 text-left">
                        {item.comments}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No rates & reviews.</div>
              )}
            </div>
          </motion.div>
        </motion.div>
        {/* Today's Appointments & Detail Patient */}
        <motion.div
          className="w-full flex gap-8"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          {/* Today's Appointments */}
          <motion.div
            className="w-1/2 h-[400px] overflow-y-auto bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-lg border border-blue-100 p-8"
            variants={fadeUp}
            whileHover={{ scale: 1.01, boxShadow: "0 8px 32px #60a5fa22" }}
          >
            <div className="font-bold text-[var(--base-color)] text-lg mb-4">
              Today Appointments
            </div>
            {appointmentToday && appointmentToday.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="pb-2 w-1/4 border-b border-blue-100">
                      Patient
                    </th>
                    <th className="pb-2 w-2/4 border-b border-blue-100">
                      Name
                    </th>
                    <th className="pb-2 w-1/4 border-b border-blue-100">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentToday.map((item, idx) => (
                    <tr
                      key={item.id || idx}
                      className="align-top cursor-pointer hover:bg-blue-50 transition"
                      onClick={() => {
                        setCurrentAppointments(item);
                      }}
                    >
                      <td className="py-3">
                        <img
                          src={baseURL + item.avatar || "/default-avatar.png"}
                          alt="avatar"
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow"
                        />
                      </td>
                      <td className="py-3">
                        <div className="font-bold text-[var(--base-color)]">
                          {item.fullname}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {item.phone_no}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="font-semibold p-2 text-center bg-gradient-to-r from-green-400 to-green-600 text-[12px] rounded-md text-white shadow">
                          {item.times}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-gray-500 text-center mt-10">
                No appointments today.
              </div>
            )}
          </motion.div>
          {/* Detail Patient */}
          <motion.div
            className="w-1/2 h-[400px] bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-lg border border-blue-100 p-8 flex flex-col items-center justify-center transition-all duration-300"
            variants={fadeUp}
            whileHover={{ scale: 1.01, boxShadow: "0 8px 32px #60a5fa22" }}
          >
            {currentAppointments ? (
              <div className="w-full flex flex-col items-center">
                {/* Avatar & Name */}
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={
                      baseURL + currentAppointments.avatar ||
                      "/default-avatar.png"
                    }
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[var(--base-color)] shadow mb-2"
                  />
                  <div className="font-bold text-[var(--base-color)] text-2xl mb-1">
                    {currentAppointments.fullname}
                  </div>
                  <div className="text-gray-500 text-base italic">
                    {currentAppointments.gender === "male"
                      ? "Male"
                      : currentAppointments.gender === "female"
                      ? "Female"
                      : ""}
                  </div>
                </div>
                {/* Appointment Info */}
                <div className="w-full flex gap-6 mb-4">
                  <div className="flex-1 flex flex-col items-center bg-white rounded-lg p-3 shadow border border-blue-100">
                    <span className="font-semibold text-gray-700">D.O.B</span>
                    <span className="text-gray-800">
                      {currentAppointments.dob
                        ? new Date(currentAppointments.dob).toLocaleDateString(
                            "vi-VN"
                          )
                        : ""}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center bg-white rounded-lg p-3 shadow border border-blue-100">
                    <span className="font-semibold text-gray-700">Weight</span>
                    <span className="text-gray-800">
                      {currentAppointments.weight}kg
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center bg-white rounded-lg p-3 shadow border border-blue-100">
                    <span className="font-semibold text-gray-700">Height</span>
                    <span className="text-gray-800">
                      {currentAppointments.height}cm
                    </span>
                  </div>
                </div>
                <div className="w-full flex gap-6 mb-4">
                  <div className="flex-1 flex flex-col items-center bg-white rounded-lg p-3 shadow border border-blue-100">
                    <span className="font-semibold text-gray-700">Date</span>
                    <span className="text-gray-800">
                      {currentAppointments.date
                        ? new Date(currentAppointments.date).toLocaleDateString(
                            "vi-VN"
                          )
                        : ""}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center bg-white rounded-lg p-3 shadow border border-blue-100">
                    <span className="font-semibold text-gray-700">Sex</span>
                    <span className="text-gray-800">
                      {currentAppointments.gender}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center bg-white rounded-lg p-3 shadow border border-blue-100">
                    <span className="font-semibold text-gray-700">Time</span>
                    <span className="text-gray-800">
                      {currentAppointments.times}
                    </span>
                  </div>
                </div>
                {/* Contact */}
                <div className="flex gap-4 mt-2">
                  <a
                    href={`https://wa.me/84${currentAppointments.phone_no?.replace(
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
                      sx={{ borderRadius: "20px", textTransform: "none" }}
                    >
                      WhatsApp: (+84) {currentAppointments.phone_no}
                    </Button>
                  </a>
                  <a
                    href={`mailto:${currentAppointments.email}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ borderRadius: "20px", textTransform: "none" }}
                    >
                      {currentAppointments.email}
                    </Button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-center text-lg">
                Select an appointment to view details.
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardDoctor;
