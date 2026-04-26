import axiosInstance from "./axiosInstance";

export const getConversations = async () => {
  const response = await axiosInstance.get("/chat/conversations");
  return response.data;
};

export const getMessages = async (userId) => {
  const response = await axiosInstance.get(`/chat/${userId}`);
  return response.data;
};

export const sendMessage = async (receiverId, content) => {
  const response = await axiosInstance.post(`/chat/send/${receiverId}`, { content });
  return response.data;
};
