import axiosInstance from "./axios.config";

const mediaApi = {
  getAll: async () => {
    const response = await axiosInstance.post(
      "/media/upload-avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

export default mediaApi;
