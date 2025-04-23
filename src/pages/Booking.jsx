import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import authApi from "../api/auth.api";
import { Autocomplete, TextField } from "@mui/material";
import facilityApi from "../api/facility.api";
import specialtyApi from "../api/specialty.api";
import doctorApi from "../api/doctor.api"; // Import API doctor
import WeekdayDatePicker from "../components/WeekdayDatePicker";
import workscheduleApi from "../api/workschedule.api";

function Booking() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [facility, setFacility] = useState([]); // Danh sách facility
  const [selectedFacilityId, setSelectedFacilityId] = useState(null); // ID facility được chọn
  const [specialty, setSpecialty] = useState([]); // Danh sách specialty
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState(null); // ID specialty được chọn
  const [doctor, setDoctor] = useState([]); // Danh sách doctor
  const [selectedDoctorId, setSelectedDoctorId] = useState(null); // ID doctor được chọn
  const [selectedDate, setSelectedDate] = useState(null);
  const [workschedule, setWorkSchedule] = useState([]);
  const [selectedWorkScheduleId, setSelectedWorkScheduleId] = useState(null);
  const verifyUser = async (token) => {
    const res = await authApi.verify(token);
    if (!res.success) {
      navigate("/account");
    }
  };

  const getFacility = async () => {
    try {
      const res = await facilityApi.getAll();
      setFacility(res?.facilities || []); // Đảm bảo facility luôn là một mảng
    } catch (error) {
      console.error("Failed to fetch facilities:", error);
    }
  };

  const getSpecialty = async () => {
    try {
      const res = await specialtyApi.getAll();
      setSpecialty(res || []); // Đảm bảo specialty luôn là một mảng
    } catch (error) {
      console.error("Failed to fetch specialties:", error);
    }
  };

  const getWorkSchedule = async () => {
    try {
      const res = await workscheduleApi.getAll();
      setWorkSchedule(res || []); // Đảm bảo specialty luôn là một mảng
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
    const token = cookies.get("token");
    if (!token) {
      navigate("/account");
    } else {
      verifyUser(token);
    }
    getFacility();
    getSpecialty();
  }, []);

  // Gọi API doctor khi selectedFacilityId và selectedSpecialtyId thay đổi
  useEffect(() => {
    getDoctors();
  }, [selectedFacilityId, selectedSpecialtyId]);

  useEffect(() => {
    getWorkSchedule();
  }, [selectedDoctorId]);
  return (
    <div className="dashboard-container ml-[200px] mt-[80px] w-[calc(100vw-200px)] py-[60px]">
      {/* Autocomplete cho Facility */}
      <Autocomplete
        options={facility}
        getOptionLabel={(option) => option.name || ""}
        value={facility.find((f) => f.id === selectedFacilityId) || null}
        onChange={(event, newValue) => {
          setSelectedFacilityId(newValue?.id || null);
          console.log("Selected Facility ID:", newValue?.id);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Choose Facility" variant="outlined" />
        )}
        sx={{ width: 500, margin: "0 auto", marginBottom: "20px" }}
      />

      {/* Autocomplete cho Specialty */}
      {selectedFacilityId && (
        <Autocomplete
          options={specialty}
          getOptionLabel={(option) => option.name || ""}
          value={specialty.find((s) => s.id === selectedSpecialtyId) || null}
          onChange={(event, newValue) => {
            setSelectedSpecialtyId(newValue?.id || null);
            console.log("Selected Specialty ID:", newValue?.id);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose Specialty"
              variant="outlined"
            />
          )}
          sx={{ width: 500, margin: "0 auto", marginBottom: "20px" }}
        />
      )}

      {/* Autocomplete cho Doctor */}
      {selectedFacilityId && selectedSpecialtyId && (
        <Autocomplete
          options={doctor}
          getOptionLabel={(option) => option.fullname || ""}
          value={doctor.find((d) => d.id === selectedDoctorId) || null}
          onChange={(event, newValue) => {
            setSelectedDoctorId(newValue?.id || null);
            console.log("Selected Doctor ID:", newValue?.id);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Choose Doctor" variant="outlined" />
          )}
          sx={{ width: 500, margin: "0 auto", marginBottom: "20px" }}
        />
      )}
      {selectedDoctorId && selectedFacilityId && selectedSpecialtyId && (
        <WeekdayDatePicker
          onDateChange={(date) => {
            setSelectedDate(date);
          }}
        />
      )}
      {selectedDoctorId && (
        <Autocomplete
          options={workschedule}
          getOptionLabel={(option) => option.times || ""}
          value={
            workschedule.find((w) => w.id === selectedWorkScheduleId) || null
          }
          onChange={(event, newValue) => {
            setSelectedWorkScheduleId(newValue?.id || null);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose Work Schedule"
              variant="outlined"
            />
          )}
          sx={{ width: 500, margin: "0 auto", marginBottom: "20px" }}
        />
      )}
    </div>
  );
}

export default Booking;
