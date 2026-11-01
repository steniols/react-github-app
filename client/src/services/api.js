import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || "" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tokenGithub");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiUrl = (path) => `${import.meta.env.VITE_API_URL || ""}${path}`;

export default api;
