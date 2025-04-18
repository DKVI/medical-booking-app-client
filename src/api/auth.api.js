import axiosInstance from "./axios.config";

const authApi = {
  register: async (data) => {
    try {
      const response = await axiosInstance.post(`/authen/register`, data);
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  },

  login: async (data) => {
    try {
      const response = await axiosInstance.post(`/authen/login`, data);
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  },

  verify: async (token) => {
    try {
      const response = await axiosInstance.get(`/authen/verify/${token}`);
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  },
};

export default authApi;
