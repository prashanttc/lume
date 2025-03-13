import { useUserContext } from "@/context/AuthContext";
import Loader from "./ui/Loader";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";

const RightSideBar = () => {
  const { user, isLoading } = useUserContext();
  return (
    <div className="hidden md:flex flex-col p-4 xl:p-10 md:w-[200px] xl:w-[400px]">
      {isLoading ? (
        <Loader />
      ) : (
       <div>
         <div className="flex gap-5 items-center">
        <Link to={`/profile/${user.id}`} className="flex gap-5 ">
        <img
            src={user.imageUrl}
            alt="profile"
            className="w-15 h-14 rounded-full"
          />
          <div className="flex flex-col ">
            <p className="text-white font-semibold text-md">{user.username}</p>
            <p className="text-light-3 font-semibold hidden xl:flex text-sm">{user.name}</p>
          </div>
          </Link>
        </div>
       </div>
      )}
      <Separator className="bg-white/40 mt-10"/>
      <div className="w-full h-full py-10">messaging here</div>
    </div>
  );
};

export default RightSideBar;
