import axiosInstance from "./axios.config";

const scheduleDetailApi = {
  create: async (body) => {
    try {
      console.log(body);
      const respone = await axiosInstance.post("/schedulingDetail", body);
      return respone.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  },
  getById: async (id) => {
    try {
      const respone = await axiosInstance.get(`/schedulingDetail/${id}`);
      return respone.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  },
};

export default scheduleDetailApi;
