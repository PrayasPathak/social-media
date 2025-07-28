import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getAllUsers } from "@/api/userService";

const SuggestedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await getAllUsers();

      if (data) {
        const filteredUsers = data.filter((u) => u.id !== currentUser?._id);
        setUsers(filteredUsers);
      } else {
        console.error("Failed to fetch users:", error);
      }

      setLoading(false);
    };

    fetchUsers();
  }, [currentUser?._id]);

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
              <span className="text-gray-600 text-sm">
                {user.bio || "No bio yet"}
              </span>
            </div>
          </div>
          <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]">
            Follow
          </span>
        </div>
      ))}
    </div>
  );
};

export default SuggestedUsers;
