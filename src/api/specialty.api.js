import axiosInstance from "./axios.config";

const specialtyApi = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get("/specialty");
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
};

export default specialtyApi;
