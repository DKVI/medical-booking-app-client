import ResetPassword from "../pages/ResetPassword";
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
  loginDoctor: async (data) => {
    try {
      const response = await axiosInstance.post(`/authen/doctor/login`, data);
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

  getByToken: async (token) => {
    try {
      const response = await axiosInstance.get("/authen/getbytoken", {
        headers: {
          Authorization: `Beaer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return error.response?.data || error.message;
    }
  },

  changePassword: async (data) => {
    try {
      const res = await axiosInstance.post("/authen/change-password", data);
      return res.data;
    } catch (err) {
      return err.response?.data || err.message;
    }
  },
  getDoctorByToken: async (token) => {
    try {
      const res = await axiosInstance.get("/authen/doctor/getByToken", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (err) {
      return err.response?.data || err.message;
    }
  },
  ResetPassword: async (data) => {
    try {
      const res = await axiosInstance.put("/authen/reset-password", data);
      return res.data;
    } catch (err) {
      return err.response?.data || err.message;
    }
  },
};

export default authApi;
