import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  followers: [],
  following: [],
  loading: false,
  error: null,
};

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    setFollowers(state, action) {
      state.followers = action.payload;
    },
    setFollowing(state, action) {
      state.following = action.payload;
    },

    followUserSuccess(state, action) {
      const userId = action.payload;
      if (!state.following.includes(userId)) {
        state.following.push(userId);
      }
    },

    unfollowUserSuccess(state, action) {
      const userId = action.payload;
      state.following = state.following.filter((id) => id !== userId);
    },

    setFollowLoading(state, action) {
      state.loading = action.payload;
    },
    setFollowError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setFollowers,
  setFollowing,
  followUserSuccess,
  unfollowUserSuccess,
  setFollowLoading,
  setFollowError,
} = followSlice.actions;

export default followSlice.reducer;
