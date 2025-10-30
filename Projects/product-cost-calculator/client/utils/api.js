import axios from "axios";

// Create a pre-configured axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // optional if using cookies/session auth
});

// Generic helper methods
export const apiUtil = {
  // GET list or single item
  get: async (endpoint, params = {}) => {
    const response = await api.get(endpoint, { params });
    return response.data;
  },

  // POST new record
  post: async (endpoint, data = {}) => {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  // PUT (update existing record)
  put: async (endpoint, data = {}) => {
    const response = await api.put(endpoint, data);
    return response.data;
  },

  // DELETE record
  delete: async (endpoint) => {
    const response = await api.delete(endpoint);
    return response.data;
  },
};

export { api };
