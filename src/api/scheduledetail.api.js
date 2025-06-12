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
  getAll: async () => {
    try {
      const respone = await axiosInstance.get(`/schedulingDetail/`);
      return respone.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  },
  getByPatientId: async (id) => {
    try {
      const respone = await axiosInstance.get(
        `/schedulingDetail/patient/${id}`
      );
      return respone.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  },
  checkExpired: async (id, body) => {
    try {
      const respone = await axiosInstance.post(
        `schedulingDetail/check-expired/${id}`,
        body
      );
      return respone.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  },
  markAsDone: async (id) => {
    try {
      const res = await axiosInstance.put(
        `schedulingDetail/mark-as-done/${id}`
      );
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
  markAsInprocess: async (id) => {
    try {
      const res = await axiosInstance.put(
        `schedulingDetail/mark-as-inprocess/${id}`
      );
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
};

export default scheduleDetailApi;
