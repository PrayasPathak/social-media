import { getLikes, likePost, unlikePost } from "@/api/likeService";
import { deletePost } from "@/api/postService";
import { getUserById } from "@/api/userService";
import {
  createCommentForPost,
  fetchCommentsForPost,
} from "@/redux/commentSlice";
import { deletePost as deletePostFromStore } from "@/redux/postSlice";
import { Heart, MessageCircle, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function PostModal({ post, onClose }) {
  const dispatch = useDispatch();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.id;
  const isAuthor = post.userId === currentUserId;

  const [likes, setLikes] = useState(0);
  const [likedByUser, setLikedByUser] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [commentUsers, setCommentUsers] = useState({});

  const comments = useSelector(
    (state) => state.comment.commentsByPost[post.id] || []
  );

  useEffect(() => {
    const fetchData = async () => {
      setError("");

      const likesRes = await getLikes(post.id);
      if (likesRes.error) {
        setError("Failed to load likes");
      } else {
        const data = likesRes.data || [];
        setLikes(data.length);
        setLikedByUser(data.some((like) => like.userId === currentUserId));
      }

      await fetchCommentsForPost(dispatch, post.id);

      const uniqueUserIds = [
        ...new Set(comments.map((comment) => comment.userId)),
      ];
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

    fetchData();
  }, [dispatch, post.id, comments.length]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    setError("");

    try {
      await createCommentForPost(dispatch, post.id, newComment.trim());
      setNewComment("");
    } catch (err) {
      setError("Failed to add comment.");
    } finally {
      setLoading(false);
    }
  };

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

  const toggleLike = async () => {
    if (!currentUserId) return;

    if (likedByUser) {
      const { error } = await unlikePost(post.id);
      if (!error) {
        setLikes((prev) => prev - 1);
        setLikedByUser(false);
      }
    } else {
      const { error } = await likePost(post.id);
      if (!error) {
        setLikes((prev) => prev + 1);
        setLikedByUser(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-2xl rounded-lg overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row h-full md:h-[500px]">
          {/* Post Image */}
          <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-100">
            <img
              src={`${BASE_URL}${post.mediaUrl}`}
              alt="post"
              className="object-contain max-w-full max-h-[500px] w-auto h-auto rounded-sm"
            />
          </div>

          {/* Content */}
          <div className="w-full md:w-1/2 p-4 flex flex-col relative">
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
              <button
                onClick={toggleLike}
                className={`flex items-center gap-1 text-sm ${
                  likedByUser ? "text-red-500" : "text-gray-400"
                }`}
              >
                <Heart size={18} /> {likes}
              </button>
              <span className="flex items-center gap-1 text-blue-500 text-sm">
                <MessageCircle size={18} /> {comments.length}
              </span>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto border-t pt-2 pr-1 space-y-3 mb-3">
              {comments.map((comment) => {
                const commenter =
                  comment.user || commentUsers[comment.userId] || {};

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
            <div className="flex flex-col md:flex-row gap-2 mt-auto">
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
