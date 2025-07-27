import { setAuthUser } from "@/redux/authSlice";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { logoutUser } from "@/services/authService";
import { Home, LogOut, PlusSquare, Search } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const logoutHandler = () => {
    logoutUser();
    dispatch(setAuthUser(null));
    dispatch(setPosts([]));
    dispatch(setSelectedPost(null));
    navigate("/login");
    toast.success("Logged out successfully.");
  };

  const sidebarHandler = (text) => {
    switch (text) {
      case "Home":
        navigate("/");
        break;
      case "Search":
        break;
      case "Create":
        setOpen(true);
        break;
      case "Profile":
        navigate(`/profile/${user?._id}`);
        break;
      case "Logout":
        logoutHandler();
        break;
      default:
        break;
    }
  };

  const sidebarItems = [
    { icon: <Home className="w-6 h-6" />, text: "Home" },
    { icon: <Search className="w-6 h-6" />, text: "Search" },
    { icon: <PlusSquare className="w-6 h-6" />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut className="w-6 h-6" />, text: "Logout" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r px-4 py-6 hidden md:flex flex-col justify-between z-20">
      <div>
        <h1 className="text-2xl font-bold mb-10 pl-2">Instagram</h1>
        <nav className="flex flex-col space-y-4">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => sidebarHandler(item.text)}
              className="flex items-center gap-4 px-4 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer relative"
            >
              {item.icon}
              <span className="text-md">{item.text}</span>
            </div>
          ))}
        </nav>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </aside>
  );
};

export default LeftSidebar;
