import axiosInstance from "./axios.config";
import mailPattern from "../pattern/mail.pattern";
const emailApi = {
  verifyEmail: async (token, email, username) => {
    const body = {
      to: email,
      email,
      subject: "Verify Medical Booking App Acount",
      body: mailPattern.createAccount(
        username,
        `http://localhost:3000/api/v1/authen/activation/${token}`
      ),
    };
    const res = await axiosInstance.post("/mail/sendEmail", body);
    console.log(res.message);
  },
};

export default emailApi;
