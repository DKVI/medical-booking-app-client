import axiosInstance from "./axios.config";
import mailPattern from "../pattern/mail.pattern";
import { BiSolidYinYang } from "react-icons/bi";

const emailApi = {
  verifyEmail: async (token, email, username) => {
    const body = {
      to: email,
      subject: "Verify Medical Booking App Account",
      body: mailPattern.createAccount(
        username,
        `http://localhost:3000/api/v1/authen/activation/${token}`
      ),
    };
    const res = await axiosInstance.post("/mail/sendEmail", body);
    console.log(res.message);
  },
  sendAppointmentConfirmation: async (
    email,
    appointmentNumber,
    address,
    doctorName,
    specialty,
    appointmentDate,
    appointmentTime
  ) => {
    console.log(email);
    const body = {
      to: email,
      subject: "Appointment Confirmation - Medical Booking App",
      html: mailPattern.confirmAppointment(
        appointmentNumber,
        address,
        doctorName,
        specialty,
        appointmentDate,
        appointmentTime,
        email
      ),
    };

    try {
      const res = await axiosInstance.post(
        "/mail/sendEmail",
        JSON.stringify(body), // Body đã stringify
        {
          headers: {
            "Content-Type": "application/json", // Header
          },
        }
      );
      console.log(res.message);
    } catch (err) {
      console.error("Error sending email:", err.response?.data || err.message);
    }
  },
};

export default emailApi;
