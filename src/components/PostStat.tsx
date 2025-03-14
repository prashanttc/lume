import React, { useState, useEffect } from "react";
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useGetUserById,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/QueryAndMutations";
import { Models } from "appwrite";
import Loader from "./ui/Loader";

type PostStatProps = {
  post: Models.Document;
  userId: string;
};

const PostStat = ({ post, userId }: PostStatProps) => {
  const { mutate: likePost, isPending: isLiking } = useLikePost();
  const { mutate: savePost, isPending: isSaving } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isUnSaving } = useDeleteSavedPost();
  const { data: currentUser } = useGetCurrentUser();

  // Local states for likes and save status
  const [likes, setLikes] = useState<string[]>(post.likes.map((user: Models.Document) => user.$id));
  const [isSaved, setIsSaved] = useState<boolean>(false);
  // We'll update firstUserId from the local likes state so it stays unique per post
  const [firstUserId, setFirstUserId] = useState<string>(likes[likes.length-1]);

  const savedRecord = (currentUser?.save || []).find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  // When the post prop changes, update local likes and saved state
  useEffect(() => {
    const newLikes = post.likes.map((user: Models.Document) => user.$id);
    setLikes(newLikes);
    setIsSaved(!!savedRecord);
  }, [post.likes, savedRecord]);

  // Whenever local likes change, update firstUserId accordingly.
  useEffect(() => {
    setFirstUserId(likes.length > 0 ? likes[likes.length-1] : "");
  }, [likes]);

  // Only fetch the user if firstUserId is valid (non-empty)
  const { data: firstUser } = useGetUserById(firstUserId);

  // Handle like/unlike post
  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedLikes = likes.includes(userId)
      ? likes.filter((id) => id !== userId)
      : [...likes, userId];

    setLikes(updatedLikes);
    likePost({ postId: post.$id, likedArray: updatedLikes });
  };

  // Handle save/unsave post
  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      setIsSaved(false);
      if (savedRecord) deleteSavedPost(savedRecord.$id);
    } else {
      savePost({ postId: post.$id, userId });
      setIsSaved(true);
    }
  };

  const checkIsLiked = (likeList: string[], userId: string) => likeList.includes(userId);

  return (
    <>
      {/* Like and Save Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          {isLiking ? (
            <Loader />
          ) : (
            <>
              <img
                src={
                  checkIsLiked(likes, userId)
                    ? "/assets/icons/liked.svg"
                    : "/assets/icons/like.svg"
                }
                alt="like"
                height={30}
                width={30}
                className="cursor-pointer"
                onClick={handleLikePost}
              />
              <p className="small-medium lg:base-medium">{likes.length}</p>
            </>
          )}
        </div>
        <div className="flex gap-2">
          {isSaving || isUnSaving ? (
            <Loader />
          ) : (
            <img
              src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
              alt="save"
              height={25}
              width={25}
              className="cursor-pointer"
              onClick={handleSavePost}
            />
          )}
        </div>
      </div>

      {/* First user who liked the post */}
      <div className="flex gap-1 items-center  w-full">
        {firstUser && firstUserId && (
          <>
            <img
              src={firstUser.imageUrl}
              alt="profile"
              className="rounded-full h-5 w-5"
            />
            <p className="text-sm ">
              Liked by{" "}
              <span className="ml-2 text-xs md:text-sm font-semibold">{firstUser.name}</span>
            </p>
            {likes.length > 1 && (
              <p className="text-sm ">
                and <span className="text-sm">others</span>
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PostStat;
