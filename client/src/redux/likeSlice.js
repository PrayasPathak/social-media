import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likedPosts: [],
};

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    likePost(state, action) {
      if (!state.likedPosts.includes(action.payload)) {
        state.likedPosts.push(action.payload);
      }
    },
    unlikePost(state, action) {
      state.likedPosts = state.likedPosts.filter((id) => id !== action.payload);
    },
    setLikedPosts(state, action) {
      state.likedPosts = action.payload;
    },
  },
});

export const { likePost, unlikePost, setLikedPosts } = likesSlice.actions;
export default likesSlice.reducer;
