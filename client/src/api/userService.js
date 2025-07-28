import axiosInstance from "./axiosInstance";
import { parseApiError } from "../utils/errorHandler";

export async function getUserById(id) {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function getAllUsers() {
  try {
    const response = await axiosInstance.get("/users");
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function updateUser(id, data) {
  try {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function searchUsers(query) {
  try {
    const response = await axiosInstance.get(`/users/search?query=${query}`);
    return { data: response.data };
  } catch (error) {
    return { error: error.response?.data?.message || "Search failed" };
  }
}

export async function deleteUser() {
  try {
    await axiosInstance.delete("/users/me");
    return { data: "Profile deleted" };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}
