import axiosInstance from "./axiosInstance";

export const createPost = async (postData) => {
  const response = await axiosInstance.post("/posts", postData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getFeed = async () => {
  const response = await axiosInstance.get("/posts");
  return response.data;
};

export const fetchPosts = getFeed;

export const deletePost = async (postId) => {
  const response = await axiosInstance.delete(`/posts/${postId}`);
  return response.data;
};

export const toggleLike = async (postId) => {
  const response = await axiosInstance.post(`/posts/${postId}/like`);
  return response.data;
};

export const addComment = async (postId, content) => {
  const response = await axiosInstance.post(`/posts/${postId}/comments`, { content });
  return response.data;
};

export const toggleCommentLike = async (postId, commentId) => {
  const response = await axiosInstance.post(`/posts/${postId}/comments/${commentId}/like`);
  return response.data;
};

export const addCommentReply = async (postId, commentId, content) => {
  const response = await axiosInstance.post(`/posts/${postId}/comments/${commentId}/replies`, { content });
  return response.data;
};
