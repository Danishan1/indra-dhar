// src/api/axiosInstance.js
import axios from "axios";
import { baseUrl } from "../util/baseUrl";

const api = axios.create({
  baseURL: baseUrl,
});

// Automatically add Authorization header
api.interceptors.request.use((config) => {
  const savedAuth = localStorage.getItem("auth");
  if (savedAuth) {
    const { token } = JSON.parse(savedAuth);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export { api };
