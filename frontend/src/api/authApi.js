import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export const loginUser = async ({ id, password }) => {
  const response = await API.post("/auth/login", { id, password });
  return response.data;
};

export const registerUser = async ({ name, email, id, password }) => {
  const response = await API.post("/auth/register", { name, email, id, password });
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.post("/auth/logout");
  return response.data;
};