import { faCheckCircle, faL } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { use, useEffect, useRef, useState } from "react";
import { useFetcher, useNavigate, useSearchParams } from "react-router-dom";
import authApi from "../api/auth.api";
import Cookies from "universal-cookie";
import facilityApi from "../api/facility.api";
import patientApi from "../api/patient.api";
import scheduleDetailApi from "../api/scheduledetail.api";
import workscheduleApi from "../api/workschedule.api";
import specialtyApi from "../api/specialty.api";
import doctorApi from "../api/doctor.api";
import LoadingScreen from "../components/LoadingScreen";
import { motion } from "framer-motion"; // Import Framer Motion

function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [user, setUser] = useState(null);
  const [facility, setFacility] = useState({});
  const [patient, setPatient] = useState({});
  const [specialty, setSpecialty] = useState({});
  const [detailCheckout, setDetailCheckout] = useState(null);
  const [workschedule, setWorkSchedule] = useState({});
  const [doctor, setDoctor] = useState(null);
  const verifyUser = async (token) => {
    const res = await authApi.verify(token);
    if (!res.success) {
      navigate("/account");
    }
  };
  const getUser = async (token) => {
    try {
      const res = await authApi.getByToken(token);
      const user = res.user;
      setUser(user);
      console.log(res.user);
    } catch (error) {
      navigate("/account");
    }
  };
  const getFacilityById = async (id) => {
    try {
      const res = await facilityApi.getById(id);
      setFacility(res.facility);
      console.log(res.facility.name);
    } catch (err) {}
  };
  const getSpecialtyById = async (id) => {
    try {
      const res = await specialtyApi.getById(id);
      setSpecialty(res.specialty);
    } catch (err) {}
  };
  const getPatientById = async (id) => {
    try {
      const res = await patientApi.getById(id);
      setPatient(res.patient);
    } catch (err) {}
  };

  const getDoctorById = async (id) => {
    try {
      const res = await doctorApi.getById(id);
      setDoctor(res.doctor);
      const promises = [];
      console.log(res.doctor);
      if (res.doctor.specialty_id) {
        console.log("specialty");
        promises.push(getSpecialtyById(res.doctor.specialty_id));
      }
      if (res.doctor.facility_id) {
        console.log("facility");
        promises.push(getFacilityById(res.doctor.facility_id));
      }
      await Promise.all(promises);
    } catch (err) {}
  };
  const getDetailCheckoutById = async (id) => {
    try {
      const res = await scheduleDetailApi.getById(id);
      const detail = res.schedulingDetail?.[0]; // Kiểm tra nếu có dữ liệu
      if (!detail) {
        console.error("No detail found for the given ID");
        return; // Dừng lại nếu không có detail
      }

      console.log(detail);
      setDetailCheckout(detail);

      // Kiểm tra và gọi các hàm API chỉ khi giá trị hợp lệ
      const promises = [];

      if (detail.workschedule_id) {
        promises.push(getWorkScheduleById(detail.workschedule_id));
      }

      if (detail.patient_id) {
        promises.push(getPatientById(detail.patient_id));
      }

      if (detail.doctor_id) {
        promises.push(getDoctorById(detail.doctor_id));
      }

      // Thực hiện tất cả các lời gọi API đồng thời
      await Promise.all(promises);
    } catch (err) {
      console.error("Error fetching detail checkout:", err);
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
    getDetailCheckoutById(id);
  }, []);

  const getWorkScheduleById = async (id) => {
    try {
      const res = await workscheduleApi.getById(id);
      setWorkSchedule(res.workSchedule[0]);
    } catch (err) {}
  };

  const slideUpVariants = {
    hidden: { opacity: 0, y: 50 }, // Bắt đầu ở dưới và mờ
    visible: { opacity: 1, y: 0 }, // Hiển thị và trượt lên
  };

  return (
    <div className="dashboard-container ml-[200px] mt-[80px] w-[calc(100vw-200px)] p-[60px] bg-[#f4f6f8] flex gap-[20px]">
      <motion.div
        className="checkout-info w-2/3 h-full rounded-[20px] shadow p-[20px]"
        style={{ backgroundColor: "white" }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.1 }} // Hiệu ứng trượt
        variants={slideUpVariants}
      >
        <div className="w-full flex">
          <div
            className="p-3 m-auto flex gap-3 text-[var(--base-color)] text-[24px] shadow-md rounded-[20px]"
            style={{
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon icon={faCheckCircle} />
            <h2>Appointment Booked!</h2>
          </div>
        </div>
        <div>
          {/* Facility Container */}
          <motion.div
            className="text-left p-[20px] shadow-lg rounded-[20px] facility-container"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={slideUpVariants}
          >
            <h4
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "var(--base-color)",
                marginBottom: "10px",
              }}
            >
              Facility
            </h4>
            <div className="px-[40px]">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <label
                  style={{ fontWeight: "bold", color: "var(--base-color)" }}
                >
                  Name:
                </label>
                <p>{facility?.name}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <label
                  style={{ fontWeight: "bold", color: "var(--base-color)" }}
                >
                  Address:
                </label>
                <p>{facility?.address}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <label
                  style={{ fontWeight: "bold", color: "var(--base-color)" }}
                >
                  Phone:
                </label>
                <p>{facility?.phone}</p>
              </div>
            </div>
          </motion.div>

          <div className="flex gap-6">
            {/* Doctor Container */}
            <motion.div
              className="text-left p-[20px] shadow-lg rounded-[20px] doctor-container mt-[20px] w-1/2"
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.3 }}
              variants={slideUpVariants}
            >
              <h4
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "var(--base-color)",
                  marginBottom: "10px",
                }}
              >
                Doctor
              </h4>
              <div className="px-[40px]">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <label
                    style={{ fontWeight: "bold", color: "var(--base-color)" }}
                  >
                    Name:
                  </label>
                  <p>{doctor?.fullname}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <label
                    style={{ fontWeight: "bold", color: "var(--base-color)" }}
                  >
                    Specialty:
                  </label>
                  <p>{specialty?.name}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <label
                    style={{ fontWeight: "bold", color: "var(--base-color)" }}
                  >
                    Date:
                  </label>
                  <p>
                    {new Date(detailCheckout?.date).toLocaleDateString(
                      "vi-VN",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <label
                    style={{ fontWeight: "bold", color: "var(--base-color)" }}
                  >
                    Times:
                  </label>
                  <p>{workschedule?.times}</p>
                </div>
              </div>
            </motion.div>

            {/* User Container */}
            <motion.div
              className="text-left p-[20px] shadow-lg rounded-[20px] user-container mt-[20px] w-1/2"
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.4 }}
              variants={slideUpVariants}
            >
              <h4
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "var(--base-color)",
                  marginBottom: "10px",
                }}
              >
                User
              </h4>
              <div className="px-[40px]">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <label
                    style={{ fontWeight: "bold", color: "var(--base-color)" }}
                  >
                    Full Name:
                  </label>
                  <p>{user?.fullname}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <label
                    style={{ fontWeight: "bold", color: "var(--base-color)" }}
                  >
                    Identity No:
                  </label>
                  <p>{user?.identity_no}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <label
                    style={{ fontWeight: "bold", color: "var(--base-color)" }}
                  >
                    Insurance ID:
                  </label>
                  <p>{patient?.insurance_no}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <label
                    style={{ fontWeight: "bold", color: "var(--base-color)" }}
                  >
                    Phone:
                  </label>
                  <p>{user?.phone_no}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <label
                    style={{ fontWeight: "bold", color: "var(--base-color)" }}
                  >
                    Email:
                  </label>
                  <p>{user?.email}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="checkout-detail w-1/3 h-full p-[20px] shadow-lg rounded-[20px] bg-white"
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.5 }} // Hiệu ứng trượt với độ trễ
        variants={slideUpVariants}
      >
        <div>
          <h4
            style={{
              fontSize: "20px",
              color: "var(--base-color)",
              marginBottom: "20px",
              textAlign: "center",
              paddingBottom: "20px",
              borderBottom: "1px solid var(--base-color)",
            }}
          >
            Payment Details
          </h4>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                fontSize: "16px",
                fontWeight: "bold",
                borderBottom: "1px solid var(--base-color)",
                color: "#555",
                paddingBottom: "20px",
              }}
            >
              <span className="font-normal">Appointment Charge:</span>
              <span style={{ color: "var(--base-color)" }}> $0.5</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              <span>Total Price:</span>
              <span style={{ color: "var(--base-color)" }}> $0.5</span>
            </div>
          </div>

          {/* Payment Status Block */}
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              border: "1px solid var(--base-color)",
            }}
          >
            <h5
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "var(--base-color)",
                marginBottom: "10px",
              }}
            >
              Payment Status
            </h5>
            <p
              style={{
                fontSize: "16px",
                color: "red",
              }}
            >
              Not Paid
            </p>
          </div>

          <button
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "var(--base-color)",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "20px",
            }}
            onClick={() => alert("Payment successful!")}
          >
            Pay Now
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Checkout;
