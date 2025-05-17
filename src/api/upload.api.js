import axiosInstance from "./axios.config";

const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  // Nếu cần token:
  // const token = localStorage.getItem("token");

  const response = await axiosInstance.post(
    "/patient/upload-avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export default uploadAvatar;
