import axios from "axios";
import { baseUrl } from "../util/baseUrl";


export async function registerUser(data) {
  return axios.post(`${baseUrl}/auth/register`, data);
}

export async function loginUser(data) {
  return axios.post(`${baseUrl}/auth/login`, data);
}
