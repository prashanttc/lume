import BottomBar from "@/components/BottomBar";
import RightSideBar from "@/components/RightSideBar";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useUserContext } from "@/context/AuthContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const RootLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hidesidebar = location.pathname.startsWith("/profile");
  const { isAuthenticated } = useUserContext();
  if (!isAuthenticated) {
    navigate("/signIn");
  }
  return (
    <div className="w-full h-screen md:flex relative">
      <Topbar />
      <Sidebar />
      <section className="flex flex-1 h-full ">
        <Outlet />
      </section>
      {!hidesidebar && <RightSideBar />} <BottomBar />
    </div>
  );
};

export default RootLayout;
