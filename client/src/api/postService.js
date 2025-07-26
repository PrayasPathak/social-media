import axiosInstance from "./axiosInstance";
import { parseApiError } from "../utils/errorHandler";

export async function getAllPosts() {
  try {
    const response = await axiosInstance.get("/posts");
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function getPostById(postId) {
  try {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function createPost({ caption, mediaFile }) {
  try {
    const formData = new FormData();
    if (caption) formData.append("caption", caption);
    if (mediaFile) formData.append("media", mediaFile);

    const response = await axiosInstance.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function updatePost(postId, { caption, mediaFile }) {
  try {
    const formData = new FormData();
    if (caption) formData.append("caption", caption);
    if (mediaFile) formData.append("media", mediaFile);

    const response = await axiosInstance.put(`/posts/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function deletePost(postId) {
  try {
    await axiosInstance.delete(`/posts/${postId}`);
    return { data: "Deleted successfully" };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}
