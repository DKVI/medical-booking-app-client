import axiosInstance from "./axios.config";

const patientApi = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get("/patient");
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
  getById: async (id) => {
    try {
      const res = await axiosInstance.get(`/patient/${id}`);
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
};

export default patientApi;
