import axiosInstance from "./axiosInstance";
import { parseApiError } from "../utils/errorHandler";

export async function followUser(followId) {
  try {
    const response = await axiosInstance.post("/follow", { followId });
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function unfollowUser(followingId) {
  try {
    await axiosInstance.delete(`/follow/${followingId}`);
    return { data: { success: true } };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function getFollowers(userId) {
  try {
    const response = await axiosInstance.get(`/follow/followers/${userId}`);
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function getFollowing(userId) {
  try {
    const response = await axiosInstance.get(`/follow/following/${userId}`);
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}
