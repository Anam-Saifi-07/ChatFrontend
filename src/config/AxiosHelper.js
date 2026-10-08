import axios from "axios";
// export const baseURL = "https://chatbackend-v21r.onrender.com"; // for deployed one backend url
export const baseURL = "http://localhost:8080/"; 
export const httpclient = axios.create({
    baseURL: baseURL
});
httpclient.interceptors.request.use((config) => {
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