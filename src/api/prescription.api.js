import { id } from "date-fns/locale/id";
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
  createPrescription: async (id, body) => {
    try {
      const res = await axiosInstance.post(`/prescription/${id}`, body);
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
  deletePrescription: async (id) => {
    try {
      const res = await axiosInstance.delete(`/prescription/${id}`);
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
};

export default prescriptionApi;
