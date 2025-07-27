import Feed from "@/components/Feed";
import RightSidebar from "@/components/RightSidebar";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  );
};
export default HomePage;
