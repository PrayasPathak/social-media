import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const UserListModal = ({ users, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-md max-w-md w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">All Users</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between my-5"
            >
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserListModal;
