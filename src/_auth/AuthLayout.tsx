import { useUserContext } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const { isAuthenticated } = useUserContext();
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center py-10 flex-col">
            <Outlet />
          </section>
          <img
            src="/assets/images/side-img.jpg"
            alt="img"
            className="w-1/2 hidden xl:block h-screen border-l-2 border-purple-700/20 bg-no-repeat object-cover"
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;
