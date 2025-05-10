import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import doctorApi from "../api/doctor.api";
import specialtyApi from "../api/specialty.api";
import facilityApi from "../api/facility.api";
import rateApi from "../api/rate.api";
import Cookies from "universal-cookie";
import LoadingScreen from "../components/LoadingScreen";
import ultis from "../ultis";
import { Button } from "@mui/material";
import authApi from "../api/auth.api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHospital,
  faLocationDot,
  faPhone,
  faStethoscope,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

// Các biến thể hiệu ứng
const containerVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } },
};

function DoctorDetail() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [specialties, setSpecialties] = useState(null);
  const [facilities, setFacilites] = useState(null);
  const [rates, setRates] = useState([]); // Danh sách đánh giá
  const [user, setUser] = useState(null);
  const verifyUser = async (token) => {
    try {
      const res = await authApi.verify(token);
      if (!res.success) {
        navigate("/account"); // Điều hướng về trang đăng nhập nếu token không hợp lệ
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      navigate("/account"); // Điều hướng về trang đăng nhập nếu có lỗi
    }
  };

  // Hàm lấy thông tin người dùng
  const getUser = async (token) => {
    try {
      const res = await authApi.getByToken(token);
      setUser(res.user); // Lưu thông tin người dùng vào state
      console.log(res.user);
    } catch (err) {
      console.error("Failed to fetch user information:", err);
      navigate("/account"); // Điều hướng về trang đăng nhập nếu có lỗi
    }
  };
  const handleBooking = (doctorId) => {
    localStorage.setItem("doctorId", doctor.id);
    localStorage.setItem("facilityId", facilities?.id || "");
    localStorage.setItem("specialtyId", specialties?.id || "");
    localStorage.setItem("userId", user?.id || "");

    navigate(`/booking?mode=doctor`);
  };

  // Hàm lấy thông tin bác sĩ theo ID
  const getDoctorById = async (doctorId) => {
    try {
      const res = await doctorApi.getById(doctorId);
      setDoctor(res.doctor);
    } catch (err) {
      console.error("Failed to fetch doctor details:", err);
    }
  };

  // Hàm lấy thông tin chuyên khoa theo ID
  const getSpecialtyById = async (specialtyId) => {
    try {
      const res = await specialtyApi.getById(specialtyId);
      setSpecialties(res.specialty);
    } catch (err) {
      console.error("Failed to fetch specialty details:", err);
    }
  };

  // Hàm lấy thông tin cơ sở y tế theo ID
  const getFacilityById = async (facilityId) => {
    try {
      const res = await facilityApi.getById(facilityId);
      setFacilites(res.facility);
    } catch (err) {
      console.error("Failed to fetch facility details:", err);
    }
  };

  // Hàm lấy đánh giá theo doctorId
  const getRatesByDoctorId = async (doctorId) => {
    try {
      const res = await rateApi.getByDoctorId(doctorId);
      setRates(res.rates);
      console.log(res.rates);
    } catch (err) {
      console.error("Failed to fetch rates:", err);
    }
  };

  // Hàm hiển thị số sao
  const renderStars = (starCount) => {
    const totalStars = 5;
    const stars = [];
    for (let i = 1; i <= totalStars; i++) {
      stars.push(
        <span
          key={i}
          className={`text-lg ${
            i <= starCount ? "text-yellow-500" : "text-gray-300"
          }`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const calculateAverageRating = (rates) => {
    if (!rates || rates.length === 0) return 0; // Nếu không có đánh giá, trả về 0
    const totalStars = rates.reduce((sum, rate) => sum + rate.star_no, 0); // Tính tổng số sao
    return totalStars / rates.length; // Chia tổng số sao cho số lượng đánh giá
  };

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token"); // Lấy token từ cookie
    console.log(token);
    if (!token) {
      navigate("/account");
    } else {
      verifyUser(token);
      getUser(token);
      getDoctorById(id);
    }
  }, []);

  useEffect(() => {
    if (doctor) {
      getSpecialtyById(doctor.specialty_id);
      getFacilityById(doctor.facility_id);
      getRatesByDoctorId(id);
    }
  }, [doctor]);

  return (
    <motion.div
      className="dashboard-container ml-[200px] mt-[80px] w-[calc(100vw-200px)] p-[60px] bg-[#f4f6f8]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {doctor ? (
        <div className="flex gap-8">
          {/* Phần chi tiết bác sĩ (7 phần) */}
          <motion.div
            className="flex-1 bg-white p-8 rounded-lg"
            style={{ boxShadow: "2px 2px 10px 4px #cccc" }}
            variants={cardVariants}
          >
            <h3 className="text-4xl font-bold mb-6 text-center text-[var(--base-color)]">
              {doctor.fullname}
            </h3>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <div className="flex justify-center md:justify-start flex-col items-center">
                <div
                  className="w-48 h-48 bg-cover bg-center rounded-full pb-[100%]"
                  style={{
                    boxShadow: "2px 2px 10px 4px #cccc",
                    backgroundImage: `url(${
                      doctor.gender === "Male"
                        ? "/doctor-avt-male.png"
                        : "/doctor-avt-female.png"
                    })`,
                  }}
                ></div>

                {/* Dòng hiển thị rating */}
                <div className="flex items-center mt-4">
                  <div className="flex text-yellow-500 text-lg">
                    {renderStars(calculateAverageRating(rates))}
                  </div>
                  <p className="text-gray-700 text-sm font-medium ml-2">
                    {calculateAverageRating(rates).toFixed(1)} / 5
                  </p>
                </div>
              </div>

              {/* Doctor Info */}
              <div className="flex-1">
                <div className="flex flex-col gap-4 text-left">
                  <div>
                    <p className="text-sm text-[var(--base-color)] font-bold">
                      <FontAwesomeIcon icon={faStethoscope} className="px-1" />{" "}
                      Specialty:
                    </p>
                    <p className="text-[16px] pl-8">
                      {specialties?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--base-color)] font-bold">
                      <FontAwesomeIcon icon={faHospital} className="px-1" />
                      Facility:
                    </p>
                    <p className="text-[16px] pl-8">
                      {facilities?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--base-color)] font-bold">
                      <FontAwesomeIcon icon={faLocationDot} className="px-1" />
                      Address:
                    </p>
                    <p className="text-[16px] pl-8">
                      {facilities?.address || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--base-color)] font-bold">
                      <FontAwesomeIcon icon={faPhone} className="px-1" />
                      Contact:
                    </p>
                    <p className="text-[16px] pl-8">
                      {"(+84) " + doctor.phone_no}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8 justify-center">
              <div className="flex gap-4">
                {/* Book Appointment Button */}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBooking(doctor.id)}
                  className="flex-1 font-semibold text-lg py-2 transition-transform duration-300 transform hover:scale-105 shadow-md"
                  style={{
                    backgroundColor: "var(--base-color)", // Sử dụng màu base-color
                    color: "white",
                    fontSize: "16px",
                  }}
                >
                  Book
                </Button>

                {/* View Details Button */}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate(-1)}
                  className="flex-1 font-semibold text-lg py-2 transition-transform duration-300 transform hover:scale-105 shadow-md"
                  style={{
                    borderColor: "var(--base-color)", // Viền màu base-color
                    color: "var(--base-color)", // Chữ màu base-color
                    fontSize: "16px",
                  }}
                >
                  Back
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Phần đánh giá (3 phần) */}
          <motion.div
            className="w-1/3 bg-white p-6 rounded-lg"
            style={{
              boxShadow: "2px 2px 10px 4px #cccc",
            }}
            variants={cardVariants}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-[var(--base-color)]">
              Ratings & Reviews
            </h2>
            {rates.length > 0 ? (
              <div className="space-y-4">
                {rates.map((rate, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg"
                    style={{
                      boxShadow: "2px 2px 10px 4px #cccc",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div
                        className="w-12 h-12 bg-cover bg-center rounded-full"
                        style={{
                          backgroundImage: `url(${
                            rate.avatar || "/default-avatar.png"
                          })`,
                        }}
                      ></div>
                      {/* User Name */}
                      <h3 className="text-[var(--base-color)] font-semibold text-left">
                        {rate.fullname}
                      </h3>
                    </div>
                    <div className="flex mt-2">{renderStars(rate.star_no)}</div>
                    <div className="flex text-[12px] text-gray-500 mt-1">
                      {ultis.formatDate(rate.date)}
                    </div>
                    <p className="text-sm text-gray-800 text-left mt-2">
                      {rate.comments}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No reviews available.</p>
            )}
          </motion.div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Doctor not found.</p>
      )}
    </motion.div>
  );
}

export default DoctorDetail;
