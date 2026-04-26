import axiosInstance from "./axiosInstance";

export const getMe = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axiosInstance.patch("/auth/update-profile", data);
  return response.data;
};
