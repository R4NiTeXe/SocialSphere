import axiosInstance from "./axiosInstance";

export const getMe = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axiosInstance.patch("/auth/update-profile", data);
  return response.data;
};

export const getUserProfile = async (username) => {
  const response = await axiosInstance.get(`/users/profile/${username}`);
  return response.data;
};

export const toggleFollow = async (userId) => {
  const response = await axiosInstance.post(`/users/follow/${userId}`);
  return response.data;
};

export const searchUsers = async (query) => {
  const response = await axiosInstance.get(`/users/search?query=${query}`);
  return response.data;
};
