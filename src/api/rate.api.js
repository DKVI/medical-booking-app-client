import axiosInstance from "./axios.config";

const rateApi = {
  getByDoctorId: async (id) => {
    try {
      const res = await axiosInstance.get(`/rate/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
  getAverRateByDoctorId: async (id) => {
    try {
      const res = await axiosInstance.get(`/rate/aver/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
  getAll: async () => {
    try {
      const res = await axiosInstance.get(`/rate/`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
};

export default rateApi;
