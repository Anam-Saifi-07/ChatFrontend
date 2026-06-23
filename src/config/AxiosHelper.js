import axios from "axios";
export const baseURL = "https://chatbackend-v21r.onrender.com";
export const httpclient = axios.create({
    baseURL: baseURL
    
})

// Axios is js library for http request send from client/browser