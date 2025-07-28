import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AtSign } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

import {
  bookmarkPost,
  getUserBookmarks,
  removeBookmark,
} from "@/api/bookmarkService";
import { getAllPosts } from "@/api/postService";
import { getProfile, getProfileByUserId } from "@/api/profileService";
import { getUserById } from "@/api/userService";
import HoverPostCard from "@/components/HoverPostCard";
import {
  setError as setBookmarkError,
  setLoading as setBookmarkLoading,
  setBookmarks,
  toggleBookmarkByPostId,
} from "@/redux/bookmarkSlice";
import { setPostError, setPostLoading, setPosts } from "@/redux/postSlice";
import {
  setProfile,
  setProfileError,
  setProfileLoading,
} from "@/redux/profileSlice";
import { getFollowers, getFollowing } from "@/api/followService";
import { toast } from "sonner";

const Profile = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("posts");
  const [profileUser, setProfileUser] = useState(null);

  const {
    profile: userProfile,
    loading,
    error,
  } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);
  const { posts: allPosts } = useSelector((state) => state.post);
  const { bookmarks } = useSelector((state) => state.bookmark);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const isLoggedInUserProfile = !userId || parseInt(userId) === user?.id;

  // Fetch user profile
  useEffect(() => {
    (async () => {
      dispatch(setProfileLoading(true));
      const { data, error } = isLoggedInUserProfile
        ? await getProfile()
        : await getProfileByUserId(userId);

      if (data) dispatch(setProfile(data));
      else dispatch(setProfileError(error || "Failed to load profile"));
      dispatch(setProfileLoading(false));
    })();
  }, [dispatch, isLoggedInUserProfile, userId]);

  // Fetch user details
  useEffect(() => {
    (async () => {
      if (!userProfile?.userId) return;
      const { data, error } = await getUserById(userProfile.userId);
      if (data) setProfileUser(data);
      else console.error("Unable to fetch user details", error);
    })();
  }, [userProfile?.userId]);

  // Fetch followers info
  useEffect(() => {
    const fetchFollows = async () => {
      if (!userProfile?.userId) return;
      const [followersRes, followingRes] = await Promise.all([
        getFollowers(userProfile.userId),
        getFollowing(userProfile.userId),
      ]);

      if (followersRes.data) setFollowerCount(followersRes.data.length);
      if (followingRes.data) setFollowingCount(followingRes.data.length);
    };

    fetchFollows();
  }, [userProfile?.userId]);

  // Fetch posts
  useEffect(() => {
    (async () => {
      if (!user?.id) return;
      dispatch(setPostLoading(true));
      const { data, error } = await getAllPosts();
      if (data) dispatch(setPosts(data));
      else dispatch(setPostError(error || "Failed to load posts"));
      dispatch(setPostLoading(false));
    })();
  }, [dispatch, user?.id]);

  // Fetch bookmarks (only for logged-in user)
  useEffect(() => {
    (async () => {
      if (!user?.id) return;
      dispatch(setBookmarkLoading(true));
      const { data, error } = await getUserBookmarks();
      if (data) dispatch(setBookmarks(data));
      else dispatch(setBookmarkError(error || "Failed bookmarks"));
      dispatch(setBookmarkLoading(false));
    })();
  }, [dispatch, user?.id]);

  // Ensure activeTab is "posts" for other users' profiles
  useEffect(() => {
    if (!isLoggedInUserProfile && activeTab === "saved") {
      setActiveTab("posts");
    }
  }, [isLoggedInUserProfile, activeTab]);

  const displayedPost =
    activeTab === "posts"
      ? allPosts.filter((p) => p.userId === userProfile?.userId)
      : bookmarks
          .map((b) => allPosts.find((p) => p.id === b.postId))
          .filter(Boolean);

  const handleToggleBookmark = async (postId) => {
    const exists = bookmarks.some((b) => b.postId === postId);
    if (exists) {
      await removeBookmark(postId);
      toast.success("Bookmark removed");
    } else {
      await bookmarkPost(postId);
      toast.success("Bookmark added");
    }
    dispatch(toggleBookmarkByPostId(postId));
  };

  if (loading) return <p className="text-center py-10">Loading profile...</p>;
  if (error)
    return <p className="text-center text-red-500 py-10">{error.message}</p>;

  return (
    <div className="mx-auto max-w-5xl flex justify-center pl-10">
      <div className="flex flex-col gap-20 p-8">
        {/* HEADER */}
        <div className="grid grid-cols-2 gap-8">
          <Avatar className="h-32 w-32">
            <AvatarImage src={userProfile?.profilePicture} />
            <AvatarFallback>GR</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl">{profileUser?.fullName || "Unnamed"}</h1>

            {isLoggedInUserProfile && (
              <div className="mt-2 flex gap-2">
                <Link to="/account/edit">
                  <Button>Edit profile</Button>
                </Link>
                <Button variant="destructive">Delete Account</Button>
              </div>
            )}

            <div className="mt-3 flex gap-6">
              <div>
                <strong>
                  {
                    allPosts.filter((p) => p.userId === userProfile?.userId)
                      .length
                  }
                </strong>{" "}
                posts
              </div>
              <div>
                <strong>{followerCount}</strong> followers
              </div>
              <div>
                <strong>{followingCount}</strong> following
              </div>
            </div>

            <p className="mt-4">{userProfile?.bio || "No bio yet."}</p>

            <Badge
              variant="secondary"
              className="mt-2 inline-flex items-center"
            >
              <AtSign />
              <span className="ml-1">{profileUser?.fullName}</span>
            </Badge>

            <p className="mt-1 text-sm">
              <strong>Email:</strong> {profileUser?.email}
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-center gap-10 text-sm">
            <span
              className={`cursor-pointer py-3 ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("posts")}
            >
              POSTS
            </span>

            {isLoggedInUserProfile && (
              <span
                className={`cursor-pointer py-3 ${
                  activeTab === "saved" ? "font-bold" : ""
                }`}
                onClick={() => setActiveTab("saved")}
              >
                SAVED
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1 mt-4">
            {displayedPost.length === 0 ? (
              <p className="col-span-3 py-10 text-center text-gray-500">
                {activeTab === "posts"
                  ? "No posts yet."
                  : "No bookmarks found."}
              </p>
            ) : (
              displayedPost.map((post) => (
                <HoverPostCard
                  key={post.id}
                  post={post}
                  isBookmarked={bookmarks.some((b) => b.postId === post.id)}
                  onBookmarkToggle={() => handleToggleBookmark(post.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
