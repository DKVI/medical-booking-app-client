import axiosInstance from "./axios.config";

const workscheduleApi = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get("/workschedule");
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
};

export default workscheduleApi;
