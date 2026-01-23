import axios from "axios";

const API_BASE_URL = "http://localhost:8080";


// client sans interceptors (pour refresh)
export const rawClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
});
