import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookmarks: [],
  loading: false,
  error: null,
};

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    setBookmarks(state, action) {
      state.bookmarks = action.payload;
    },
    addBookmark(state, action) {
      state.bookmarks.unshift(action.payload);
    },
    removeBookmarkById(state, action) {
      state.bookmarks = state.bookmarks.filter(
        (bookmark) => bookmark.id !== action.payload
      );
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    toggleBookmarkByPostId(state, action) {
      const postId = action.payload;
      const existing = state.bookmarks.find((b) => b.postId === postId);
      if (existing) {
        state.bookmarks = state.bookmarks.filter((b) => b.postId !== postId);
      } else {
        state.bookmarks.unshift({ postId });
      }
    },
  },
});

export const {
  setBookmarks,
  addBookmark,
  removeBookmarkById,
  setLoading,
  setError,
  toggleBookmarkByPostId,
} = bookmarkSlice.actions;

export default bookmarkSlice.reducer;
