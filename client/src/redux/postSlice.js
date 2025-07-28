import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload
        .filter((p) => p !== null && p !== undefined)
        .reverse();
      state.loading = false;
      state.error = null;
    },
    addPost(state, action) {
      state.posts.unshift(action.payload);
    },
    updatePost(state, action) {
      const updatedPost = action.payload;
      const index = state.posts.findIndex((post) => post.id === updatedPost.id);
      if (index !== -1) {
        state.posts[index] = updatedPost;
      }
    },
    deletePost(state, action) {
      const postId = action.payload;
      state.posts = state.posts.filter((post) => post.id !== postId);
    },
    setPostError(state, action) {
      state.error = action.payload;
    },
    setPostLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const {
  setPosts,
  addPost,
  updatePost,
  deletePost,
  setPostError,
  setPostLoading,
} = postSlice.actions;

export default postSlice.reducer;
