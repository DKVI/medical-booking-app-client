import axiosInstance from "./axios.config";

const statisticApi = {
  getByDoctorAndYear: async (id) => {
    try {
      const year = new Date().getFullYear();
      const res = await axiosInstance.post("/statistics/doctor_appointment", {
        id,
        year,
      });
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
};

export default statisticApi;
