import { createSlice } from "@reduxjs/toolkit";
import {
  createComment,
  deleteComment,
  getCommentsByPost,
  updateComment,
} from "@/api/commentService";

const initialState = {
  commentsByPost: {},
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    setCommentLoading(state, action) {
      state.loading = action.payload;
    },
    setCommentError(state, action) {
      state.error = action.payload;
    },
    setCommentsForPost(state, action) {
      const { postId, comments } = action.payload;
      state.commentsByPost[postId] = comments;
      state.error = null;
    },
    addCommentToPost(state, action) {
      const { postId, comment } = action.payload;
      if (!state.commentsByPost[postId]) {
        state.commentsByPost[postId] = [];
      }
      state.commentsByPost[postId].push(comment);
      state.error = null;
    },
    updateCommentInPost(state, action) {
      const { postId, commentId, content } = action.payload;
      const comments = state.commentsByPost[postId];
      if (comments) {
        const index = comments.findIndex((c) => c.id === commentId);
        if (index !== -1) {
          comments[index].content = content;
        }
      }
    },
    deleteCommentFromPost(state, action) {
      const { postId, commentId } = action.payload;
      const comments = state.commentsByPost[postId];
      if (comments) {
        state.commentsByPost[postId] = comments.filter(
          (c) => c.id !== commentId
        );
      }
    },
  },
});

export const {
  setCommentLoading,
  setCommentError,
  setCommentsForPost,
  addCommentToPost,
  updateCommentInPost,
  deleteCommentFromPost,
} = commentSlice.actions;

export default commentSlice.reducer;

export const fetchCommentsForPost = async (dispatch, postId) => {
  dispatch(setCommentLoading(true));
  const res = await getCommentsByPost(postId);
  if (res.error) {
    dispatch(setCommentError(res.error));
  } else {
    dispatch(setCommentsForPost({ postId, comments: res.data }));
  }
  dispatch(setCommentLoading(false));
};

export const createCommentForPost = async (dispatch, postId, content) => {
  dispatch(setCommentLoading(true));
  const res = await createComment(postId, content);
  if (res.error) {
    dispatch(setCommentError(res.error));
  } else {
    dispatch(addCommentToPost({ postId, comment: res.data }));
  }
  dispatch(setCommentLoading(false));
};

export const updateCommentForPost = async (
  dispatch,
  postId,
  commentId,
  content
) => {
  dispatch(setCommentLoading(true));
  const res = await updateComment(commentId, content);
  if (res.error) {
    dispatch(setCommentError(res.error));
  } else {
    dispatch(updateCommentInPost({ postId, commentId, content }));
  }
  dispatch(setCommentLoading(false));
};

export const deleteCommentForPost = async (dispatch, postId, commentId) => {
  dispatch(setCommentLoading(true));
  const res = await deleteComment(commentId);
  if (res.error) {
    dispatch(setCommentError(res.error));
  } else {
    dispatch(deleteCommentFromPost({ postId, commentId }));
  }
  dispatch(setCommentLoading(false));
};
