import axios from "axios";

const API = axios.create({ // 백엔드 API를 요청하기 위한
  // react page -> axios -> backend api
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000", 
});


// Axios Interceptor
// 한 번 받은 JWT토큰을 매 요청마다 자동으로 헤더에 붙여서 보내도록 설정
// -> backend의 dreamRoutes -> authMiddleware
API.interceptors.request.use((config) => { 
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// front의 dreamApi와 back의 dreamRoutes가 딱 맞닿아있는 구조.
// front에서 호출하는 함수와 back의 REST API를 1대1로 연결.
export const getDreams = (params) => API.get("/api/dreams", { params });
export const getDream = (id) => API.get(`/api/dreams/${id}`);
export const createDream = (data) => API.post("/api/dreams", data);
export const updateDream = (id, data) => API.patch(`/api/dreams/${id}`, data);
export const deleteDream = (id) => API.delete(`/api/dreams/${id}`);
export const toggleFavorite = (id) => API.patch(`/api/dreams/${id}/favorite`);
export const generateSummary = (id) => API.post(`/api/dreams/${id}/summary`);  // ← 추가
