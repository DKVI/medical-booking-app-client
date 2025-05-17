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
      // Hiển thị màn hình loading
      <div
        className="dashboard-container"
        style={{
          marginLeft: "200px",
          marginTop: "80px",
          width: "calc(100vw - 200px)",
          padding: "40px", // Thêm padding cho container chính
          backgroundColor: "#f4f6f8",
        }}
      >
        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{ marginBottom: "40px" }} // Thêm khoảng cách dưới Stepper
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Nội dung các bước */}
        {/* Step 1: Choose Facility */}
        {activeStep === 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.5 }}
            variants={fadeInVariants}
          >
            <Card
              sx={{
                marginBottom: "40px", // Thêm khoảng cách dưới Card
                padding: "20px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Choose Facility
              </Typography>
              <Autocomplete
                options={facility}
                getOptionLabel={(option) => option.name || ""}
                value={
                  facility.find((f) => f.id === selectedFacilityId) || null
                }
                onChange={(event, newValue) => {
                  setSelectedFacilityId(newValue?.id || null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose Facility"
                    variant="outlined"
                  />
                )}
                disabled={facility.length === 0}
              />
            </Card>
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
            <Card
              sx={{
                marginBottom: "40px", // Thêm khoảng cách dưới Card
                padding: "20px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Choose Specialty
              </Typography>
              <Autocomplete
                options={specialty}
                getOptionLabel={(option) => option.name || ""}
                value={
                  specialty.find((s) => s.id === selectedSpecialtyId) || null
                }
                onChange={(event, newValue) => {
                  setSelectedSpecialtyId(newValue?.id || null);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Choose Specialty"
                    variant="outlined"
                  />
                )}
                disabled={!selectedFacilityId || specialty.length === 0}
              />
            </Card>
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
            <Card
              sx={{
                marginBottom: "40px",
                padding: "20px",
              }}
            >
              <Typography variant="h6" gutterBottom>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                    <AnimatePresence>
                      {doctor.map((doc) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 50 }}
                          transition={{ duration: 0.5 }}
                          className={`doctor-card border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white w-[250px] mx-auto cursor-pointer ${
                            selectedDoctorId === doc.id ? "ring-0" : ""
                          }`}
                          style={{
                            border:
                              selectedDoctorId === doc.id
                                ? "3px solid var(--base-color)"
                                : "1px solid #d1d5db",
                            boxShadow:
                              selectedDoctorId === doc.id
                                ? "0 0 0 4px #e3eaff"
                                : "0 1px 3px rgba(0,0,0,0.1)",
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
                          <h2 className="text-xl font-bold text-center text-[var(--base-color)] mb-2">
                            {doc.fullname}
                          </h2>
                          <p className="text-gray-600 text-center text-sm mb-2">
                            {specialty.find((e) => e.id == selectedSpecialtyId)
                              .name || "No description"}
                          </p>
                          <p className="text-gray-600 text-center text-sm mb-2">
                            {facility.find((e) => e.id == selectedFacilityId)
                              .name || "No description"}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center mt-4">
                    No doctors found. Please choose facility and specialty.
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Pick Date */}
        {activeStep === 3 && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.5 }}
            variants={fadeInVariants}
          >
            <Card
              sx={{
                marginBottom: "40px", // Thêm khoảng cách dưới Card
                padding: "20px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Pick Date
              </Typography>
              <WeekdayDatePicker
                onDateChange={(date) => {
                  setSelectedDate(date);
                }}
              />
            </Card>
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
            <Card
              sx={{
                marginBottom: "40px", // Thêm khoảng cách dưới Card
                padding: "20px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Confirm Booking Information
              </Typography>
              <WorkScheduleElement
                workschedule={workschedule}
                selectedWorkScheduleId={selectedWorkScheduleId}
                setSelectedWorkScheduleId={setSelectedWorkScheduleId}
              />
            </Card>
          </motion.div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "20px",
            padding: "0 100px 0 100px",
          }}
        >
          {/* Nút Back */}
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

          {/* Nút Next hoặc Confirm */}
          <Button
            style={{ width: "200px", marginTop: "10px" }}
            variant="contained"
            color="primary"
            onClick={() => {
              if (activeStep === steps.length - 1) {
                // Nếu ở bước cuối cùng, gọi hàm onBooking
                if (canProceedToNextStep()) {
                  onBooking();
                }
              } else if (canProceedToNextStep()) {
                // Nếu không ở bước cuối cùng, chuyển sang bước tiếp theo
                setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
              }
            }}
          >
            {activeStep === steps.length - 1 ? "Confirm" : "Next"}
          </Button>

          {/* Hiển thị thông báo lỗi */}
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
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {notification}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpenDialog(false);
                navigate("/profile");
              }}
              color="primary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {onLoading && <LoadingScreen />}
    </>
  );
}

export default Booking;
