import axiosInstance from "./axios.config";

const rateApi = {
  getByDoctorId: async (id) => {
    try {
      const res = await axiosInstance.get(`/rate/${id}`);
      console.log(id);
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
  create: async (body) => {
    try {
      const res = await axiosInstance.post("/rate/", body);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
  getBySchedulingId: async (id) => {
    try {
      const res = await axiosInstance.get(`/rate/scheduling/${id}`);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  },
};

export default rateApi;
