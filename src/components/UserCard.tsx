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
  const { mutate: followUser, isPending: isFollowing  } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnFollowing } = useUnFollowUser();
  const { data: followingList, isPending: isLoading } = useGetFollowing(currentUser.id);
  const [followStatus, setFollowStatus] = useState<string[]>([]);

  useEffect(() => {
    if (followingList) {
      const followingIds = followingList.map((follow) => follow.followingId.$id );
      setFollowStatus(followingIds || []);
    }
  }, [followingList]);

  const handleFollow = (followingId: string) => {
    const followerId = currentUser.id;
    const isFollowed = followStatus.includes(followingId);

    const mutation = isFollowed ? unfollowUser : followUser;
    const successMessage = isFollowed ? "Unfollowed successfully!" : "Followed successfully!";
    const updatedStatus = isFollowed
      ? (prev: string[]) => prev.filter((id) => id !== followingId)
      : (prev: string[]) => [...prev, followingId];

    mutation(
      { followerId, followingId },
      {
        onSuccess: () => {
          toast.success(successMessage);
          setFollowStatus(updatedStatus);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 xl:gap-20 w-full">
        {users.map((user) => (
          <div
            key={user.$id}
            className="cursor-pointer bg-white/10 px-5 rounded-3xl py-10 flex w-full flex-col items-center justify-center"
          >
            <Link to={`/profile/${user.$id}`} className="w-full">
              <div className="flex flex-col justify-center items-center gap-5 w-full">
                <img
                  src={user.imageUrl}
                  alt="user"
                  className="md:w-20 md:h-20 w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col  items-center gap-3 w-full justify-center  flex-wrap text-wrap overflow-hidden">
                  <p className="text-md md:text-xl text-white text-center">{user.username}</p>
                  <p className="text-light-3 text-sm">{user.name}</p>
                </div>
              </div>
            </Link>
            <Button
              disabled={isFollowing || isUnFollowing}
              className={`${
                followStatus.includes(user.$id)
                  ? 'bg-white text-black'
                  : 'bg-primary-500 text-white'
              } w-[70%] mt-5`}
              onClick={() => handleFollow(user.$id)}
            >
              {followStatus.includes(user.$id)
                ? (isFollowing || isUnFollowing ? <Loader /> : 'Following')
                : 'Follow'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCard;
