import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "@/api/userService";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Loader2 } from "lucide-react";

const UserSearchDialog = ({ open, setOpen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await searchUsers(searchQuery.trim());
        if (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } else {
          if (Array.isArray(data)) {
            setSearchResults(data);
          } else if (data) {
            setSearchResults([data]);
          } else {
            setSearchResults([]);
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchUsers, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSelectUser = (user) => {
    setOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/profile/${user.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search Users</DialogTitle>
        </DialogHeader>

        <Input
          type="text"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          </div>
        ) : searchResults.length > 0 ? (
          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
            {searchResults.map((user) => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className="cursor-pointer p-2 hover:bg-gray-100 rounded-md flex items-center gap-2"
              >
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src={`${BASE_URL}${user.profilePicture}`}
                    alt="profile"
                  />
                  <AvatarFallback>
                    {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <span>{user?.fullName || "Unnamed User"}</span>
              </div>
            ))}
          </div>
        ) : (
          searchQuery &&
          !loading && (
            <p className="text-center text-sm text-gray-500 mt-4">
              No users found.
            </p>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserSearchDialog;
