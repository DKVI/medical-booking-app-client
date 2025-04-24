import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
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
import { motion } from "framer-motion";

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Booking() {
  const cookies = new Cookies();
  const navigate = useNavigate();
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
    const uniqueId = uuidv4();
    setOnLoading(true);
    const body = {
      id: uniqueId,
      doctor_id: selectedDoctorId,
      patient_id: user.patient_id,
      workschedule_id: selectedWorkScheduleId,
      date: selectedDate.format("YYYY-MM-DD"),
    };
    const response = new Promise(async (resolve, reject) => {
      try {
        const res = await scheduleDetailApi.create(body);
        resolve(() => {
          setOnLoading(false);
          setScheduleDetailId(uniqueId);
          return res;
        });
      } catch (err) {
        reject(err);
      }
    });
    setTimeout(() => {
      response
        .then(() => {
          setOnLoading(false);
          setScheduleDetailId(uniqueId);
          setOpenDialog(true);
          setTitle("Notification");
          setBookingId(uniqueId);
          setNotification(
            `Booking successful with ID: ${uniqueId}. Please proceed with payment to confirm your appointment.`
          );
        })
        .catch((err) => err);
    }, 2000);
  };
  const handleDialogClose = (confirm) => {
    setOpenDialog(false);
    if (isFullInfo) {
      if (confirm) {
        navigate(`/checkout?id=${bookingId}`);
      } else {
      }
    } else {
      if (confirm) {
        navigate("/checkout/profile");
      } else {
        navigate("/dashboard");
      }
    }
  };

  const canProceedToNextStep = () => {
    switch (activeStep) {
      case 0: // Bước 1: Chọn Facility
        if (!selectedFacilityId) {
          setErrorMessage("Please select a facility.");
          return false;
        }
        break;
      case 1: // Bước 2: Chọn Specialty
        if (!selectedSpecialtyId) {
          setErrorMessage("Please select a specialty.");
          return false;
        }
        break;
      case 2: // Bước 3: Chọn Doctor
        if (!selectedDoctorId) {
          setErrorMessage("Please select a doctor.");
          return false;
        }
        break;
      case 3: // Bước 4: Chọn Date
        if (!selectedDate) {
          setErrorMessage("Please pick a date.");
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
      {/* AlertDialog */}
      <Dialog
        open={openDialog}
        onClose={() => handleDialogClose(false)}
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
          <Button onClick={() => handleDialogClose(false)} color="primary">
            No
          </Button>
          <Button
            onClick={() => handleDialogClose(true)}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {onLoading && <LoadingScreen />}
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
              value={facility.find((f) => f.id === selectedFacilityId) || null}
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
              marginBottom: "40px", // Thêm khoảng cách dưới Card
              padding: "20px",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Choose Doctor
            </Typography>
            <Autocomplete
              options={doctor}
              getOptionLabel={(option) => option.fullname || ""}
              value={doctor.find((d) => d.id === selectedDoctorId) || null}
              onChange={(event, newValue) => {
                setSelectedDoctorId(newValue?.id || null);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose Doctor"
                  variant="outlined"
                />
              )}
              disabled={!selectedSpecialtyId || doctor.length === 0}
            />
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
        <Button
          style={{ width: "200px" }}
          variant="outlined"
          color="secondary"
          onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
          disabled={activeStep === 0}
        >
          Back
        </Button>

        {/* Nút Next hoặc Confirm */}
        <Button
          style={{ width: "200px", marginTop: "10px" }}
          variant="contained"
          color="primary"
          onClick={() => {
            if (activeStep === steps.length - 1) {
              // Nếu ở bước cuối cùng, gọi hàm onBooking
              onBooking();
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
    </div>
  );
}

export default Booking;
