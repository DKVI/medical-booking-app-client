import axiosInstance from "./axios.config";

const facilityApi = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get("/facility");
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
  getById: async (id) => {
    try {
      const res = await axiosInstance.get(`/facility/${id}`);
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
};

export default facilityApi;
