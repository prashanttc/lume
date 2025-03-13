import React from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Models } from "appwrite";
import { Separator } from "./ui/separator";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import {
  useFollowUser,
  useUnFollowUser,
} from "@/lib/react-query/QueryAndMutations";
import Loader from "./ui/Loader";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type FollowingAlertDialogProps = {
  currentUserId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  followings: Models.Document[] | [];
  currentUserFollowing: Models.Document[] | [];
};

const FollowingAlertDialog: React.FC<FollowingAlertDialogProps> = ({
  open,
  currentUserFollowing,
  currentUserId,
  onOpenChange,
  followings,
}) => {
  const following = followings.map((following) => following.followingId);
  const followingIdforCU = currentUserFollowing.map((following) => following.followingId.$id);
  const { mutate: unfollowUser, isPending: isunfollowing } = useUnFollowUser();
  const { mutate: followUser, isPending: isfollowing } = useFollowUser();
  
  
  const handleFollow = (userId: string) => {
    const isFollowed = followingIdforCU.includes(userId);
    const followerId = currentUserId;
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
    <AlertDialog open={open} onOpenChange={onOpenChange}>

    <AlertDialogContent className="bg-black flex  border-white/40 flex-col  px-5 py-3  justify-center border-2">
        <AlertDialogTitle className="text-center">Following</AlertDialogTitle>
        <Separator className="bg-white/40" />
        <div className="flex flex-col gap-5">
          {followings.length === 0 ? (
            <p className="text-white text-sm text-center">
              You are not following anyone yet.
            </p>
          ) : (
            following.map((user) => (
              <div
                key={user.$id}
                className="flex w-full items-center justify-between"
              >
                <Link to={`/profile/${user.$id}`} className="flex gap-5">
                  <img
                    src={user.imageUrl}
                    alt={user.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-white font-semibold text-sm">
                      {user.username}
                    </p>
                    <p className="text-gray-400 text-sm">{user.name}</p>
                  </div>
                </Link>
                <Button
                  disabled={followingIdforCU.includes(user.$id) && isunfollowing}
                  className={`${
                    followingIdforCU.includes(user.$id)
                      ? "bg-white text-black"
                      : "bg-primary-500 text-white"
                  }  mt-5`}
                  onClick={() => handleFollow(user.$id)}
                >
                  {followingIdforCU.includes(user.$id) ? (
                    isfollowing || isunfollowing ? (
                      <Loader />
                    ) : (
                      "unfollow"
                    )
                  ) : (
                    "follow"
                  )}
                </Button>
              </div>
            ))
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className=" border-none absolute p-0 h-fit w-fit top-5 right-5">
            <X className="" />
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FollowingAlertDialog;
