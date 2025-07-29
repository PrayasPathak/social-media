import { getLikes } from "@/api/likeService";
import { deletePost } from "@/api/postService";
import {
  createCommentForPost,
  fetchCommentsForPost,
} from "@/redux/commentSlice";
import { deletePost as deletePostFromStore } from "@/redux/postSlice";
import { Heart, MessageCircle, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "@/api/axiosInstance"; // your axios instance
import { getUserById } from "@/api/userService";

function PostModal({ post, onClose }) {
  const dispatch = useDispatch();

  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const currentUserId = user?.id;
  const isAuthor = post.userId === currentUserId;

  const comments = useSelector(
    (state) => state.comment.commentsByPost[post.id] || []
  );

  // State to store users info keyed by userId
  const [commentUsers, setCommentUsers] = useState({});

  useEffect(() => {
    const fetchLikesCommentsAndUsers = async () => {
      setError("");
      // Fetch likes
      const likesRes = await getLikes(post.id);
      if (likesRes.error) {
        setError("Failed to load likes");
      } else {
        setLikes(Array.isArray(likesRes.data) ? likesRes.data.length : 0);
      }

      // Fetch comments
      await fetchCommentsForPost(dispatch, post.id);

      // After comments fetched, fetch user info for commenters
      const uniqueUserIds = [
        ...new Set(comments.map((comment) => comment.userId)),
      ];

      // Filter out already fetched users
      const newUserIds = uniqueUserIds.filter((id) => !commentUsers[id]);

      if (newUserIds.length > 0) {
        const usersFetched = await Promise.all(
          newUserIds.map((id) => getUserById(id))
        );

        const newUserMap = {};
        newUserIds.forEach((id, idx) => {
          if (usersFetched[idx]) {
            newUserMap[id] = usersFetched[idx];
          }
        });

        setCommentUsers((prev) => ({ ...prev, ...newUserMap }));
      }
    };

    fetchLikesCommentsAndUsers();
  }, [dispatch, post.id, comments.length]);

  // Add comment handler
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    setError("");

    try {
      await createCommentForPost(dispatch, post.id, newComment.trim());
      setNewComment(""); // Clear input
    } catch (err) {
      setError("Failed to add comment.");
    } finally {
      setLoading(false);
    }
  };

  // Delete post handler
  const handleDeletePost = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      const { error } = await deletePost(post.id);
      if (error) throw new Error(error);

      dispatch(deletePostFromStore(post.id));
      onClose();
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-2xl rounded-lg overflow-hidden shadow-xl">
        <div className="relative flex h-[500px]">
          {/* Post Image */}
          <img
            src={`${BASE_URL}${post.mediaUrl}`}
            alt="post"
            className="w-1/2 object-cover"
          />

          {/* Content */}
          <div className="w-1/2 p-4 flex flex-col relative">
            {/* Top-right Controls */}
            <div className="absolute top-2 right-2 flex gap-2">
              {isAuthor && (
                <button
                  onClick={handleDeletePost}
                  className="text-red-500 hover:text-red-700"
                  title="Delete Post"
                >
                  <Trash2 size={20} />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mb-3 items-center mt-6">
              <span className="flex items-center gap-1 text-red-500 text-sm">
                <Heart size={18} /> {likes}
              </span>
              <span className="flex items-center gap-1 text-blue-500 text-sm">
                <MessageCircle size={18} /> {comments.length}
              </span>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto border-t pt-2 pr-1 space-y-3 mb-3">
              {comments.map((comment) => {
                const commenter = comment.user;
                return (
                  <div
                    key={comment.id}
                    className="flex gap-3 items-start border-b pb-2"
                  >
                    {/* Avatar */}
                    <img
                      src={
                        commenter?.profilePicture
                          ? `${BASE_URL}${commenter.profilePicture}`
                          : "/default-avatar.png"
                      }
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />

                    {/* Comment Content */}
                    <div>
                      <div className="text-sm font-medium">
                        {commenter?.fullName || "Unknown User"}
                      </div>
                      <div className="text-sm text-gray-700">
                        {comment.content || (
                          <span className="italic text-gray-400">
                            [No content]
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comment Input */}
            <div className="flex gap-2 mt-auto">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border rounded px-3 py-1 text-sm"
              />
              <button
                onClick={handleAddComment}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-1 rounded text-sm disabled:opacity-60"
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>

            {/* Error */}
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostModal;
