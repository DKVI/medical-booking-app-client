import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import doctorApi from "../api/doctor.api";
import specialtyApi from "../api/specialty.api";
import facilityApi from "../api/facility.api";
import rateApi from "../api/rate.api";
import Cookies from "universal-cookie";
import LoadingScreen from "../components/LoadingScreen";
import ultis from "../ultis";

function DoctorDetail() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [specialty, setSpecialty] = useState(null);
  const [facility, setFacility] = useState(null);
  const [rates, setRates] = useState([]); // Danh sách đánh giá
  const [isLoading, setIsLoading] = useState(true);

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
      setSpecialty(res.specialty);
    } catch (err) {
      console.error("Failed to fetch specialty details:", err);
    }
  };

  // Hàm lấy thông tin cơ sở y tế theo ID
  const getFacilityById = async (facilityId) => {
    try {
      const res = await facilityApi.getById(facilityId);
      setFacility(res.facility);
    } catch (err) {
      console.error("Failed to fetch facility details:", err);
    }
  };

  // Hàm lấy đánh giá theo doctorId
  const getRatesByDoctorId = async (doctorId) => {
    try {
      const res = await rateApi.getByDoctorId(doctorId);
      setRates(res.rates);
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

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");
    if (!token) {
      navigate("/account");
    } else {
      getDoctorById(id).then(() => {
        if (doctor) {
          getSpecialtyById(doctor.specialty_id);
          getFacilityById(doctor.facility_id);
          getRatesByDoctorId(doctor.id);
        }
      });
    }
  }, [id, navigate, doctor]);

  return (
    <div className="dashboard-container ml-[200px] mt-[80px] w-[calc(100vw-200px)] p-[60px] bg-[#f4f6f8]">
      {doctor ? (
        <div className="flex gap-8">
          {/* Phần chi tiết bác sĩ (7 phần) */}
          <div
            className="flex-1 bg-white p-8 rounded-lg"
            style={{ boxShadow: "2px 2px 10px 4px #cccc" }}
          >
            <h1 className="text-4xl font-bold mb-6 text-center text-[var(--base-color)]">
              {doctor.fullname}
            </h1>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <div className="flex justify-center md:justify-start">
                <div
                  className="w-48 h-48 bg-cover bg-center rounded-full"
                  style={{
                    boxShadow: "2px 2px 10px 4px #cccc",
                    backgroundImage: `url(${
                      doctor.gender === "Male"
                        ? "/doctor-avt-male.png"
                        : "/doctor-avt-female.png"
                    })`,
                  }}
                ></div>
              </div>

              {/* Doctor Info */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-lg text-gray-700">
                    <strong>Gender:</strong> {doctor.gender}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong>Phone Number:</strong> {doctor.phone_no}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong>Specialty:</strong> {specialty?.name || "N/A"}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong>Facility:</strong> {facility?.name || "N/A"}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong>Status:</strong> {doctor.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8 justify-center">
              <button
                onClick={() => navigate(`/booking?doctorId=${doctor.id}`)}
                className="text-white px-6 py-3 rounded-lg transition-transform duration-300 transform hover:scale-105"
                style={{
                  backgroundColor: "var(--base-color)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Book Appointment
              </button>
              <button
                onClick={() => navigate(-1)}
                className="text-[var(--base-color)] border border-[var(--base-color)] px-6 py-3 rounded-lg transition-transform duration-300 transform hover:scale-105 hover:bg-[var(--base-color)] hover:text-white"
              >
                Back
              </button>
            </div>
          </div>

          {/* Phần đánh giá (3 phần) */}
          <div
            className="w-1/3 bg-white p-6 rounded-lg"
            style={{
              boxShadow: "2px 2px 10px 4px #cccc",
            }}
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
                    <h3 className="text-[var(--base-color)] font-semibold text-left">
                      {rate.fullname}
                    </h3>
                    <div className="flex">{renderStars(rate.star_no)}</div>
                    <div className="flex text-[12px]">
                      {ultis.formatDate(rate.date)}
                    </div>
                    <p className="text-sm text-gray-800 text-left mt-1 p-3">
                      {rate.comments}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No reviews available.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Doctor not found.</p>
      )}
    </div>
  );
}

export default DoctorDetail;
