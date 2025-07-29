import { getCommentsByPost } from "@/api/commentService";
import { getLikes } from "@/api/likeService";
import { Bookmark, BookmarkCheck, Heart, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import PostModal from "@/components/PostModal";

function HoverPostCard({ post, isBookmarked, onBookmarkToggle }) {
  const [data, setData] = useState({ likes: null, comments: null });
  const [hover, setHover] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch stats on hover
  useEffect(() => {
    if (!hover || fetched) return;
    refreshPostStats();
  }, [hover, fetched]);

  const refreshPostStats = async () => {
    try {
      const [likesRes, commentsRes] = await Promise.all([
        getLikes(post.id),
        getCommentsByPost(post.id),
      ]);
      setData({
        likes: Array.isArray(likesRes.data) ? likesRes.data.length : 0,
        comments: Array.isArray(commentsRes.data) ? commentsRes.data.length : 0,
      });
      setFetched(true);
    } catch (error) {
      console.error("Failed to fetch post stats:", error);
    }
  };

  const handleModalClose = async () => {
    setShowModal(false);
    await refreshPostStats();
  };

  return (
    <>
      <div
        className="relative group cursor-pointer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setShowModal(true)}
      >
        <img
          src={`${BASE_URL}${post.mediaUrl}`}
          alt="post"
          className="w-full aspect-square object-cover rounded-sm"
        />

        {hover && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white transition-all">
            <div className="flex gap-4 mb-2 text-sm font-medium">
              <span className="flex items-center gap-1">
                <Heart size={20} />{" "}
                {data.likes !== null ? (
                  data.likes
                ) : (
                  <span className="animate-pulse">...</span>
                )}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={20} />{" "}
                {data.comments !== null ? (
                  data.comments
                ) : (
                  <span className="animate-pulse">...</span>
                )}
              </span>
              <button
                className="p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmarkToggle();
                }}
              >
                {isBookmarked ? (
                  <BookmarkCheck size={20} />
                ) : (
                  <Bookmark size={20} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && <PostModal post={post} onClose={handleModalClose} />}
    </>
  );
}

export default HoverPostCard;
