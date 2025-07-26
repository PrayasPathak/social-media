import axiosInstance from "./axiosInstance";
import { parseApiError } from "../utils/errorHandler";

export async function registerUser(data) {
  try {
    const response = await axiosInstance.post("/auth/register", data);
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function loginUser(data) {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    localStorage.setItem("access_token", response.data.accessToken);
    localStorage.setItem("refresh_token", response.data.refreshToken);
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    const response = await axiosInstance.post(
      "/auth/refresh-token",
      {},
      { headers: { Authorization: `Bearer ${refreshToken}` } }
    );
    localStorage.setItem("access_token", response.data.accessToken);
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export function logoutUser() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}
