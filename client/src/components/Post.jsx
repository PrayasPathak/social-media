import { MessageCircle, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { FaBookmark, FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import CommentDialog from "./CommentDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

import axiosInstance from "@/api/axiosInstance";
import { getCommentsByPost } from "@/api/commentService";
import { followUser, unfollowUser } from "@/api/followService";
import { getLikes, likePost, unlikePost } from "@/api/likeService";
import { getUserById } from "@/api/userService";

import { toggleBookmarkByPostId } from "@/redux/bookmarkSlice";
import {
  deletePost,
  setPostError,
  setPostLoading,
  updatePost,
} from "@/redux/postSlice";
import { deletePost as deletePostById } from "@/api/postService";

import {
  followUserSuccess,
  setFollowError,
  setFollowLoading,
  unfollowUserSuccess,
} from "@/redux/followSlice";

import { bookmarkPost, removeBookmark } from "@/api/bookmarkService";
import { Link } from "react-router-dom";
import EditPost from "./EditPost";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { following } = useSelector((state) => state.follow);
  const { bookmarks } = useSelector((state) => state.bookmark);

  const [author, setAuthor] = useState(null);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [postLike, setPostLike] = useState(0);
  const [comment, setComment] = useState([]);
  const [editOpen, setEditOpen] = useState(false);

  const isBookmarked = bookmarks.some((b) => b.postId === post.id);
  const isFollowingAuthor = following.includes(post.userId);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch author info
  useEffect(() => {
    (async () => {
      try {
        const res = await getUserById(post.userId);
        if (res?.data) setAuthor(res.data);
      } catch {
        toast.error("Failed to load post author.");
      }
    })();
  }, [post.userId]);

  // Fetch likes & comments
  useEffect(() => {
    (async () => {
      if (!post?.id) return;
      try {
        const [likesRes, commentsRes] = await Promise.all([
          getLikes(post.id),
          getCommentsByPost(post.id),
        ]);
        if (Array.isArray(likesRes.data)) {
          setPostLike(likesRes.data[0]?.likeCount || 0);
          const likedByUser = likesRes.data.some(
            (like) => like.userId === user.id && like.postId === post.id
          );
          setLiked(likedByUser);
        }
        if (Array.isArray(commentsRes.data)) {
          setComment(commentsRes.data);
        }
      } catch {
        toast.error("Failed to fetch post stats.");
      }
    })();
  }, [post.id, user.id]);

  const handleLikeToggle = async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setPostLike((count) => count + (nextLiked ? 1 : -1));

    const res = nextLiked ? await likePost(post.id) : await unlikePost(post.id);

    if (res?.error) {
      setLiked(!nextLiked);
      setPostLike((count) => count - (nextLiked ? 1 : -1));
      toast.error(res.error || "Failed to update like");
    } else {
      toast.success(nextLiked ? "Liked" : "Unliked");
    }
  };

  const handleComment = async () => {
    if (!text.trim()) return;
    try {
      dispatch(setPostLoading(true));
      const res = await axiosInstance.post(`/comments/${post.id}`, { text });
      const newComment = res.data.comment;
      dispatch(
        updatePost({
          ...post,
          comments: [...(post.comments || []), newComment],
        })
      );
      setComment((c) => [...c, newComment]);
      setText("");
      toast.success("Comment added");
    } catch (err) {
      dispatch(setPostError("Failed to comment"));
      toast.error(err.response?.data?.message || "Failed to add comment");
    } finally {
      dispatch(setPostLoading(false));
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      if (isBookmarked) {
        await removeBookmark(post.id);
        dispatch(toggleBookmarkByPostId(post.id));
        toast.success("Bookmark removed");
      } else {
        await bookmarkPost(post.id);
        dispatch(toggleBookmarkByPostId(post.id));
        toast.success("Post bookmarked");
      }
    } catch {
      toast.error("Bookmark action failed");
    }
  };

  const handleFollowToggle = async () => {
    if (!author?.id) return toast.error("Author not loaded");
    const nextFollow = !isFollowingAuthor;
    dispatch(setFollowLoading(true));
    const res = nextFollow
      ? await followUser(author.id)
      : await unfollowUser(author.id);
    if (res?.error) {
      dispatch(setFollowError(res.error));
      toast.error(res.error || "Failed to follow");
    } else {
      dispatch(
        nextFollow
          ? followUserSuccess(author.id)
          : unfollowUserSuccess(author.id)
      );
      toast.success(nextFollow ? "Followed" : "Unfollowed");
      try {
        const fresh = await getUserById(author.id);
        if (fresh?.data) setAuthor(fresh.data);
      } catch (err) {
        console.log(err);
      }
    }
    dispatch(setFollowLoading(false));
  };

  // Delete post
  const handleDeletePost = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      const res = await deletePostById(post.id);
      if (res.error) {
        throw new Error(res.error);
      }

      dispatch(deletePost(post.id));
      toast.success("Post deleted");

      setOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to delete post");
    }
  };

  if (!author)
    return <div className="text-gray-500 text-center my-4">Loading post…</div>;

  return (
    <div className="max-w-sm mx-auto my-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={`${BASE_URL}${author.profilePicture}`} />
            <AvatarFallback>
              {author.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <Link to={`/profile/${author.id}`}>
              <h1>{author.fullName}</h1>
            </Link>
            {user.id === author.id && <Badge variant="secondary">Author</Badge>}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="text-center text-sm flex flex-col items-center">
            {author.id !== user.id && (
              <Button
                variant="ghost"
                className="text-[#ED4956]"
                onClick={handleFollowToggle}
              >
                {isFollowingAuthor ? "Unfollow" : "Follow"}
              </Button>
            )}
            {user.id === author.id && (
              <>
                <Button
                  variant="ghost"
                  className="hover:bg-red-600 hover:text-white cursor-pointer"
                  onClick={handleDeletePost}
                >
                  Delete
                </Button>
                <Button
                  variant="ghost"
                  className="hover:bg-blue-600 hover:text-white cursor-pointer"
                  onClick={() => setEditOpen(true)}
                >
                  Edit
                </Button>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Media */}
      <img
        src={`${BASE_URL}${post.mediaUrl}`}
        alt="post"
        className="w-full aspect-square object-cover rounded-sm my-2"
      />

      {/* Actions */}
      <div className="flex justify-between items-center my-2">
        <div className="flex gap-3">
          {liked ? (
            <FaHeart
              onClick={handleLikeToggle}
              size={24}
              className="cursor-pointer text-red-600"
            />
          ) : (
            <FaRegHeart
              onClick={handleLikeToggle}
              size={22}
              className="cursor-pointer hover:text-gray-600"
            />
          )}
          <MessageCircle
            onClick={() => setOpen(true)}
            className="cursor-pointer hover:text-gray-600"
          />
        </div>
        {isBookmarked ? (
          <FaBookmark
            onClick={handleBookmarkToggle}
            className="cursor-pointer text-blue-600"
          />
        ) : (
          <FaRegBookmark
            onClick={handleBookmarkToggle}
            className="cursor-pointer hover:text-gray-600"
          />
        )}
      </div>

      <span className="font-medium block mb-2">{postLike} likes</span>

      <p>
        <span className="font-medium mr-2">{author.fullName}</span>
        {post.caption}
      </p>

      {comment.length > 0 && (
        <span
          onClick={() => setOpen(true)}
          className="text-gray-400 text-sm cursor-pointer"
        >
          View all {comment.length} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} selectedPost={post} />

      {/* Add comment input */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            onClick={handleComment}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>

      <EditPost open={editOpen} setOpen={setEditOpen} post={post} />
    </div>
  );
};

export default Post;
