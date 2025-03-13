  import { Models } from "appwrite";
  import { Link } from "react-router-dom";
  import { Button } from "./ui/button";
  import { useUserContext } from "@/context/AuthContext";
  import { toast } from "sonner";
  import { useFollowUser, useGetFollowing, useUnFollowUser } from "@/lib/react-query/QueryAndMutations";
  import Loader from "./ui/Loader";
  import { useEffect, useState } from "react";

  type UsersProps = {
    users: Models.Document[];
  };

  const UserCard = ({ users }: UsersProps) => {
    const { user: currentUser } = useUserContext();
    const { mutate: followUser, isPending: isFollowing } = useFollowUser();
    const { mutate: unfollowUser, isPending: isUnFollowing} = useUnFollowUser();
    const { data:followinglist, isPending } = useGetFollowing(currentUser.id);
    const [followStatus, setFollowStatus] = useState<string[]>([]);
     const followingId = followinglist?.map((followings)=>followings.followingId)
    useEffect(() => {
      if (followinglist) {
        setFollowStatus(followingId||[]);
      }
    }, [followinglist]);


    const handleFollow = (followingId: string) => {
      const followerId = currentUser.id;
      const isFollowed = followStatus.includes(followingId);
  
      if (isFollowed) {
        // If already followed, unfollow
        unfollowUser(
          { followerId, followingId },
          {
            onSuccess: () => {
              toast.success("Unfollowed successfully!");
              // Remove the target user id from the followStatus
              setFollowStatus((prev) => prev.filter((id) => id !== followingId));
            },
            onError: () => {
              toast.error("An error occurred while unfollowing the user.");
            },
          }
        );
      } else {
        // If not followed, follow
        followUser(
          { followerId, followingId },
          {
            onSuccess: () => {
              toast.success("Followed successfully!");
              setFollowStatus((prev) => [...prev, followingId]);
            },
            onError: () => {
              toast.error("An error occurred while following the user.");
            },
          }
        );
      }
    };
    if (isPending) {
      return (
        <div className="w-full h-ull flex items-center justify-center">
          <Loader />
        </div>
      );
    }
    return (
      <div className="h-screen w-full">
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-5 xl:gap-20">
          {users.map((user) => (
            <div
              key={user.$id}
              className="cursor-pointer bg-white/10 rounded-3xl py-10 flex flex-col items-center justify-center"
            >
              <Link to={`/profile/${user.$id}`}>
                <div className="flex flex-col justify-center items-center gap-5">
                  <img
                    src={user.imageUrl}
                    alt="user"
                    className="md:w-20 object-cover md:h-20 w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col justify-center items-center gap-3">
                    <p className="text-md md:text-xl text-white">
                      {user.username}
                    </p>
                    <p className="text-light-3 text-sm">{user.name}</p>
                  </div>
                </div>
              </Link>
              <Button
              disabled={followStatus.includes(user.$id) && isFollowing||isUnFollowing}
                className={`${followStatus.includes(user.$id)?'bg-white text-black':"bg-primary-500 text-white"} w-[70%] mt-5`}
                onClick={() => handleFollow(user.$id)}>
                  {followStatus.includes(user.$id)?isFollowing ||isUnFollowing ?<Loader/>:'following':'follow'}
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  export default UserCard;
