import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken") || "";
  const refreshToken = localStorage.getItem("refreshToken") || "";
  
  config.headers = {
    // Authorization: "Bearer " + auth_token,
    Authorization: 'Bearer ' + accessToken,
      refreshtoken: refreshToken || '',
    // 'Content-Type': 'multipart/form-data',
  };
  return config;
});
export default api;
