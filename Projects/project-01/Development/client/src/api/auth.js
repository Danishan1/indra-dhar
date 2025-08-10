import { api } from "./api.js";

export const verifyToken = () => api.get("/auth/verify");
export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/register", data);
