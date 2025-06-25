import {
  faCalendarDay,
  faCheckCircle,
  faL,
  faNotesMedical,
  faStar,
  faUser,
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
import { motion } from "framer-motion"; // Import Framer Motion
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import purchaseApi from "../api/purchase.api";
import baseURL from "../api/baseURL.api";
import medicinceApi from "../api/medicine.api";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import prescriptionApi from "../api/prescription.api";
import LoadingScreen from "../components/LoadingScreen"; // Thêm dòng này nếu bạn đã có component này

// Hiệu ứng trượt cho Snackbar

function DetailAppointment() {
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
  const [appointment, setAppointment] = useState(null);
  const [medicine, setMedicine] = useState(null);
  const [rating, setRating] = useState(0); // Thêm state cho rating
  const [openDialog, setOpenDialog] = useState(false); // Thêm state cho Dialog
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [medicineQty, setMedicineQty] = useState(1);
  const [prescribedList, setPrescribedList] = useState([]);
  const [medicalNote, setMedicalNote] = useState(""); // Thêm state cho note sức khỏe
  const [openPrescriptionDialog, setOpenPrescriptionDialog] = useState(false);
  const [prescriptionResult, setPrescriptionResult] = useState([]);
  // State để quản lý nhiều dòng nhập thuốc
  const [prescription, setPrescription] = useState(null);
  const [medicineInputs, setMedicineInputs] = useState([
    { name: null, qty: 1 },
  ]);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const verifyUser = async (token) => {
    const res = await authApi.verify(token);
    if (!res.success) {
      navigate("/account");
    }
  };

  const getDoctorByToken = async (doctorToken) => {
    try {
      const res = await authApi.getDoctorByToken(doctorToken);
      if (res.success) {
        setDoctor(res.doctor);
      } else {
        navigate("/for-doctor/login");
      }
    } catch (err) {
      navigate("/for-doctor/login");
    }
  };

  const getAppointmentById = async (id) => {
    try {
      const res = await doctorApi.getAppointmentById(id);
      setAppointment(res.appointment);
    } catch (err) {
      console.log(err);
    }
  };
  const getPrescription = async (id) => {
    try {
      const res = await prescriptionApi.getBySchedulingId(id);
      setPrescription(res);
      console.log(res);
    } catch (err) {
      setPrescription(null);
      console.log(err);
    }
  };

  const cookie = new Cookies();
  const token = cookie.get("token");

  useEffect(() => {
    getDoctorByToken(token);
    getDetailCheckoutById(id);
    getAppointmentById(id);
    getAllMedicine();
    getPrescription(id);
  }, []);

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
  const getAllMedicine = async () => {
    try {
      const res = await medicinceApi.getAll();
      setMedicine(res.medicines);
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

  // Lấy danh sách tên thuốc từ state medicine
  const medicineOptions = medicine ? medicine.map((m) => m.name) : [];

  // Thêm thuốc vào danh sách
  const handleAddMedicine = () => {
    if (!selectedMedicine || !medicineQty || medicineQty < 1) return;
    setPrescribedList((prev) => [
      ...prev,
      { name: selectedMedicine, quantity: medicineQty },
    ]);
    setSelectedMedicine(null);
    setMedicineQty(1);
  };

  // Thêm dòng nhập mới
  const handleAddInputRow = () => {
    setMedicineInputs([...medicineInputs, { name: null, qty: 1 }]);
  };

  // Xử lý thay đổi Autocomplete hoặc số lượng
  const handleInputChange = (idx, field, value) => {
    const updated = [...medicineInputs];
    updated[idx][field] = value;
    setMedicineInputs(updated);
  };

  // Hàm xóa dòng nhập thuốc
  const handleRemoveInputRow = (idx) => {
    setMedicineInputs((prev) => prev.filter((_, i) => i !== idx));
  };

  // Lưu đơn thuốc (hiện dialog)
  const handleSavePrescription = () => {
    const result = medicineInputs
      .filter((item) => item.name && item.qty > 0)
      .map((item) => {
        const med = medicine?.find((m) => m.name === item.name);
        return {
          id: med?.id || null,
          name: med?.name || item.name,
          dose: med?.dosage || "",
          quantity: item.qty,
        };
      });
    setPrescriptionResult(result);
    setOpenPrescriptionDialog(true);
  };
  const handleCreatePrescription = async () => {
    try {
      await prescriptionApi.createPrescription(id, {
        notes: medicalNote,
        medicines: prescriptionResult,
      });
      await scheduleDetailApi.markAsDone(id);
      setOpenPrescriptionDialog(false);
      setOpenSuccessDialog(true);

      // Reload lại prescription và detail sau khi tạo thành công
      getPrescription(id);
      getDetailCheckoutById(id);

      setTimeout(() => {
        setOpenSuccessDialog(false);
        window.location.reload();
      }, 1800);
    } catch (err) {
      console.log(err);
      setOpenPrescriptionDialog(false);
      setOpenErrorDialog(true);
      setTimeout(() => {
        setOpenErrorDialog(false);
      }, 2000);
    }
  };
  // Xác định trạng thái expired dựa trên ngày/giờ hoặc appointment.status
  const isExpired =
    detailCheckout?.status === "Expired" ||
    appointment?.status === "Expired" ||
    (() => {
      if (!detailCheckout?.date || !workschedule?.times) return false;
      const appointmentDate = new Date(detailCheckout.date);
      const [hour, minute] = workschedule.times.split(":").map(Number);
      appointmentDate.setHours(hour);
      appointmentDate.setMinutes(minute);
      return appointmentDate < new Date();
    })();

  // Cancel prescription handler
  const handleCancelPrescription = async () => {
    setCancelLoading(true);
    try {
      const res1 = await prescriptionApi.deletePrescription(prescription?.id);
      const res2 = await scheduleDetailApi.markAsInprocess(id);
      setOpenCancelDialog(false);
      setCancelLoading(false);
      window.location.reload();
    } catch (err) {
      setCancelLoading(false);
      alert("Failed to cancel prescription. Please try again.");
    }
  };

  return (
    <div>
      <div className="fixed top-0 text-[30px] left-[300px] right-0 py-5 px-10 font-bold text-[var(--base-color)] text-left shadow-2xl bg-white z-20">
        Appointment
      </div>
      <div className="mt-[100px] ml-[300px] py-10 px-[50px] w-[calc(100vw-300px)] min-h-[calc(100vh-100px)] bg-gray-50">
        <div className="flex gap-8">
          {/* Cột trái: Detail Appointment (Doctor + Facility) & Patient */}
          <motion.div
            className="flex-1 flex flex-col gap-6"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            variants={slideUpVariants}
          >
            {/* Detail Appointment (Doctor + Facility) */}
            <motion.div
              className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-[20px] p-[28px] shadow-lg border border-blue-100"
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.2 }}
              variants={slideUpVariants}
            >
              <div className="flex items-center mb-4 gap-3">
                <FontAwesomeIcon
                  icon={faCalendarDay}
                  className="text-blue-400 text-xl"
                />
                <h4 className="text-[22px] font-bold text-[var(--base-color)]">
                  Detail Appointment
                </h4>
                {/* Hiển thị status */}
                {detailCheckout?.status === "Process" && !isExpired && (
                  <span className="px-3 py-1 rounded-full border border-red-500 text-red-600 text-xs font-semibold bg-red-50">
                    In Process
                  </span>
                )}
                {detailCheckout?.status === "Done" && (
                  <span className="px-3 py-1 rounded-full border border-green-500 text-green-600 text-xs font-semibold bg-green-50">
                    Done
                  </span>
                )}
                {(detailCheckout?.status === "Expired" ||
                  appointment?.status === "Expired" ||
                  isExpired) && (
                  <span className="px-3 py-1 rounded-full border border-orange-400 text-orange-600 text-xs font-semibold bg-orange-50">
                    Expired
                  </span>
                )}
              </div>
              <div className="px-[10px] py-2">
                {/* Doctor Info */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-[var(--base-color)]">
                      Doctor:
                    </span>
                    <span className="font-medium text-blue-900">
                      {doctor?.fullname}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-[var(--base-color)]">
                      Specialty:
                    </span>
                    <span className="text-blue-700">{specialty?.name}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-[var(--base-color)]">
                      Date:
                    </span>
                    <span className="text-blue-700">
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
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-[var(--base-color)]">
                      Times:
                    </span>
                    <span className="text-blue-700">{workschedule?.times}</span>
                  </div>
                </div>
                {/* Facility Info */}
                <div className="rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 p-4 shadow border border-blue-200">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-[var(--base-color)]">
                      Facility:
                    </span>
                    <span className="font-medium text-blue-900">
                      {facility?.name}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-[var(--base-color)]">
                      Address:
                    </span>
                    <span className="text-blue-700">{facility?.address}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-[var(--base-color)]">
                      Facility Phone:
                    </span>
                    <span className="text-blue-700">{facility?.phone}</span>
                  </div>
                </div>
              </div>
            </motion.div>
            {/* Patient */}
            <motion.div
              className="bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-[20px] p-[28px] shadow-lg border border-blue-100"
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.3 }}
              variants={slideUpVariants}
            >
              <div className="flex items-center gap-3 mb-4">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-blue-400 text-xl"
                />
                <h4 className="text-[22px] font-bold text-[var(--base-color)]">
                  Patient Information
                </h4>
              </div>
              <div className="px-[10px] py-2">
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={
                      appointment?.avatar
                        ? baseURL + appointment.avatar
                        : "/default-avatar.png"
                    }
                    alt="avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[var(--base-color)] shadow mb-2"
                  />
                  <span className="font-bold text-lg text-blue-900">
                    {appointment?.fullname}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Height</span>
                    <span className="font-semibold text-blue-800">
                      {appointment?.height} kg
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Weight</span>
                    <span className="font-semibold text-blue-800">
                      {appointment?.weight} cm
                    </span>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <span className="text-xs text-gray-500">Phone</span>
                    <span className="font-semibold text-blue-800">
                      {appointment?.phone_no}
                    </span>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <span className="text-xs text-gray-500">Email</span>
                    <span className="font-semibold text-blue-800">
                      {appointment?.email}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          {/* Cột phải: Medical Note giữ nguyên */}
          <motion.div
            className="w-[420px] min-w-[350px] h-fit p-[24px] rounded-[24px] bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow-lg border border-blue-100"
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.5 }}
            variants={slideUpVariants}
          >
            {/* Medical Note Header */}
            <div className="flex items-center gap-3 text-[var(--base-color)] text-[26px] font-extrabold mb-6">
              <FontAwesomeIcon
                icon={faNotesMedical}
                className="text-blue-500"
              />
              <span>Medical Note</span>
              {(detailCheckout?.status === "Expired" ||
                appointment?.status === "Expired" ||
                isExpired) && (
                <span className="ml-2 px-3 py-1 rounded-full border border-orange-400 text-orange-600 text-xs font-semibold bg-orange-50">
                  Expired
                </span>
              )}
            </div>
            {/* Nếu expired thì khóa phần medical note */}
            {detailCheckout?.status === "Expired" ||
            appointment?.status === "Expired" ||
            isExpired ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-orange-400 text-4xl mb-4"
                />
                <p className="text-orange-600 font-bold text-lg mb-2">
                  This appointment has expired.
                </p>
                <p className="text-gray-500 text-center">
                  Patient missed your appointment, so the medical note is
                  locked.
                </p>
              </div>
            ) : // ...phần medical note cũ giữ nguyên...
            prescription &&
              Array.isArray(prescription.medicines) &&
              prescription.medicines.length > 0 ? (
              <>
                <div className="flex flex-col gap-3 mb-6">
                  <label className="block text-left font-semibold text-blue-700 mb-2 text-lg">
                    Medicines List
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {prescription.medicines.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl px-5 py-3 shadow border border-blue-200"
                      >
                        <span className="font-bold text-blue-800 text-base flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-green-500"
                          />
                          {item.name}
                        </span>
                        <span className="text-blue-700 font-semibold">
                          x{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-2">
                  <label className="block text-left font-semibold text-blue-700 mb-2 text-lg">
                    Disease Diagnosis
                  </label>
                  <TextField
                    multiline
                    minRows={3}
                    value={prescription.notes || ""}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    sx={{
                      borderColor: "var(--base-color)",
                      borderRadius: "12px",
                      fontSize: "16px",
                      mb: 2,
                      background: "#f3f8ff",
                    }}
                  />
                </div>
                <div className="flex">
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{
                      m: "auto",
                      borderRadius: 3,
                      fontWeight: "bold",
                      fontSize: 16,
                      px: 4,
                      py: 1.5,
                      borderColor: "#2563eb",
                      color: "#2563eb",
                      background:
                        "linear-gradient(90deg, #e0e7ff 60%, #f0f9ff 100%)",
                      boxShadow: "0 2px 8px 0 rgba(37,99,235,0.10)",
                      letterSpacing: 1,
                      transition: "all 0.2s",
                      "&:hover": {
                        background:
                          "linear-gradient(90deg, #2563eb 60%, #e0e7ff 100%)",
                        color: "#fff",
                        borderColor: "#2563eb",
                      },
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                    onClick={() => setOpenCancelDialog(true)}
                    disabled={cancelLoading}
                    startIcon={
                      <FontAwesomeIcon
                        icon={faNotesMedical}
                        className="text-blue-400"
                      />
                    }
                  >
                    Cancel Prescription
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-3 mb-6">
                  <label className="block text-left font-semibold text-blue-700 mb-2 text-lg">
                    Add Medicines
                  </label>
                  {medicineInputs.map((input, idx) => (
                    <div className="flex gap-2 mb-2 items-center" key={idx}>
                      <Autocomplete
                        disablePortal
                        options={medicine ? medicine.map((m) => m.name) : []}
                        value={input.name || ""}
                        onChange={(_, value) =>
                          handleInputChange(idx, "name", value)
                        }
                        sx={{
                          flex: 2,
                          background: "#fff",
                          borderRadius: "8px",
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Medicine"
                            size="small"
                          />
                        )}
                      />
                      <TextField
                        type="number"
                        label="Qty"
                        size="small"
                        sx={{
                          width: 80,
                          background: "#fff",
                          borderRadius: "8px",
                        }}
                        value={input.qty}
                        inputProps={{ min: 1 }}
                        onChange={(e) =>
                          handleInputChange(idx, "qty", Number(e.target.value))
                        }
                      />
                      <button
                        type="button"
                        className="w-8 h-8 flex items-center justify-center border border-red-400 text-red-500 rounded-full hover:bg-red-100 transition"
                        onClick={() => handleRemoveInputRow(idx)}
                        tabIndex={-1}
                      >
                        <span className="text-xl font-bold">-</span>
                      </button>
                    </div>
                  ))}
                  <button
                    className="w-full border-2 border-blue-500 text-blue-600 font-bold py-2 rounded-xl mb-2 hover:bg-blue-50 transition flex items-center justify-center gap-2"
                    onClick={handleAddInputRow}
                    type="button"
                  >
                    <span className="text-xl font-bold">+</span> Add Medicine
                  </button>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <label className="block text-left font-semibold text-blue-700 mb-2 text-lg">
                    Medicines List
                  </label>
                  {medicineInputs
                    .filter((item) => item.name && item.qty > 0)
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl px-4 py-2 shadow border border-blue-100"
                      >
                        <span className="font-semibold text-blue-800">
                          {item.name}
                        </span>
                        <span className="text-blue-700 font-semibold">
                          x{item.qty}
                        </span>
                      </div>
                    ))}
                </div>
                <div className="mb-4">
                  <label className="block text-left font-semibold text-blue-700 mb-2 text-lg">
                    Disease Diagnosis
                  </label>
                  <TextField
                    multiline
                    minRows={3}
                    placeholder="Enter Disease Diagnosis..."
                    value={medicalNote}
                    onChange={(e) => setMedicalNote(e.target.value)}
                    fullWidth
                    sx={{
                      borderColor: "var(--base-color)",
                      borderRadius: "12px",
                      fontSize: "16px",
                      mb: 2,
                      background: "#fff",
                    }}
                  />
                </div>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    fontWeight: "bold",
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: 18,
                    letterSpacing: 1,
                    background:
                      "linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)",
                  }}
                  onClick={handleSavePrescription}
                >
                  Save Prescription
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </div>
      {/* Dialog hiển thị kết quả đơn thuốc */}
      <Dialog
        open={openPrescriptionDialog}
        onClose={() => setOpenPrescriptionDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          className:
            "rounded-2xl bg-gradient-to-br from-white via-blue-50 to-blue-100 border border-blue-200 shadow-xl",
          style: { padding: 0 },
        }}
      >
        <DialogTitle
          className="!bg-gradient-to-r from-blue-100 to-blue-200 !text-[var(--base-color)] !font-extrabold !text-2xl !rounded-t-2xl !py-4 !px-6 flex items-center gap-3"
          sx={{ borderBottom: "1px solid #dbeafe" }}
        >
          <FontAwesomeIcon
            icon={faNotesMedical}
            className="text-blue-500 text-xl"
          />
          Prescription Details
        </DialogTitle>
        <DialogContent className="!py-6 !px-6">
          <div className="mb-4">
            <strong className="text-blue-700 text-lg">Medical Note:</strong>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 mb-2 mt-2 text-gray-700 font-medium shadow">
              {medicalNote || "No note"}
            </div>
          </div>
          <div>
            <strong className="text-blue-700 text-lg">Medicines:</strong>
            <div className="flex flex-col gap-3 mt-3">
              {prescriptionResult.length === 0 && (
                <div className="text-gray-400">No medicines</div>
              )}
              {prescriptionResult.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row md:justify-between md:items-center bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl px-4 py-3 shadow border border-blue-100"
                >
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="text-green-500"
                    />
                    <span className="font-semibold text-[var(--base-color)] text-base">
                      {item.name}
                    </span>
                    <span className="ml-2 text-gray-600 text-sm">
                      ({item.dose})
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <span className="text-blue-700 font-semibold">
                      x{item.quantity}
                    </span>
                    <span className="ml-2 text-gray-400 text-xs">
                      ID: {item.id ?? "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions className="!px-6 !pb-6 !pt-2 flex gap-3">
          <div className="flex flex-col flex-1 items-start">
            <span className="text-xs text-orange-600 font-semibold mb-2">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="mr-1 text-orange-400"
              />
              After marking as done, you <b>cannot edit</b> this prescription
              anymore.
            </span>
            <div className="flex gap-3 w-full">
              <Button
                variant="contained"
                color="success"
                sx={{
                  fontWeight: "bold",
                  borderRadius: 2,
                  fontSize: 14,
                  px: 3,
                  background:
                    "linear-gradient(90deg, #22c55e 0%, #4ade80 100%)",
                }}
                onClick={handleCreatePrescription}
              >
                Mark as done appointments
              </Button>
              <Button
                onClick={() => setOpenPrescriptionDialog(false)}
                color="inherit"
                sx={{
                  borderRadius: 2,
                  fontSize: 14,
                  px: 3,
                  fontWeight: "bold",
                  background: "#f3f8ff",
                  color: "#2563eb",
                  border: "1px solid #dbeafe",
                  width: "50%",
                  "&:hover": { background: "#e0e7ff" },
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>

      {/* Dialog thông báo thành công */}
      <Dialog
        open={openSuccessDialog}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(120deg, #e3f0ff 0%, #f7fbff 100%)",
            boxShadow: "0 8px 32px 0 rgba(33,150,243,0.15)",
            border: "2px solid #90caf9",
            minWidth: 340,
            textAlign: "center",
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#388e3c",
            fontWeight: "bold",
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            pb: 0,
          }}
        >
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-green-500 mr-2"
          />
          Success
        </DialogTitle>
        <DialogContent
          sx={{
            color: "#388e3c",
            fontWeight: 500,
            fontSize: 18,
            py: 2,
          }}
        >
          Prescription marked as done successfully!
        </DialogContent>
      </Dialog>

      {/* Dialog thông báo lỗi */}
      <Dialog
        open={openErrorDialog}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(120deg, #fff0f0 0%, #ffeaea 100%)",
            boxShadow: "0 8px 32px 0 rgba(244,67,54,0.12)",
            border: "2px solid #ef9a9a",
            minWidth: 340,
            textAlign: "center",
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#d32f2f",
            fontWeight: "bold",
            fontSize: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            pb: 0,
          }}
        >
          <FontAwesomeIcon icon={faCheckCircle} className="text-red-400 mr-2" />
          Error
        </DialogTitle>
        <DialogContent
          sx={{
            color: "#d32f2f",
            fontWeight: 500,
            fontSize: 18,
            py: 2,
          }}
        >
          Failed to mark prescription as done. Please try again later.
        </DialogContent>
      </Dialog>

      {/* Cancel Prescription Dialog */}
      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "linear-gradient(120deg, #fff0f0 0%, #ffeaea 100%)", // Đổi sang tone đỏ nhạt
            boxShadow: "0 8px 32px 0 rgba(244,67,54,0.12)",
            border: "2px solid #ef9a9a",
            minWidth: 340,
            textAlign: "center",
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#d32f2f", // Đỏ nổi bật
            fontWeight: "bold",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            pb: 0,
          }}
        >
          Cancel Prescription
        </DialogTitle>
        <DialogContent
          sx={{
            color: "#d32f2f",
            fontWeight: 500,
            fontSize: 16,
            py: 2,
          }}
        >
          Are you sure you want to cancel this prescription?
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setOpenCancelDialog(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              color: "#d32f2f",
              borderColor: "#d32f2f",
              px: 4,
              "&:hover": { background: "#ffeaea" },
            }}
            disabled={cancelLoading}
          >
            No
          </Button>
          <Button
            onClick={handleCancelPrescription}
            variant="contained"
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              px: 4,
              background: "linear-gradient(90deg, #d32f2f 60%, #ffeaea 100%)",
              color: "#fff",
            }}
            disabled={cancelLoading}
          >
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {cancelLoading && <LoadingScreen />}
    </div>
  );
}

export default DetailAppointment;
