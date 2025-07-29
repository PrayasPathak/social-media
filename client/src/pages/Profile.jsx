import {
  bookmarkPost,
  getUserBookmarks,
  removeBookmark,
} from "@/api/bookmarkService";
import { getFollowers, getFollowing } from "@/api/followService";
import { getAllPosts } from "@/api/postService";
import { getProfile, getProfileByUserId } from "@/api/profileService";
import { deleteUser, getUserById } from "@/api/userService";
import HoverPostCard from "@/components/HoverPostCard";
import { Button } from "@/components/ui/button";
import { clearAuth } from "@/redux/authSlice";
import {
  setBookmarks,
  toggleBookmarkByPostId,
  setLoading as setBookmarkLoading,
  setError as setBookmarkError,
} from "@/redux/bookmarkSlice";
import { setPostError, setPostLoading, setPosts } from "@/redux/postSlice";
import {
  setProfile,
  setProfileError,
  setProfileLoading,
} from "@/redux/profileSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { AtSign, Badge } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState("posts");
  const [profileUser, setProfileUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { data, error } = await deleteUser();
      if (data) {
        toast.success("Account deleted successfully");
        dispatch(clearAuth());
        navigate("/login");
      } else {
        toast.error(error || "Failed to delete account");
      }
    } catch (error) {
      toast.error(error.message || "Error deleting account");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <p className="text-center py-10">Loading profile...</p>;
  if (error)
    return <p className="text-center text-red-500 py-10">{error.message}</p>;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Profile Info Section */}
        <div className="lg:w-1/3 flex flex-col items-center lg:items-start">
          <Avatar className="h-32 w-32 mb-4">
            <AvatarImage src={`${BASE_URL}${userProfile?.profilePicture}`} />
            <AvatarFallback>GR</AvatarFallback>
          </Avatar>

          <h1 className="text-2xl font-bold">
            {profileUser?.fullName || "Unnamed"}
          </h1>

          {isLoggedInUserProfile && (
            <div className="mt-4 flex gap-2">
              <Link to="/account/edit">
                <Button>Edit profile</Button>
              </Link>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </Button>
            </div>
          )}

          <div className="mt-4 text-center lg:text-left flex gap-6">
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

          <Badge variant="secondary" className="mt-2 inline-flex items-center">
            <AtSign />
            <span className="ml-1">{profileUser?.fullName}</span>
          </Badge>

          <p className="mt-1 text-sm">
            <strong>Email:</strong> {profileUser?.email}
          </p>
        </div>

        {/* Posts Section */}
        <div className="lg:w-2/3">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
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

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-md shadow-lg w-96">
            <h2 className="text-xl mb-4">
              Are you sure you want to delete your account?
            </h2>
            <div className="flex justify-end gap-4">
              <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting} // Disable button while deleting
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
