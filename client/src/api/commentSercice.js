import axiosInstance from "./axiosInstance";
import { parseApiError } from "../utils/errorHandler";

export async function createComment(postId, content) {
  try {
    const response = await axiosInstance.post(`/comments/${postId}`, {
      content,
    });
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function getCommentsByPost(postId) {
  try {
    const response = await axiosInstance.get(`/comments/post/${postId}`);
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function updateComment(commentId, content) {
  try {
    const response = await axiosInstance.put(`/comments/${commentId}`, {
      content,
    });
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function deleteComment(commentId) {
  try {
    await axiosInstance.delete(`/comments/${commentId}`);
    return { data: "Deleted" };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}
