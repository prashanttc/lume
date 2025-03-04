import { bottombarLinks } from "@/constants";
import { Link, useLocation } from "react-router-dom";

const BottomBar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((Links) => {
        const isActive = pathname === Links.route;
        return (
          <Link
            key={Links.label}
            to={Links.route}
            className={`flex-center flex-col flex ${
              isActive && "bg-primary-500 rounded-[10px]"
            } p-2 gap-1 transition `}
          >
            <img
              src={Links.imgURL}
              alt={Links.label}
              width={16}
              height={16}
              className={`group-hover:invert-white ${
                isActive && "invert-white"
              }`}
            />
            <p className="tiny-medium text-light-2">{Links.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default BottomBar;
