import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSignOutAccount } from "@/lib/react-query/QueryAndMutations";
import { useEffect } from "react";

const Sidebar = () => {
  const { mutate: SignOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);
  const { pathname } = useLocation();
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-5">
        <Link to="/" className="flex gap-3 items-center mb-10">
          <img
            src="/assets/images/logo.svg"
            width={170}
            height={35}
            alt="logo"
          />
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((Links: INavLink) => {
            const isActive = pathname === Links.route;
            return (
              <li
                className={`leftsidebar-link ${isActive && "bg-primary-500"}`}
                key={Links.label}
              >
                <NavLink
                  to={Links.route}
                  className="gap-4 p-4 items-center flex"
                >
                  <img
                    src={Links.imgURL}
                    alt={Links.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {Links.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={() => SignOut()}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">logout</p>
      </Button>
    </nav>
  );
};

export default Sidebar;
