import React, { useEffect, useState } from "react";
import doctorApi from "../api/doctor.api"; // API to fetch doctor list
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Import Framer Motion
import specialtyApi from "../api/specialty.api";
import facilityApi from "../api/facility.api";
import authApi from "../api/auth.api"; // API for authentication
import Cookies from "universal-cookie"; // For handling cookies

function Doctor() {
  const [searchKeyword, setSearchKeyword] = useState(""); // Từ khóa tìm kiếm
  const [doctors, setDoctors] = useState([]); // Danh sách bác sĩ
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [specialties, setSpecialties] = useState(null); // Danh sách chuyên khoa
  const [facilities, setFacilities] = useState(null); // Danh sách cơ sở y tế
  const [user, setUser] = useState(null); // Thông tin người dùng
  const navigate = useNavigate();

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

  const getSpecialties = async () => {
    const res = await specialtyApi.getAll();
    setSpecialties(res.specialties);
  };

  const getFacilities = async () => {
    const res = await facilityApi.getAll();
    setFacilities(res.facilities);
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
  }, []);

  return (
    <div className="dashboard-container ml-[200px] mt-[80px] w-[calc(100vw-200px)] p-[60px] bg-[#f4f6f8] flex gap-[20px]">
      <div className="doctor-page p-6 m-auto">
        {/* Tiêu đề */}
        <h1
          className="text-3xl font-bold mb-6 text-center"
          style={{
            color: "var(--base-color)", // Màu tiêu đề
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)", // Thêm shadow
          }}
        >
          Search for Doctors
        </h1>

        {/* Ô tìm kiếm */}
        <div className="mb-6">
          <input
            type="text"
            value={searchKeyword}
            onChange={handleSearch}
            placeholder="Enter doctor name or specialty..."
            className="border border-gray-300 rounded-lg p-3 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--base-color)]"
          />
        </div>

        {/* Hiển thị danh sách bác sĩ */}
        <div
          className="doctor-list-container"
          style={{
            minHeight: "300px", // Chiều cao tối thiểu để tránh giật
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {doctors.map((doctor) => {
                  // Tìm specialty và facility tương ứng
                  const specialty = specialties?.find(
                    (s) => s.id === doctor.specialty_id
                  );
                  const facility = facilities?.find(
                    (f) => f.id === doctor.facility_id
                  );

                  return (
                    <motion.div
                      key={doctor.doctorId}
                      initial={{ opacity: 0, y: 50 }} // Bắt đầu mờ và trượt từ dưới lên
                      animate={{ opacity: 1, y: 0 }} // Hiển thị rõ ràng và trượt lên vị trí ban đầu
                      exit={{ opacity: 0, y: 50 }} // Khi mất đi, mờ dần và trượt xuống
                      transition={{ duration: 0.5 }} // Thời gian chuyển đổi
                      className="doctor-card border border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                      <img
                        src={
                          doctor.gender === "Male"
                            ? "/doctor-avt-male.png"
                            : "/doctor-avt-female.png"
                        }
                        alt={doctor.fullname}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                      <h2 className="text-xl font-bold text-center text-[var(--base-color)]">
                        {doctor.fullname}
                      </h2>
                      <p className="text-gray-600 text-center">
                        {specialty?.name || "N/A"}
                      </p>
                      <p className="text-gray-600 text-center">
                        {facility?.name || "N/A"}
                      </p>
                      <button
                        onClick={() => handleBooking(doctor.id)}
                        className="mt-4 text-white px-4 py-2 rounded-lg w-full transition-transform duration-300 transform hover:scale-105"
                        style={{
                          backgroundColor: "var(--base-color)", // Nền màu --base-color
                          border: "none", // Xóa viền
                          cursor: "pointer", // Con trỏ chuột
                        }}
                      >
                        Book Appointment
                      </button>
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
    </div>
  );
}

export default Doctor;
