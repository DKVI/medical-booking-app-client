import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "universal-cookie";
import baseURLApi from "../api/baseURL.api";
import authApi from "../api/auth.api";
import {
  Autocomplete,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  Typography,
} from "@mui/material";
import facilityApi from "../api/facility.api";
import rateApi from "../api/rate.api";
import specialtyApi from "../api/specialty.api";
import doctorApi from "../api/doctor.api";
import WeekdayDatePicker from "../components/WeekdayDatePicker";
import workscheduleApi from "../api/workschedule.api";
import WorkScheduleElement from "../components/WorkScheduleElement";
import LoadingScreen from "../components/LoadingScreen";
import scheduleDetailApi from "../api/scheduledetail.api";
import { motion, AnimatePresence } from "framer-motion";

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Booking() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Lấy tham số từ URL
  const mode = searchParams.get("mode"); // Lấy giá trị của tham số "mode"
  const [facility, setFacility] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [specialty, setSpecialty] = useState([]);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState(null);
  const [doctor, setDoctor] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [workschedule, setWorkSchedule] = useState([]);
  const [selectedWorkScheduleId, setSelectedWorkScheduleId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // State để quản lý hiển thị AlertDialog
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState("");
  const [title, setTitle] = useState("");
  const [onLoading, setOnLoading] = useState(false);
  const [scheduleDetail, setScheduleDetailId] = useState(null);
  const [bookingId, setBookingId] = useState(null);
  const [isFullInfo, setIsFullInfo] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [doctorRates, setDoctorRates] = useState("");
  const steps = [
    "Choose Facility",
    "Choose Specialty",
    "Choose Doctor",
    "Pick Date",
    "Confirm",
  ];
  const verifyUser = async (token) => {
    const res = await authApi.verify(token);
    if (!res.success) {
      navigate("/account");
    }
  };

  const getFacility = async () => {
    try {
      const res = await facilityApi.getAll();
      setFacility(res?.facilities || []);
    } catch (error) {
      console.error("Failed to fetch facilities:", error);
    }
  };

  const getUser = async (token) => {
    try {
      const res = await authApi.getByToken(token);
      const user = res.user;
      setUser(user);

      if (user.fullname === null) {
        setTitle("Information");
        setNotification(
          "You must complete your profile information before booking an appointment."
        );
        setOpenDialog(true);
        setIsFullInfo(false);
        setTimeout(() => {
          navigate("/profile"); // Chuyển hướng sang trang profile nếu thiếu thông tin
        }, 3000);
      } else {
        setIsFullInfo(true);
      }
    } catch (error) {
      navigate("/account");
    }
  };

  const getSpecialty = async () => {
    try {
      const res = await specialtyApi.getAll();
      setSpecialty(res.specialties || []);
      console.log(res);
    } catch (error) {
      console.error("Failed to fetch specialties:", error);
    }
  };

  const getWorkSchedule = async () => {
    try {
      const res = await workscheduleApi.getAll();
      setWorkSchedule(res || []);
      console.log(res);
    } catch (error) {
      console.error("Failed to fetch workschedule:", error);
    }
  };

  const getDoctors = async () => {
    if (selectedFacilityId && selectedSpecialtyId) {
      try {
        const res = await doctorApi.getByFacilityIdAndSpecialtyId(
          selectedFacilityId,
          selectedSpecialtyId
        );
        if (typeof res !== "string") {
          setDoctor(res);
        } else {
          setDoctor([]);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    }
  };
  useEffect(() => {
    const fetchRates = async () => {
      if (doctor && doctor.length > 0) {
        const rates = {};
        await Promise.all(
          doctor.map(async (doctor) => {
            const avg = await rateApi.getAverRateByDoctorId(doctor.id);
            console.log(avg);
            rates[doctor.id] = avg?.average || 0;
          })
        );
        setDoctorRates(rates);
      }
    };
    fetchRates();
  }, [doctor]);

  useEffect(() => {
    setOnLoading(true);
    setTimeout(() => {
      setOnLoading(false);
    }, 1500);
    const token = cookies.get("token");
    if (!token) {
      navigate("/account");
    } else {
      verifyUser(token);
      getUser(token);
    }
    getFacility();
    getSpecialty();
  }, []);

  useEffect(() => {
    getDoctors();
  }, [selectedFacilityId, selectedSpecialtyId]);

  useEffect(() => {
    getWorkSchedule();
  }, [selectedDoctorId]);

  // Xử lý sự kiện reload trang
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Hiển thị hộp thoại mặc định của trình duyệt
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const onBooking = async () => {
    if (!selectedWorkScheduleId || !selectedDate) {
      setErrorMessage("Please complete all required fields before confirming.");
      return;
    }

    const uniqueId = uuidv4();
    setOnLoading(true); // Bật trạng thái loading
    const body = {
      id: uniqueId,
      doctor_id: selectedDoctorId,
      patient_id: user.patient_id,
      workschedule_id: selectedWorkScheduleId,
      date: selectedDate.format("YYYY-MM-DD"),
    };

    try {
      const res = await scheduleDetailApi.create(body);
      setTimeout(() => {
        setOnLoading(false); // Tắt trạng thái loading sau 1 giây
        setScheduleDetailId(uniqueId);
        setOpenDialog(true); // Hiển thị dialog xác nhận
        setTitle("Booking Successful");
        setNotification(
          `Your booking has been successfully created with ID: ${uniqueId}. You will now be redirected to the checkout page.`
        );
        setBookingId(uniqueId); // Lưu ID để chuyển hướng
      }, 1500); // Thời gian loading là 1 giây
    } catch (err) {
      setOnLoading(false);
      setErrorMessage("Failed to confirm booking. Please try again.");
      console.error("Booking error:", err);
    }
  };
  const handleDialogClose = (confirm) => {
    setOpenDialog(false);
    if (confirm) {
      navigate(`/checkout?id=${bookingId}`); // Chuyển đến trang checkout với ID
    }
  };

  useEffect(() => {
    if (mode === "doctor") {
      const storedUserId = localStorage.getItem("userId");
      const storedDoctorId = localStorage.getItem("doctorId");
      const storedFacilityId = localStorage.getItem("facilityId");
      const storedSpecialtyId = localStorage.getItem("specialtyId");

      if (
        storedUserId &&
        storedFacilityId &&
        storedSpecialtyId &&
        storedDoctorId
      ) {
        setSelectedFacilityId(storedFacilityId);
        setSelectedSpecialtyId(storedSpecialtyId);
        setSelectedDoctorId(storedDoctorId);

        // Tự động điền giá trị vào Autocomplete
        const selectedFacility = facility.find(
          (f) => f.id === storedFacilityId
        );
        const selectedSpecialty = specialty.find(
          (s) => s.id === storedSpecialtyId
        );
        const selectedDoctor = doctor.find((d) => d.id === storedDoctorId);

        if (selectedFacility) {
          setSelectedFacilityId(selectedFacility.id);
        }
        if (selectedSpecialty) {
          setSelectedSpecialtyId(selectedSpecialty.id);
        }
        if (selectedDoctor) {
          setSelectedDoctorId(selectedDoctor.id);
        }

        setActiveStep(3); // Chuyển đến bước chọn ngày và giờ
      }
    }
  }, [mode, specialty, facility, doctor]);

  const canProceedToNextStep = () => {
    switch (activeStep) {
      case 3: // Bước 4: Chọn Date
        if (!selectedDate) {
          setErrorMessage("Please pick a date.");
          return false;
        }
        break;
      case 4: // Bước 5: Confirm
        if (!selectedWorkScheduleId) {
          setErrorMessage("Please select a time slot.");
          return false;
        }
        break;
      default:
        setErrorMessage("");
        return true;
    }
    setErrorMessage(""); // Xóa thông báo lỗi nếu điều kiện thỏa mãn
    return true;
  };

  return (
    <>
      {/* Loading overlay */}
      {onLoading && <LoadingScreen />}
      <div
        className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex flex-col items-center justify-start py-[60px]"
        style={{
          marginLeft: 0,
          marginTop: 0,
          width: "100vw",
          padding: 0,
          backgroundColor: undefined,
        }}
      >
        <div className="w-full max-w-[1200px] mx-auto px-4">
          <div className="flex flex-col items-center gap-10">
            {/* Header */}
            <div className="w-full flex flex-col items-center mb-[100px]">
              <div className="h-[3px] w-24 bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 rounded-full mt-2"></div>
            </div>
            {/* Stepper */}
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{ marginBottom: "40px" }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {/* Steps content */}
            <div className="w-full">
              {/* Step 1: Choose Facility */}
              {activeStep === 0 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.5 }}
                  variants={fadeInVariants}
                >
                  <div className="bg-white rounded-[24px] border-2 border-blue-100 shadow-xl p-8 mb-10 w-full max-w-2xl mx-auto">
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "var(--base-color)",
                        fontWeight: "bold",
                        letterSpacing: 1,
                        mb: 2,
                      }}
                    >
                      Choose Facility
                    </Typography>
                    <Autocomplete
                      options={facility}
                      getOptionLabel={(option) => option.name || ""}
                      value={
                        facility.find((f) => f.id === selectedFacilityId) ||
                        null
                      }
                      onChange={(event, newValue) => {
                        setSelectedFacilityId(newValue?.id || null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Choose Facility"
                          variant="outlined"
                          sx={{
                            background:
                              "linear-gradient(120deg, #fafdff 60%, #f1f4fa 100%)",
                            borderRadius: "12px",
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      )}
                      disabled={facility.length === 0}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Choose Specialty */}
              {activeStep === 1 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.5 }}
                  variants={fadeInVariants}
                >
                  <div className="bg-white rounded-[24px] border-2 border-blue-100 shadow-xl p-8 mb-10 w-full max-w-2xl mx-auto">
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "var(--base-color)",
                        fontWeight: "bold",
                        letterSpacing: 1,
                        mb: 2,
                      }}
                    >
                      Choose Specialty
                    </Typography>
                    <Autocomplete
                      options={specialty}
                      getOptionLabel={(option) => option.name || ""}
                      value={
                        specialty.find((s) => s.id === selectedSpecialtyId) ||
                        null
                      }
                      onChange={(event, newValue) => {
                        setSelectedSpecialtyId(newValue?.id || null);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Choose Specialty"
                          variant="outlined"
                          sx={{
                            background:
                              "linear-gradient(120deg, #fafdff 60%, #f1f4fa 100%)",
                            borderRadius: "12px",
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                            },
                          }}
                        />
                      )}
                      disabled={!selectedFacilityId || specialty.length === 0}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Choose Doctor */}
              {activeStep === 2 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.5 }}
                  variants={fadeInVariants}
                >
                  <div className="bg-white rounded-[24px] border-2 border-blue-100 shadow-xl p-8 mb-10 w-full max-w-4xl mx-auto">
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "var(--base-color)",
                        fontWeight: "bold",
                        letterSpacing: 1,
                        mb: 2,
                      }}
                    >
                      Choose Doctor
                    </Typography>
                    <div
                      className="doctor-list-container"
                      style={{
                        minHeight: "200px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {doctor.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3   gap-6 mb-8">
                          <AnimatePresence>
                            {doctor.map((doc) => (
                              <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                transition={{ duration: 0.5 }}
                                className={`doctor-card border-2 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-blue-50 w-[250px] mx-auto cursor-pointer ${
                                  selectedDoctorId === doc.id
                                    ? "border-[var(--base-color)] ring-2 ring-blue-100"
                                    : "border-blue-100"
                                }`}
                                style={{
                                  boxShadow:
                                    selectedDoctorId === doc.id
                                      ? "0 0 0 4px #e3eaff"
                                      : "0 1px 3px rgba(0,0,0,0.08)",
                                }}
                                onClick={() => {
                                  setSelectedDoctorId(doc.id);
                                }}
                              >
                                {/* Avatar */}
                                <div
                                  className="w-full h-40 mb-4 bg-cover bg-center rounded-lg pb-[100%]"
                                  style={{
                                    backgroundImage: `url(${
                                      baseURLApi + doc.avatar
                                    })`,
                                  }}
                                ></div>
                                {/* Doctor Info */}
                                <h2
                                  onClick={() => {
                                    navigate(`/doctor-detail?id=${doc.id}`);
                                  }}
                                  className="text-xl font-bold text-center text-[var(--base-color)] mb-2"
                                >
                                  {doc.fullname}
                                </h2>
                                <p className="text-gray-600 text-center text-sm mb-2">
                                  {specialty.find(
                                    (e) => e.id == selectedSpecialtyId
                                  )?.name || "No description"}
                                </p>
                                <p className="text-gray-600 text-center text-sm mb-2">
                                  {facility.find(
                                    (e) => e.id == selectedFacilityId
                                  )?.name || "No description"}
                                </p>
                                <span className="mt-2 flex items-center justify-center gap-1 text-yellow-500 font-semibold">
                                  <span className="text-base">
                                    {doctorRates[doc.id]?.toFixed(1) || "0.0"}
                                  </span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                                  </svg>
                                </span>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center mt-4">
                          No doctors found. Please choose facility and
                          specialty.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Pick Date (WorkSchedule) */}
              {activeStep === 3 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.5 }}
                  variants={fadeInVariants}
                >
                  <div className="bg-white rounded-[24px] border-2 border-blue-100 shadow-xl p-8 mb-10 w-full max-w-2xl mx-auto">
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "var(--base-color)",
                        fontWeight: "bold",
                        letterSpacing: 1,
                        mb: 2,
                      }}
                    >
                      Pick Date
                    </Typography>
                    <WeekdayDatePicker
                      onDateChange={(date) => {
                        setSelectedDate(date);
                      }}
                      sx={{
                        background:
                          "linear-gradient(120deg, #fafdff 60%, #f1f4fa 100%)",
                        borderRadius: "12px",
                        padding: "8px",
                      }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 5: Confirm */}
              {activeStep === 4 && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.5 }}
                  variants={fadeInVariants}
                >
                  <div className="bg-white rounded-[24px] border-2 border-blue-100 shadow-xl p-8 mb-10 w-full max-w-2xl mx-auto">
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        color: "var(--base-color)",
                        fontWeight: "bold",
                        letterSpacing: 1,
                        mb: 2,
                      }}
                    >
                      Confirm Booking Information
                    </Typography>
                    <WorkScheduleElement
                      workschedule={workschedule}
                      selectedWorkScheduleId={selectedWorkScheduleId}
                      setSelectedWorkScheduleId={setSelectedWorkScheduleId}
                      sx={{
                        background:
                          "linear-gradient(120deg, #fafdff 60%, #f4f8ff 100%)",
                        borderRadius: "12px",
                        padding: "8px",
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </div>
            {/* Navigation buttons */}
            <div className="flex flex-col items-center mt-4 w-full max-w-2xl mx-auto">
              {/* Back */}
              {!(mode === "doctor" && activeStep === 3) && (
                <Button
                  style={{ width: "200px" }}
                  variant="outlined"
                  color="secondary"
                  onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                  disabled={activeStep === 0}
                >
                  Back
                </Button>
              )}
              {/* Next/Confirm */}
              <Button
                style={{ width: "200px", marginTop: "10px" }}
                variant="contained"
                color="primary"
                onClick={() => {
                  if (activeStep === steps.length - 1) {
                    if (canProceedToNextStep()) {
                      onBooking();
                    }
                  } else if (canProceedToNextStep()) {
                    setActiveStep((prev) =>
                      Math.min(prev + 1, steps.length - 1)
                    );
                  }
                }}
              >
                {activeStep === steps.length - 1 ? "Confirm" : "Next"}
              </Button>
              <div className="h-[100x] w-[100vw]"></div>
              {/* Error message */}
              {errorMessage && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{ marginTop: "10px", textAlign: "center" }}
                >
                  {errorMessage}
                </Typography>
              )}
            </div>
            {/* Dialog */}
            <Dialog
              open={openDialog}
              onClose={() => setOpenDialog(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              PaperProps={{
                sx: {
                  borderRadius: "20px",
                  background:
                    "linear-gradient(120deg, #fafdff 60%, #f4f8ff 100%)",
                  boxShadow: "0 8px 32px rgba(80,112,255,0.10)",
                  padding: 2,
                },
              }}
            >
              <DialogTitle
                id="alert-dialog-title"
                sx={{
                  color: "var(--base-color)",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "1.3rem",
                  letterSpacing: 1,
                }}
              >
                {title}
              </DialogTitle>
              <DialogContent>
                <DialogContentText
                  id="alert-dialog-description"
                  sx={{
                    color: "#374151",
                    fontSize: "1.1rem",
                    textAlign: "center",
                    padding: 1,
                  }}
                >
                  {notification}
                  {/* Nếu là thông báo check mail */}
                  {title?.toLowerCase().includes("mail") && (
                    <div className="flex justify-center mt-4">
                      <img
                        src="/mail-check.png"
                        alt="Check mail"
                        className="w-20 h-20"
                        style={{ filter: "drop-shadow(0 2px 8px #a5b4fc)" }}
                      />
                    </div>
                  )}
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                  onClick={() => setOpenDialog(false)}
                  color="secondary"
                  variant="outlined"
                  sx={{
                    borderRadius: "8px",
                    fontWeight: "bold",
                    minWidth: "100px",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setOpenDialog(false);
                    navigate(`/checkout?id=${bookingId}`); // Chuyển đến trang checkout với ID
                  }}
                  color="primary"
                  variant="contained"
                  sx={{
                    borderRadius: "8px",
                    fontWeight: "bold",
                    minWidth: "100px",
                  }}
                  autoFocus
                >
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}

export default Booking;
