import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSignOutAccount } from "@/lib/react-query/QueryAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";

const Topbar = () => {
  const { mutate: SignOut, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);
  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            width={130}
            height={325}
            alt="logo"
          />
        </Link>
        <div className="flex gap-4 ">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => SignOut()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link className="gap-3 flex items-center" to={`/profile/${user.id}`}>
            <img
              className="h-8 w-8 rounded-full"
              src={user.imageUrl || "/assets/images/profile.png"}
              alt="profile"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
