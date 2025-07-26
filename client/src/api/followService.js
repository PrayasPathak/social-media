import axiosInstance from "./axiosInstance";
import { parseApiError } from "../utils/errorHandler";

export async function followUser(followingId) {
  try {
    const response = await axiosInstance.post("/follow", { followingId });
    return { data: response.data };
  } catch (error) {
    return { error: parseApiError(error) };
  }
}

export async function unfollowUser(followingId) {
  try {
    await axiosInstance.delete(`/follow/${followingId}`);
    return { data: "Unfollowed" };
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
