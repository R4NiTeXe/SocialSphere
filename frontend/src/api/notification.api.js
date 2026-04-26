import axiosInstance from "./axiosInstance";

export const getNotifications = async () => {
  const response = await axiosInstance.get("/notifications");
  return response.data;
};

export const markNotificationsRead = async () => {
  const response = await axiosInstance.patch("/notifications/mark-read");
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await axiosInstance.get("/notifications/unread-count");
  return response.data;
};
