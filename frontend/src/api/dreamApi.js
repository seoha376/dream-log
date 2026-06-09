import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getDreams = (params) => API.get("/api/dreams", { params });
export const getDream = (id) => API.get(`/api/dreams/${id}`);
export const createDream = (data) => API.post("/api/dreams", data);
export const updateDream = (id, data) => API.patch(`/api/dreams/${id}`, data);
export const deleteDream = (id) => API.delete(`/api/dreams/${id}`);
export const toggleFavorite = (id) => API.patch(`/api/dreams/${id}/favorite`);
export const generateSummary = (id) => API.post(`/api/dreams/${id}/summary`);