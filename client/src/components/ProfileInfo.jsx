import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AtSign } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileInfo = ({
  BASE_URL,
  userProfile,
  profileUser,
  isLoggedInUserProfile,
  allPosts,
  followerCount,
  followingCount,
  onDeleteClick,
}) => {
  return (
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
          <Button variant="destructive" onClick={onDeleteClick}>
            Delete Account
          </Button>
        </div>
      )}

      <div className="mt-4 text-center lg:text-left flex gap-6">
        <div>
          <strong>
            {allPosts.filter((p) => p.userId === userProfile?.userId).length}
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

      <p className="mt-4 flex flex-col">
        <span className="font-semibold">Bio: </span>
        <span className="ml-2">{userProfile?.bio || "No bio yet."}</span>
      </p>

      <p className="font-semibold">
        FullName
        <Badge variant="secondary" className="mt-2 inline-flex items-center">
          <AtSign />
          <span className="ml-1">{profileUser?.fullName}</span>
        </Badge>
      </p>

      <p className="mt-1 text-sm">
        <strong>Email</strong> {profileUser?.email}
      </p>
    </div>
  );
};

export default ProfileInfo;
