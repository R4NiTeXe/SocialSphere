import axios from "axios";

// All API calls go through this instance so we always hit the right base URL
const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

// If we have an access token in localStorage, attach it to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
