import axios from "axios";
// Dev: empty string => same-origin requests, Vite proxy forwards to localhost:8080 (avoids CORS)
export const baseURL = (
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "" : "https://chatbackend-v21r.onrender.com")
).replace(/\/+$/, "");
export const httpclient = axios.create({
    baseURL: baseURL
});
httpclient.interceptors.request.use((config) => {
  // Skip adding token for login or register endpoints
  if (
    config.url.includes("/auth/login") ||
    config.url.includes("/auth/register")
  ) {
    return config;
  }
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// RESPONSE: 401 = token invalid → auto logout
httpclient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";   // login page par bhej do
    }
    return Promise.reject(error);
  }
);

// Axios is js library for http request send from client/browser