import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getAllUsers } from "@/api/userService";
import { followUser, unfollowUser } from "@/api/followService";
import { followUserSuccess, unfollowUserSuccess } from "@/redux/followSlice";
import { toast } from "sonner";

const SuggestedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useSelector((state) => state.auth);
  const { following } = useSelector((state) => state.follow);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await getAllUsers();

      if (data) {
        console.log(currentUser);
        const filteredUsers = data.filter((u) => u.id !== currentUser?.id);
        setUsers(filteredUsers);
      } else {
        console.error("Failed to fetch users:", error);
      }

      setLoading(false);
    };

    fetchUsers();
  }, [currentUser?.id]);

  const handleFollow = async (userId) => {
    try {
      const { data } = await followUser(userId);

      if (data) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isFollowed: true } : user
          )
        );
        dispatch(followUserSuccess(userId));

        toast.success("Followed successfully!");
      }
    } catch (error) {
      console.error("Follow failed", error);
      toast.error("Failed to follow user.");
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      const { data } = await unfollowUser(userId);

      if (data) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, isFollowed: false } : user
          )
        );
        dispatch(unfollowUserSuccess(userId));
        toast.success("Unfollowed successfully!");
      }
    } catch (error) {
      console.error("Unfollow failed", error);
      toast.error("Failed to unfollow user.");
    }
  };

  if (loading)
    return <p className="text-sm text-gray-500 mt-4">Loading suggestions...</p>;

  if (users.length === 0)
    return (
      <p className="text-sm text-gray-500 mt-4">No suggestions available.</p>
    );

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm gap-3">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>

      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between my-5">
          <div className="flex items-center gap-2">
            <Link to={`/profile/${user.id}`}>
              <Avatar>
                <AvatarImage src={user.profilePicture} alt="avatar" />
                <AvatarFallback>
                  {user.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h1 className="font-semibold text-sm">
                <Link to={`/profile/${user.id}`}>{user.fullName}</Link>
              </h1>
            </div>
            <span
              className={`${
                following.includes(user.id)
                  ? "text-[#FF4D4D]"
                  : "text-[#3BADF8]"
              } text-xs font-bold cursor-pointer hover:text-[#3495d6]`}
              onClick={() =>
                following.includes(user.id)
                  ? handleUnfollow(user.id)
                  : handleFollow(user.id)
              }
            >
              {following.includes(user.id) ? "Unfollow" : "Follow"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUsers;
