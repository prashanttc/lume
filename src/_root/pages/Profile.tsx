import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import GridPostList from "@/components/GridPostList";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/Loader";
import { Separator } from "@/components/ui/separator";
import {
  useFollowUser,
  useGetCurrentUser,
  useGetFollower,
  useGetFollowing,
  useGetUserById,
  useUnFollowUser,
} from "@/lib/react-query/QueryAndMutations";
import FollowingAlertDialog from "@/components/FollowingAlertDialog";
import FollowerAlertDialog from "@/components/FollowerAlertDialog";
import { toast } from "sonner";

const Profile = () => {
  const params = useParams();
  const profileId = params.id;
  const [open, setOpen] = useState(false);
  const [openFollwer, setOpenFollower] = useState(false);
  const { data, isPending } = useGetUserById(profileId || "");
  const { data: currentUser, isPending: gettingUser } = useGetCurrentUser();
  const { data: followings } = useGetFollowing(profileId || "");
  const { data: currentUserfollowing } = useGetFollowing(
    currentUser?.$id || ""
  );
  const { mutate: followUser, isPending: isfollowing } = useFollowUser();
  const { mutate: unfollowUser, isPending: isunfollowing } = useUnFollowUser();
  const { data: followers } = useGetFollower(profileId || "");
  const IscurrentUser = currentUser?.$id === profileId;
  const followingIdforCU = currentUserfollowing?.map(
    (following) => following.followingId.$id
  );

  const handleFollow = (userId: string) => {
    const isFollowed = followingIdforCU?.includes(userId);
    const followerId = currentUser?.$id || "";
    if (isFollowed) {
      // If already followed, unfollow
      unfollowUser(
        { followerId, followingId: userId },
        {
          onSuccess: () => {
            toast.success("Unfollowed successfully!");
          },
          onError: () => {
            toast.error("An error occurred while unfollowing the user.");
          },
        }
      );
    } else {
      // If not followed, follow
      followUser(
        { followerId, followingId: userId },
        {
          onSuccess: () => {
            toast.success("Followed successfully!");
          },
          onError: () => {
            toast.error("An error occurred while following the user.");
          },
        }
      );
    }
  };
  return (
    <div className="w-full h-full p-5 xl:px-32">
      {isPending || gettingUser ? (
        <div className="flex items-center justify-center w-full ">
          <Loader />
        </div>
      ) : (
        <>
          <div className="w-full flex md:py-10 xl:gap-20 gap-5">
            <div className="xl:w-[200px] xl:h-[200px] w-[90px] h-[90px] flex items-center justify-center">
              <img
                src={data?.imageUrl}
                alt="profile"
                className="w-full h-full rounded-full"
              />
            </div>
            <div className="ml-5 xl:ml-10">
              <div className="flex gap-2 mt-2">
                <p className="text-white md:text-2xl text-xl ml-5 md:ml-0 font-medium">
                  {data?.username}
                </p>
                {IscurrentUser ? (
                  <Button className="bg-primary-500 ml-2 hidden xl:block">
                    <Link to={`/update-profile/${profileId}`}>
                      edit profile
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="bg-primary-500 ml-2 hidden xl:block"
                    disabled={isfollowing || isunfollowing}
                    onClick={() => handleFollow(profileId!)}
                  >
                    {followingIdforCU?.includes(profileId) ? (
                      isfollowing || isunfollowing ? (
                        <Loader />
                      ) : (
                        "unfollow"
                      )
                    ) : (
                      "follow"
                    )}
                  </Button>
                )}
              </div>
              <div className="flex gap-4 xl:gap-10 mt-7 text-sm ml-5 md:ml-0 text-md xl:text-xl">
                <div className="flex xl:flex-row items-center flex-col gap-2">
                  {data?.posts.length}
                  <span className="text-light-2/70">post</span>
                </div>
                <div
                  className="flex xl:flex-row items-center flex-col gap-2 cursor-pointer"
                  onClick={() => setOpenFollower(true)}
                >
                  {followers?.length}
                  <span className="text-light-2/70">followers</span>
                </div>
                <div
                  className="flex xl:flex-row items-center flex-col gap-2 cursor-pointer"
                  onClick={() => setOpen(true)}
                >
                  {followings?.length}
                  <span className="text-light-2/70">following</span>
                </div>
              </div>
              <div className="hidden xl:block">
                <p className="mt-7 md:text-md font-bold mb-1 text-sm">
                  {data?.name}
                </p>
                <p className="text-sm md:text-md text-light-2">{data?.bio}</p>
              { followers && followers.length > 1 && 
                <p className="mt-7 text-sm">
                  followed by <span className="font-semibold">{followers[0].followerId.username}</span>{" "}
                  and <span className="font-semibold">{followers!.length-1}</span> others
                </p>}
              </div>
            </div>
          </div>
          <div className="w-full pt-1 flex flex-col gap-4 mb-5 xl:hidden">
            <p className="text-sm font-semibold">{data?.name}</p>
            <p className="text-sm">{data?.bio}</p>
            { followers && followers.length > 1 && 
                <p className="mt-7 xl:hidden text-sm">
                  followed by <span className="font-semibold">{followers[0].followerId.username}</span>{" "}
                  and <span className="font-semibold">{followers!.length-1}</span> others
                </p>}
            <div className="flex gap-5">
              {IscurrentUser && (
                <Button className="bg-primary-500 w-[50%]">
                  <Link to={`/update-profile/${profileId}`}>edit profile</Link>
                </Button>
              )}
              <Button className="bg-primary-500 w-[50%]">share profile</Button>
              <Button
                       className={`${
                        !followingIdforCU?.includes(profileId)
                          ? "bg-primary-500 text-white"
                          : "bg-white text-black"} w-[50%]`} 
                    disabled={isfollowing || isunfollowing}
                    onClick={() => handleFollow(profileId!)}
                  >
                    {followingIdforCU?.includes(profileId) ? (
                      isfollowing || isunfollowing ? (
                        <Loader />
                      ) : (
                        "unfollow"
                      )
                    ) : (
                      "follow"
                    )}
                  </Button>            </div>
          </div>
          <Separator className="bg-white/40" />
          <div className="w-full mt-5">
            {data?.posts.length === 0 || !data?.posts ? (
              <div className="w-full mt-32 flex items-center justify-center flex-col gap-1">
                <img src="/assets/icons/add-post.svg" alt="add post" />
                <p className="text-light-3">no post yet</p>
              </div>
            ) : (
              <GridPostList posts={data?.posts} key={data?.posts.$id} />
            )}
          </div>
        </>
      )}
      <FollowingAlertDialog
        open={open}
        currentUserId={currentUser?.$id || ""}
        onOpenChange={setOpen}
        currentUserFollowing={currentUserfollowing || []}
        followings={followings || []}
      />
      <FollowerAlertDialog
        open={openFollwer}
        profileId={profileId || ""}
        currentUserId={currentUser?.$id || ""}
        onOpenChange={setOpenFollower}
        followers={followers || []}
      />
    </div>
  );
};

export default Profile;
