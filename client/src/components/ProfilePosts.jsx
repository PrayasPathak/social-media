import { useState } from "react";
import { Button } from "@/components/ui/button";
import HoverPostCard from "@/components/HoverPostCard";

const ProfilePosts = ({
  bookmarks,
  allPosts,
  userProfile,
  isLoggedInUserProfile,
  onToggleBookmark,
}) => {
  const [activeTab, setActiveTab] = useState("posts");

  const displayedPost =
    activeTab === "posts"
      ? allPosts.filter((p) => p.userId === userProfile?.userId)
      : bookmarks
          .map((b) => allPosts.find((p) => p.id === b.postId))
          .filter(Boolean);

  if (!isLoggedInUserProfile && activeTab === "saved") {
    setActiveTab("posts");
  }

  return (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 min-h-[300px]">
          {displayedPost.length === 0 ? (
            <p className="col-span-full py-10 text-center text-gray-500">
              {activeTab === "posts" ? "No posts yet." : "No bookmarks found."}
            </p>
          ) : (
            displayedPost.map((post) => (
              <HoverPostCard
                key={post.id}
                post={post}
                isBookmarked={bookmarks.some((b) => b.postId === post.id)}
                onBookmarkToggle={() => onToggleBookmark(post.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePosts;
