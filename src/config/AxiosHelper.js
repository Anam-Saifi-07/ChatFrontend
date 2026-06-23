import axios from "axios";
export const baseURL = "http://localhost:8080";
export const httpclient = axios.create({
    baseURL: baseURL
    
})

// Axios is js library for http request send from client/browser