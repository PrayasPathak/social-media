import { getCommentsByPost } from "@/api/commentService";
import { getLikes } from "@/api/likeService";
import { Bookmark, BookmarkCheck, Heart, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

function HoverPostCard({ post, isBookmarked, onBookmarkToggle }) {
  const [data, setData] = useState({
    likes: null,
    comments: null,
  });
  const [hover, setHover] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!hover) return;
    (async () => {
      const likesRes = await getLikes(post.id);
      const commentsRes = await getCommentsByPost(post.id);
      setData({
        likes: Array.isArray(likesRes.data) ? likesRes.data.length : 0,
        comments: Array.isArray(commentsRes.data) ? commentsRes.data.length : 0,
      });
    })();
  }, [hover, post.id]);

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img
        src={`${BASE_URL}${post.mediaUrl}`}
        alt="post"
        className="w-full aspect-square object-cover rounded-sm"
      />
      {hover && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
          <div className="flex gap-4 mb-2">
            <span className="flex items-center gap-1">
              <Heart size={20} /> {data.likes ?? "-"}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={20} /> {data.comments ?? "-"}
            </span>
          </div>
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
      )}
    </div>
  );
}

export default HoverPostCard;
