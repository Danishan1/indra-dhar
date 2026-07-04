import axios from "axios";

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

// Create a pre-configured axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:5000/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const original = error.config;

//     if (error.response?.status === 401 && !original._retry) {
//       original._retry = true;

//       try {
//         const res = await api.get("/auth/refresh");

//         if (res.success) {
//           setAccessToken(res.accessToken);
//           original.headers.Authorization = `Bearer ${res.accessToken}`;
//           return api(original);
//         }
//       } catch (err) {
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   },
// );

// Generic helper methods
export const apiUtil = {
  get: (endpoint, params = {}) =>
    api.get(endpoint, { params }).then((r) => r.data),

  post: (endpoint, data = {}, config = {}) =>
    api.post(endpoint, data, config).then((r) => r.data),

  put: (endpoint, data = {}) => api.put(endpoint, data).then((r) => r.data),

  delete: (endpoint) => api.delete(endpoint).then((r) => r.data),
};

export { api };
