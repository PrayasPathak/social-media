import axiosInstance from "./axiosInstance";
import { parseApiError } from "../utils/errorHandler";

export async function getProfile() {
  try {
    const response = await axiosInstance.get("/profiles/me");
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function updateProfile({ bio, imageFile }) {
  try {
    const formData = new FormData();
    if (bio) formData.append("bio", bio);
    if (imageFile) formData.append("image", imageFile);

    const response = await axiosInstance.put("/profiles/me", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function deleteProfile() {
  try {
    await axiosInstance.delete("/profiles/me");
    return { data: "Profile deleted" };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function getProfileByUserId(userId) {
  try {
    const response = await axiosInstance.get(`/profiles/${userId}`);
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}
