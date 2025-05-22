import axiosInstance from "./axios.config";

const medicinceApi = {
  getAll: async () => {
    try {
      const result = await axiosInstance.get("/medicine");
      return result.data;
    } catch (err) {
      console.log(err);
    }
  },
};

export default medicinceApi;
