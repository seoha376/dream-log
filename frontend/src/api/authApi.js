import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

export const registerUser = async ({ name, email, password }) => {
  const response = await API.post("/api/auth/register", {
    username: name,
    email,
    password
  });
  return response.data;
};

export const loginUser = async ({ id, password }) => {
  const response = await API.post("/api/auth/login", {
    email: id,
    password
  });
  localStorage.setItem("token", response.data.data.token); // JWT 토큰 저장
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};