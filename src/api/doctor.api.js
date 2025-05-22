import axiosInstance from "./axios.config";

const doctorApi = {
  getAll: async () => {
    try {
      const res = await axiosInstance.get("/doctor");
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
  getByFacilityIdAndSpecialtyId: async (facilityId, specialtyId) => {
    try {
      const res = await axiosInstance.get(
        `/doctor/filter?facilityId=${facilityId}&specialtyId=${specialtyId}`
      );
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
  getById: async (id) => {
    try {
      const res = await axiosInstance.get(`/doctor/${id}`);
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },

  getBySpecialtyId: async (specialtyId) => {
    try {
      const res = await axiosInstance.get(`/doctor?specialtyId=${specialtyId}`);
      return res.data;
    } catch (err) {
      return err.respone?.data || err.message;
    }
  },
  search: async (keyword) => {
    try {
      const res = await axiosInstance.get(`/doctor?keyword=${keyword}`);
      return res.data;
    } catch (err) {
      return err.response?.data || err.message;
    }
  },
  getTotalPatients: async (id) => {
    try {
      const res = await axiosInstance.get(`/doctor/total-patients/${id}`);
      return res.data;
    } catch (err) {
      return err.response?.data || err.message;
    }
  },
  getTotalAppointmentsToday: async (id) => {
    try {
      const res = await axiosInstance.get(
        `/doctor/total-appointments-today/${id}`
      );
      return res.data;
    } catch (err) {
      return err.response?.data || err.message;
    }
  },
  getTotalPatients: async (id) => {
    try {
      const res = await axiosInstance.get(`/doctor/total-patients/${id}`);
      return res.data;
    } catch (err) {
      return err.response?.data || err.message;
    }
  },

  getTotalAppointments: async (id) => {
    try {
      const res = await axiosInstance.get(`/doctor/total-appointments/${id}`);
      return res.data;
    } catch (err) {
      return err.response?.data || err.message;
    }
  },
  getAppointmentsToday: async (id) => {
    try {
      const res = await axiosInstance.get(`/doctor/appointments-today/${id}`);
      return res.data;
    } catch (err) {
      return err.response?.data || err.message;
    }
  },
  getAllAppointments: async (id) => {
    try {
      const res = await axiosInstance.get(`/doctor/appointments/${id}`);
      return res.data;
    } catch (err) {
      return err.response?.data || err.message;
    }
  },
  getAppointmentById: async (id) => {
    try {
      const res = await axiosInstance.get(`/doctor/appointments/detail/${id}`);
      return res.data;
    } catch (err) {
      return err.response?.data || err.message;
    }
  },
};

export default doctorApi;
