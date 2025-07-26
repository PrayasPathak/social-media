import axiosInstance from "./axiosInstance";
import { parseApiError } from "../utils/errorHandler";

export async function likePost(postId) {
  try {
    const response = await axiosInstance.post(`/likes/${postId}`);
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function unlikePost(postId) {
  try {
    await axiosInstance.delete(`/likes/${postId}`);
    return { data: "Unliked" };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function getLikes(postId) {
  try {
    const response = await axiosInstance.get(`/likes/${postId}`);
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}
