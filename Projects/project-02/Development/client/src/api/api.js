// src/api/axiosInstance.js
import axios from "axios";
import { baseUrl } from "../util/baseUrl";

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// Automatically add Authorization header
api.interceptors.request.use((config) => {
  // const savedAuth = localStorage.getItem("auth");

  // console.log("DDDD", savedAuth);

  // if (savedAuth) {
  //   const { token } = JSON.parse(savedAuth);
  //   if (token) {
  //     config.headers.Authorization = `Bearer ${token}`;
  //   }
  // }
  return config;
});

export { api };
