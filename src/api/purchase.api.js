import axiosInstance from "./axios.config";

const purchaseApi = {
  getBySchedulingDetailId: async (schedulingDetailId) => {
    try {
      console.log(schedulingDetailId);
      const res = await axiosInstance.post("/purchase", {
        schedulingDetailId,
      });
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
  getAll: async () => {
    try {
      const res = await axiosInstance.get("/purchase");
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
  approve: async (schedulingDetailId) => {
    try {
      const res = await axiosInstance.post(`/purchase/approve`, {
        schedulingDetailId,
      });
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
};

export default purchaseApi;
