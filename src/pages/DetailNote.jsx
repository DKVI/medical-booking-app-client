import {
  faCheckCircle,
  faL,
  faNotesMedical,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
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
import PayPal from "../components/PayPal";
import {
  Snackbar,
  Alert,
  Slide,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import purchaseApi from "../api/purchase.api";
import emailApi from "../api/mail.api";
import prescriptionApi from "../api/prescription.api";
import rateApi from "../api/rate.api";

// Hiệu ứng trượt cho Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

function DetailNote() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [user, setUser] = useState(null);
  const [facility, setFacility] = useState(null);
  const [patient, setPatient] = useState(null);
  const [specialty, setSpecialty] = useState(null);
  const [detailCheckout, setDetailCheckout] = useState(null);
  const [workschedule, setWorkSchedule] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [purchase, setPurchase] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [prescription, setPrescription] = useState({
    notes: "",
    medicines: [],
  });
  const [rating, setRating] = useState(0); // Thêm state cho rating
  const [openDialog, setOpenDialog] = useState(false); // Thêm state cho Dialog
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
  function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
  }

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

      const purchaseDetail = await purchaseApi.getBySchedulingDetailId(id);
      console.log(purchaseDetail);
      if (purchaseDetail.purchase.status === "Purchased") {
        setPurchase(true);
      }
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

  const getPrescriptionBySchedulingId = async (id) => {
    try {
      const res = await prescriptionApi.getBySchedulingId(id);
      if (res.success) {
        setPrescription({
          notes: res.notes,
          medicines: res.medicines,
        });
        console.log(res);
      }
    } catch (err) {
      console.log(err);
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
    getPrescriptionBySchedulingId(id);
    getRatingById(id);
  }, []);

  const getRatingById = async (id) => {
    try {
      const res = await rateApi.getBySchedulingId(id);

      setRating(res.rate.star_no);
      setFeedback(res.rate.comments);
      console.log(res.rate);
    } catch (err) {
      console.log(err);
    }
  };
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
  const handelRate = async (body) => {
    try {
      const result = await rateApi.create(body);
      if (result.success) {
        setOpenDialog(true); // Hiển thị Dialog
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      className="dashboard-container ml-[200px] mt-[80px] w-[calc(100vw-200px)] p-[60px] flex gap-[20px]"
      style={{
        background: "linear-gradient(120deg, #e3f0ff 0%, #f7fbff 100%)",
        minHeight: "100vh",
      }}
    >
      <motion.div
        className="checkout-info w-2/3 h-full rounded-[28px] p-[24px] backdrop-blur-[20px]"
        style={{
          background: "rgba(255,255,255,0.85)",
          boxShadow: "0 8px 32px 0 rgba(33,150,243,0.18)",
          border: "2px solid #90caf9",
          backdropFilter: "blur(20px)",
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.1 }}
        variants={slideUpVariants}
      >
        <div className="w-full flex">
          <div
            className="p-3 m-auto flex gap-3 mb-8 text-[var(--base-color)] text-[24px] rounded-[20px]"
            style={{
              alignItems: "center",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Đổ bóng
            }}
          >
            <FontAwesomeIcon icon={faNotesMedical} />
            <h2>Medical Note</h2>
          </div>
        </div>
        <div>
          {/* Facility Container */}
          <motion.div
            className="text-left p-[24px] rounded-[20px] facility-container backdrop-blur-[20px]"
            style={{
              background: "rgba(227,240,255,0.85)",
              boxShadow: "0 4px 24px 0 rgba(33,150,243,0.12)",
              border: "1.5px solid #90caf9",
              marginBottom: "24px",
              backdropFilter: "blur(20px)",
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
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
              className="text-left p-[24px] rounded-[20px] doctor-container mt-[20px] w-1/2 backdrop-blur-[20px]"
              style={{
                background: "rgba(227,240,255,0.85)",
                boxShadow: "0 4px 24px 0 rgba(33,150,243,0.12)",
                border: "1.5px solid #90caf9",
                backdropFilter: "blur(20px)",
              }}
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
                  <p
                    onClick={() => navigate(`/doctor-detail?id=${doctor?.id}`)} // Điều hướng đến trang chi tiết bác sĩ
                    style={{
                      color: "var(--base-color)",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    {doctor?.fullname}
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
              className="text-left p-[24px] rounded-[20px] user-container mt-[20px] w-1/2 backdrop-blur-[20px]"
              style={{
                background: "rgba(227,240,255,0.85)",
                boxShadow: "0 4px 24px 0 rgba(33,150,243,0.12)",
                border: "1.5px solid #90caf9",
                backdropFilter: "blur(20px)",
              }}
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
      {/* Payment Details or Medical Notes */}
      <motion.div
        className="checkout-detail w-1/3 h-full p-[24px] rounded-[28px] bg-white backdrop-blur-[20px]"
        style={{
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 8px 32px 0 rgba(33,150,243,0.18)",
          border: "2px solid #90caf9",
          backdropFilter: "blur(20px)",
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.5 }}
        variants={slideUpVariants}
      >
        {(() => {
          const currentDate = new Date();
          const appointmentDate = new Date(detailCheckout?.date);
          const appointmentTime = workschedule?.times
            ? workschedule.times.split(":")
            : null;

          if (appointmentTime) {
            appointmentDate.setHours(parseInt(appointmentTime[0], 10));
            appointmentDate.setMinutes(parseInt(appointmentTime[1], 10));
          }

          // Kiểm tra expired
          const isExpired =
            detailCheckout?.status === "Expired" ||
            (detailCheckout?.status === "Process" &&
              appointmentDate <= currentDate);

          if (isExpired) {
            // Expired status
            return (
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
                  Appointment Status
                </h4>
                <div
                  style={{
                    marginTop: "20px",
                    padding: "10px",
                    backgroundColor: "#f8d7da",
                    borderRadius: "8px",
                    border: "1px solid #f5c6cb",
                  }}
                >
                  <h5
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#721c24",
                      marginBottom: "10px",
                    }}
                  >
                    Expired
                  </h5>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#721c24",
                    }}
                  >
                    You missed this appointment and cannot receive a refund.
                  </p>
                </div>
              </div>
            );
          } else if (detailCheckout?.status === "Done") {
            // Trạng thái "Done" - Hiển thị đơn thuốc và đánh giá
            return (
              <div>
                <h4
                  style={{
                    fontSize: "20px",
                    color: "var(--base-color)",
                    marginBottom: "20px",
                    textAlign: "center",
                    paddingBottom: "20px",
                    borderBottom: "1px solid var(--base-color)",
                    fontWeight: "bold",
                  }}
                >
                  Prescription
                </h4>
                {/* Notes */}
                <div
                  style={{
                    marginBottom: "20px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#555",
                    paddingBottom: "20px",
                    borderBottom: "1px solid var(--base-color)",
                  }}
                >
                  <h5
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "var(--base-color)",
                      marginBottom: "10px",
                      textAlign: "left",
                    }}
                  >
                    Notes:
                  </h5>
                  <p
                    style={{
                      padding: "0 20px 0 20px",
                      color: "#555",
                      marginTop: "10px",
                      textAlign: "left",
                    }}
                  >
                    {prescription?.notes || "No notes available."}
                  </p>
                </div>
                {/* Medicines */}
                <div>
                  <h5
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "var(--base-color)",
                      marginBottom: "10px",
                      textAlign: "left",
                    }}
                  >
                    Medicines:
                  </h5>
                  {prescription?.medicines?.length > 0 ? (
                    <div className="px-[20px]">
                      {prescription.medicines.map((medicine, index) => (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginBottom: "10px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#555",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span>{medicine.name}</span>
                            <span style={{ color: "var(--base-color)" }}>
                              x{medicine.quantity}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "normal",
                              color: "#888",
                              marginTop: "5px",
                              textAlign: "left",
                              marginLeft: "20px",
                            }}
                          >
                            {medicine.dosage ||
                              "No dosage information available"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "red", fontWeight: "bold" }}>
                      No medicines prescribed.
                    </p>
                  )}
                </div>
                {/* Rate Section */}
                <div
                  style={{
                    marginTop: "20px",
                    padding: "20px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    border: "1px solid var(--base-color)",
                    boxShadow: "2px 2px 10px 4px #cccc",
                  }}
                >
                  <h5
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "var(--base-color)",
                      marginBottom: "10px",
                      textAlign: "center",
                    }}
                  >
                    {rating > 0 ? "Your Feedback" : "Rate Your Appointment"}
                  </h5>

                  {rating > 0 ? (
                    // Hiển thị đánh giá ở dạng chỉ đọc
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          justifyContent: "center",
                          marginBottom: "10px",
                        }}
                      >
                        <div className="flex text-yellow-500 text-lg">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FontAwesomeIcon
                              key={star}
                              icon={faStar}
                              style={{
                                fontSize: "24px",
                                color: star <= rating ? "gold" : "gray",
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 text-sm font-medium">
                          {rating} / 5
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "var(--base-color)",
                          }}
                        >
                          Name:
                        </span>
                        <span>{user?.fullname || "Anonymous"}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "bold",
                            color: "var(--base-color)",
                          }}
                        >
                          Date:
                        </span>
                        <span>
                          {new Date(detailCheckout?.date).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <p
                        style={{
                          marginTop: "20px",
                          textAlign: "left",
                          fontSize: "14px",
                          color: "#555",
                          fontStyle: "italic",
                        }}
                      >
                        {feedback || "No comments provided."}
                      </p>
                    </div>
                  ) : (
                    // Hiển thị form đánh giá
                    <div>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          justifyContent: "center",
                        }}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FontAwesomeIcon
                            key={star}
                            icon={faStar}
                            style={{
                              fontSize: "24px",
                              cursor: "pointer",
                              color: star <= rating ? "gold" : "gray",
                            }}
                            onClick={() => setRating(star)} // Cập nhật trạng thái khi chọn ngôi sao
                          />
                        ))}
                      </div>
                      <textarea
                        placeholder="Write your feedback here..."
                        rows="4"
                        style={{
                          width: "100%",
                          padding: "10px",
                          marginTop: "10px",
                          borderRadius: "8px",
                          border: "1px solid var(--base-color)",
                        }}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                      ></textarea>
                      <button
                        style={{
                          marginTop: "10px",
                          width: "100%",
                          padding: "10px",
                          backgroundColor: "var(--base-color)",
                          color: "white",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          const newDate = detailCheckout.date.split("T")[0];
                          handelRate({
                            patient_id: detailCheckout.patient_id,
                            doctor_id: detailCheckout.doctor_id,
                            date: newDate,
                            star_no: rating,
                            comments: feedback,
                            scheduling_id: detailCheckout.id,
                          });
                        }}
                      >
                        Submit Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          } else {
            // Trạng thái "In Process"
            return (
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
                  Appointment Detail
                </h4>
                <div
                  style={{
                    marginTop: "20px",
                    padding: "10px",
                    backgroundColor: "#fff3cd",
                    borderRadius: "8px",
                    border: "1px solid #ffeeba",
                  }}
                >
                  <h5
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#856404",
                      marginBottom: "10px",
                    }}
                  >
                    Reminder
                  </h5>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#856404",
                    }}
                  >
                    Your appointment is scheduled for{" "}
                    <strong>
                      {new Date(detailCheckout?.date).toLocaleDateString(
                        "vi-VN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </strong>{" "}
                    at <strong>{workschedule?.times || "N/A"}</strong>. Please
                    complete your appointment to receive your prescription.
                  </p>
                </div>
              </div>
            );
          }
        })()}
      </motion.div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={null} // Không tự động ẩn
        onClose={() => {
          setOpenSnackbar(false);
          window.location.reload(); // Reload lại trang
        }}
        anchorOrigin={{ vertical: "center", horizontal: "center" }} // Hiển thị ở giữa màn hình
        TransitionComponent={SlideTransition} // Hiệu ứng trượt
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "#4caf50", // Màu nền xanh lá
            color: "#fff", // Màu chữ trắng
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)", // Đổ bóng
            borderRadius: "8px", // Bo góc
            textAlign: "center",
          },
        }}
      >
        <Alert
          onClose={() => {
            setOpenSnackbar(false);
            window.location.reload(); // Reload lại trang
          }}
          severity="success"
          icon={
            <FontAwesomeIcon icon={faCheckCircle} style={{ color: "#fff" }} />
          }
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: "16px",
            fontWeight: "bold",
            "& .MuiAlert-icon": {
              marginRight: "10px",
            },
          }}
        >
          <div>
            <p style={{ margin: 0 }}>🎉 Thank you for your feedback!</p>
            <button
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                backgroundColor: "white",
                color: "var(--base-color)",
                fontWeight: "bold",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                setOpenSnackbar(false);
                window.location.reload(); // Reload lại trang
              }}
            >
              OK
            </button>
          </div>
        </Alert>
      </Snackbar>
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          window.location.reload(); // Reload lại trang
        }}
        aria-labelledby="thank-you-dialog-title"
        aria-describedby="thank-you-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: "#4caf50", // Nền màu xanh lá
            color: "#fff", // Chữ màu trắng
            borderRadius: "12px", // Bo góc
            textAlign: "center",
            padding: "20px",
          },
        }}
      >
        <DialogTitle
          id="thank-you-dialog-title"
          style={{ fontSize: "24px", fontWeight: "bold" }}
        >
          🎉 Thank You!
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="thank-you-dialog-description"
            style={{ fontSize: "16px", color: "#fff" }}
          >
            Your feedback has been submitted successfully!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              window.location.reload(); // Reload lại trang
            }}
            style={{
              backgroundColor: "white",
              color: "#4caf50",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "10px 20px",
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DetailNote;
