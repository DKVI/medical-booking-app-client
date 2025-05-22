import React, { useEffect, useState } from "react";
import doctorApi from "../api/doctor.api"; // API to fetch doctor list
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import specialtyApi from "../api/specialty.api";
import facilityApi from "../api/facility.api";
import authApi from "../api/auth.api"; // API for authentication
import Cookies from "universal-cookie"; // For handling cookies
import LoadingScreen from "../components/LoadingScreen"; // Import LoadingScreen component
import rateApi from "../api/rate.api";
import { Button } from "@mui/material";
import baseURL from "../api/baseURL.api";

function Doctor() {
  const [searchKeyword, setSearchKeyword] = useState(""); // Từ khóa tìm kiếm
  const [doctors, setDoctors] = useState([]); // Danh sách bác sĩ
  const [loading, setLoading] = useState(false); // Trạng thái loading khi tìm kiếm
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading toàn trang
  const [specialties, setSpecialties] = useState(null); // Danh sách chuyên khoa
  const [facilities, setFacilities] = useState(null); // Danh sách cơ sở y tế
  const [user, setUser] = useState(null); // Thông tin người dùng
  const navigate = useNavigate();
  const [rates, setRates] = useState([]);
  // Hàm lấy token từ cookie và xác thực
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

  const getSpecialties = async () => {
    const res = await specialtyApi.getAll();
    setSpecialties(res.specialties);
  };

  const getFacilities = async () => {
    const res = await facilityApi.getAll();
    setFacilities(res.facilities);
  };

  const getAllRates = async () => {
    const res = await rateApi.getAll();
    setRates(res.rates);
    console.log(res.rates);
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
    }
    getSpecialties();
    getFacilities();
    getAllRates();

    // Hiển thị màn hình loading trong 1.5 giây
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
  }, []);

  // Hàm tìm kiếm bác sĩ
  const handleSearch = async (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    if (keyword.trim() === "") {
      setDoctors([]); // Xóa danh sách bác sĩ nếu từ khóa rỗng
      return;
    }

    setLoading(true);
    const res = await doctorApi.search(keyword); // Gọi API tìm kiếm bác sĩ
    setDoctors(res.doctors || []); // Cập nhật danh sách bác sĩ
    console.log(res.doctors);
    setLoading(false);
  };

  // Xử lý khi nhấn nút "Book Appointment"
  const handleBooking = (doctorId) => {
    const doctor = doctors.find((d) => d.id === doctorId);
    const facility = facilities?.find((f) => f.id === doctor?.facility_id);
    const specialty = specialties?.find((s) => s.id === doctor?.specialty_id);

    localStorage.setItem("doctorId", doctorId);
    localStorage.setItem("facilityId", facility?.id || "");
    localStorage.setItem("specialtyId", specialty?.id || "");
    localStorage.setItem("userId", user?.id || "");

    navigate(`/booking?mode=doctor`);
  };

  // Animation variants for page transition
  const pageVariants = {
    hidden: { opacity: 0, y: 50 }, // Bắt đầu mờ và trượt từ dưới lên
    visible: { opacity: 1, y: 0 }, // Hiển thị rõ ràng và trượt lên vị trí ban đầu
    exit: { opacity: 0, y: 50 }, // Khi mất đi, mờ dần và trượt xuống
  };

  return (
    <>
      <motion.div
        className="dashboard-container ml-[200px] mt-[80px] w-[calc(100vw-200px)] p-[60px] bg-[#f4f6f8] flex gap-[20px]"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={pageVariants}
        transition={{ duration: 0.5 }}
      >
        <div className="doctor-page p-6 m-auto">
          <h1
            className="text-3xl font-bold mb-6 text-center"
            style={{
              color: "var(--base-color)", // Màu tiêu đề
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", // Thêm shadow
            }}
          >
            Search for Doctors
          </h1>
          <div className="mb-6">
            <input
              type="text"
              value={searchKeyword}
              onChange={handleSearch}
              placeholder="Enter doctor name or specialty..."
              className="border border-gray-300 rounded-lg p-3 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--base-color)]"
            />
          </div>
          <div
            className="doctor-list-container"
            style={{
              minHeight: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loading ? (
              <p className="text-center text-lg text-gray-600">
                Loading doctors...
              </p>
            ) : doctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                  {doctors.map((doctor) => {
                    const specialty = specialties?.find(
                      (s) => s.id === doctor.specialty_id
                    );
                    const facility = facilities?.find(
                      (f) => f.id === doctor.facility_id
                    );
                    const doctorRate =
                      rates.find((rate) => rate.doctorId === doctor.id)
                        ?.average || 0;

                    return (
                      <motion.div
                        key={doctor.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.5 }}
                        className="doctor-card border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white w-[250px] mx-auto"
                      >
                        {/* Avatar */}
                        <div
                          className="w-full h-40 mb-4 bg-cover bg-center rounded-lg pb-[100%]"
                          style={{
                            backgroundImage: `url(${baseURL + doctor.avatar})`,
                          }}
                        ></div>

                        {/* Doctor Info */}
                        <h2 className="text-xl font-bold text-center text-[var(--base-color)] mb-2">
                          {doctor.fullname}
                        </h2>
                        <p className="text-gray-600 text-[12px] text-center mb-1">
                          {specialty?.name || "N/A"}
                        </p>
                        <p className="text-gray-600 text-[12px] text-center mb-4">
                          {facility?.name || "N/A"}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center justify-center mb-4">
                          <span className="text-yellow-500 text-lg mr-2">
                            ★
                          </span>
                          <span className="text-gray-700 font-medium">
                            {doctorRate}
                          </span>
                        </div>

                        {/* Buttons */}
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
                              fontSize: "12px",
                            }}
                          >
                            Book
                          </Button>

                          {/* View Details Button */}
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              navigate(`/doctor-detail?id=${doctor.id}`)
                            }
                            className="flex-1 font-semibold text-lg py-2 transition-transform duration-300 transform hover:scale-105 shadow-md"
                            style={{
                              borderColor: "var(--base-color)", // Viền màu base-color
                              color: "var(--base-color)", // Chữ màu base-color
                              fontSize: "12px",
                            }}
                          >
                            Details
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-4">
                No doctors found. Please try another keyword.
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default Doctor;
