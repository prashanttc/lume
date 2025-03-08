import BottomBar from "@/components/BottomBar";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useUserContext } from "@/context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";

const RootLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useUserContext();
  console.log("auth",isAuthenticated)
  if(!isAuthenticated){
    navigate('/signIn');
    console.log("done")
  }
  return (
    <div className="w-full md:flex relative">
      <Topbar />
      <Sidebar />
      <section className="flex flex-1 h-full ">
        <Outlet />
      </section>
      <BottomBar />
    </div>
  );
};

export default RootLayout;
