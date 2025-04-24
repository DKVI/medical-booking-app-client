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
};

export default doctorApi;
