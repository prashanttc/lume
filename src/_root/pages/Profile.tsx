import GridPostList from "@/components/GridPostList";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { Separator } from "@/components/ui/separator";
import {
  useGetCurrentUser,
  useGetFollowing,
  useGetUserById,
} from "@/lib/react-query/QueryAndMutations";
import { Link, useParams } from "react-router-dom";

const Profile = () => {
  const param = useParams();
  const userId = param.id;
  const { data, isPending,  } = useGetUserById(userId || "");
  const { data: currentUser, isPending: gettinguser } = useGetCurrentUser();
  const { data: followings } = useGetFollowing(
    userId || ""
  );
  const IscurrentUser = currentUser?.$id === userId;
  return (
    <div className="w-full h-full p-5 xl:px-32">
      {isPending || gettinguser ? (
        <div className="flex items-center justify-center w-full ">
          <Loader />
        </div>
      ) : (
        <>
          <div className="w-full flex md:py-10 xl:gap-20 gap-5">
            <div className="xl:w-[200px] xl:h-[200px] w-[90px] h-[90px] flex items-center justify-center">
              <img
                src={data?.imageUrl}
                alt="hahahah"
                className="w-full h-full rounded-full flex items-center justify-center"
              />
            </div>
            <div className="">
              <div className="flex gap-2 mt-2">
                <p className="text-white md:text-2xl text-xl ml-5 md:ml-0 font-medium">
                  {data?.username}
                </p>
                {IscurrentUser && (
                  <Button className="bg-primary-500 ml-2 hidden xl:block">
                    <Link to={`/update-profile/${userId}`}>edit profile</Link>
                  </Button>
                )}
              </div>
              <div className="flex gap-4 xl:gap-10 mt-7 text-sm   ml-5 md:ml-0 text-md xl:text-xl">
                <div className="flex xl:flex-row items-center flex-col gap-2">
                  {data?.posts.length}
                  <span className="text-light-2/70 ">post</span>
                </div>
                <div className="flex xl:flex-row items-center flex-col gap-2">
                  {data?.posts.length}
                  <span className="text-light-2/70 ">followers</span>
                </div>
                <div className="flex xl:flex-row items-center flex-col gap-2">
                  {followings?.length}
                  <span className="text-light-2/70 ">following</span>
                </div>
              </div>
              <div className="hidden xl:block">
                <p className="mt-7 md:text-md font-bold mb-1 text-sm">{data?.name}</p>
                <p className="text-sm md:text-md text-light-2">{data?.bio}</p>
                <p className="mt-7 text-sm ">
                  followed by <span className="font-semibold">prasahnt</span>{" "}
                  and <span className="font-semibold">69 others</span>
                </p>
              </div>
            </div>
          </div>
          <div className=" w-full pt-1 flex flex-col gap-4 mb-5 xl:hidden">
            <p className="text-sm font0-semibold">{data?.name}</p>
            <p className="text-sm">{data?.bio}</p>
            <p className="xl:hidden text-sm ">
              followed by <span className="font-semibold"></span> and{" "}
              <span className="font-semibold">69 others</span>
            </p>
            <div className="flex gap-5 ">
              {IscurrentUser && (
                <Button className="bg-primary-500 w-[50%]">
                  <Link to={`/update-profile/${userId}`}>edit profile</Link>
                </Button>
              )}
              <Button className="bg-primary-500 w-[50%]">share profile</Button>
            </div>
          </div>
          <Separator className="bg-white/40 " />
          <div className="w-full mt-5 ">
            {data?.posts.length === 0 || !data?.posts ? (
              <div className="w-full mt-32 flex items-center justify-center flex-col gap-1">
                <img src="/assets/icons/add-post.svg" alt="addpost" />
                <p className="text-light-3">no post yet</p>
              </div>
            ) : (
              <GridPostList posts={data?.posts} key={data?.posts.$id} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
