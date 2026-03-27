import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15000,
});

// ✅ REQUEST
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken") || "";
  const refreshToken = localStorage.getItem("refreshToken") || "";

  if (accessToken) {
    config.headers.Authorization = "Bearer " + accessToken;
  }

  if (refreshToken) {
    config.headers.refreshtoken = refreshToken;
  }

  return config;
});

// ✅ RESPONSE
api.interceptors.response.use(
  (response) => {
    const resData = response?.data;

    // 🔥 HANDLE CUSTOM 401 FROM BACKEND
    if (resData?.status === 401) {
      console.log("🔴 Backend Unauthorized - Logging out");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    return response;
  },
  (error) => {
    console.log("AXIOS ERROR:", error);

    // 🔥 HANDLE REAL HTTP 401 (if backend sends proper status)
    if (error?.response?.status === 401) {
      console.log("🔴 HTTP Unauthorized - Logging out");

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;