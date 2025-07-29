import { logoutUser } from "@/api/authService";
import { setAuthUser } from "@/redux/authSlice";
import { Home, LogOut, PlusSquare, Search, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";
import UserSearchDialog from "./UserSearchDialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const logoutHandler = async () => {
    try {
      await logoutUser();
      dispatch(setAuthUser(null));
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const sidebarHandler = (textType) => {
    switch (textType) {
      case "Logout":
        logoutHandler();
        break;
      case "Create":
        setOpen(true);
        break;
      case "Search":
        setShowSearch(true);
        break;
      case "Profile":
        navigate(`/profile/${user?.userId}`);
        break;
      case "Home":
        navigate("/");
        break;
      default:
        break;
    }
    setIsDrawerOpen(false);
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={`${BASE_URL}${user?.profilePicture}`} alt="@user" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  // Handle drawer toggle for mobile
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div>
      {/* Mobile Hamburger Menu */}
      <div className="md:hidden fixed top-0 left-0 z-20 p-4">
        <button
          onClick={toggleDrawer}
          className="p-2 rounded-md bg-gray-800 text-white"
        >
          {/* Hamburger Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Full-Screen Drawer */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white z-30 transition-transform transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="font-bold text-xl">LOGO</h1>
          <button onClick={toggleDrawer} className="text-xl">
            <X />
          </button>
        </div>
        <div className="flex flex-col items-start p-4">
          {sidebarItems.map((item, index) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer w-full"
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="hidden lg:block fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
        <div className="flex flex-col">
          <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
          <div>
            {sidebarItems.map((item, index) => (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"
              >
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreatePost open={open} setOpen={setOpen} />
      <UserSearchDialog open={showSearch} setOpen={setShowSearch} />
    </div>
  );
};

export default LeftSidebar;
