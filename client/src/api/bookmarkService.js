import axiosInstance from "./axiosInstance";
import { parseApiError } from "../utils/errorHandler";

export async function bookmarkPost(postId) {
  try {
    const response = await axiosInstance.post("/bookmarks", { postId });
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function removeBookmark(postId) {
  try {
    await axiosInstance.delete(`/bookmarks/${postId}`);
    return { data: "Bookmark removed" };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function getUserBookmarks() {
  try {
    const response = await axiosInstance.get("/bookmarks");
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}
