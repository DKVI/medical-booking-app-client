import axiosInstance from "./axios.config";

const prescriptionApi = {
  getBySchedulingId: async (id) => {
    try {
      const res = await axiosInstance.get(`/prescription/scheduling/${id}`);
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
};

export default prescriptionApi;
