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
import { Link } from "react-router-dom";
import { useRemoveFollower } from "@/lib/react-query/QueryAndMutations";
import { toast } from "sonner";
import Loader from "./ui/Loader";

type FollowerAlertDialogProps = {
  currentUserId: string;
  profileId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  followers: Models.Document[] | [];
};

const FollowerAlertDialog: React.FC<FollowerAlertDialogProps> = ({
  open,
  currentUserId,
  onOpenChange,
  profileId,
  followers,
}) => {
    const { mutate: removeFollower, isPending } = useRemoveFollower();
    const follower = followers.map((follower) => follower.followerId);
    const followerId = followers.map((follower) => follower.followerId.$id);
    
    const handleFollow = (userId: string) => {
      console.log("curretnusre and userid",currentUserId,userId)
    removeFollower(
      { followerId: userId, followingId: currentUserId },
      {
        onSuccess: () => {
          toast.success("removed successfully!");
        },
        onError: () => {
          toast.error("An error occurred while removing the user.");
        },
      }
    );
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-black flex w-[90%] rounded-3xl   border-white/40 flex-col  px-5 py-3  justify-center border-2">
        <AlertDialogTitle className="text-center">Following</AlertDialogTitle>
        <Separator className="bg-white/40" />
        <div className="flex flex-col gap-5">
          {followers.length === 0 ? (
            <p className="text-white text-sm text-center">
              dang! You have no followers
            </p>
          ) : (
            follower.map((user) => (
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
               {profileId===currentUserId ?<>
                <Button
                  disabled={!followerId.includes(user.$id)}
                  onClick={() => handleFollow(user.$id)}
                  className={`${
                    followerId.includes(user.$id)
                      ? "bg-primary-500 text-white"
                      : "bg-white/60 text-black"
                  }  mt-5`}
                >
                  {followerId.includes(user.$id) ? (
                    isPending ? (
                      <Loader />
                    ) : (
                      "remove"
                    )
                  ) : (
                    "removed"
                  )}
                </Button>
               </>:<>
               <Button className="text-black bg-white"><Link to={`/profile/${user.$id}`}>visit profile</Link></Button>
               </>}
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

export default FollowerAlertDialog;
