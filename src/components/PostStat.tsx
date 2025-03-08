import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useGetUserById,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/QueryAndMutations";
import { Models } from "appwrite";
import React, { useState } from "react";
import Loader from "./ui/Loader";

type PostStatProps = {
  post: Models.Document;
  userId: string;
};
const PostStat = ({ post, userId }: PostStatProps) => {
  const { mutate: likepost, isPending: isLiking } = useLikePost();
  const { mutate: savepost, isPending: issaving } = useSavePost();
  const { mutate: deleteSavedpost, isPending: isunsaving } =
    useDeleteSavedPost();
  const likedList = post.likes.map((user: Models.Document) => user.$id);
  const { data: currentUser } = useGetCurrentUser();
  const savedRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );
  const firstUserId = likedList.length > 0 ? likedList[0] : null;
  const { data: firstUser } = useGetUserById(firstUserId);
  const [likes, setLikes] = useState(likedList);
  const [isSaved, setIsSaved] = useState(savedRecord);

  const handleLikepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likes];
    if (newLikes.includes(userId)) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);
    likepost({ postId: post.$id, likedArray: newLikes });
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedRecord) {
      setIsSaved(false);
      deleteSavedpost(savedRecord.$id);
      return;
    } else {
      savepost({ postId: post.$id, userId });
      setIsSaved(true);
    }
  };

  const checkIsLiked = (likeList: string[], userId: string) => {
    return likeList.includes(userId);
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          {isLiking ? (
            <Loader />
          ) : (
            <>
              <img
                src={
                  checkIsLiked(likedList, userId)
                    ? "/assets/icons/liked.svg"
                    : "/assets/icons/like.svg"
                }
                alt="like"
                height={30}
                width={30}
                className="cursor-pointer"
                onClick={handleLikepost}
              />
              <p className="small-medium lg:base-medium">{likedList.length}</p>
            </>
          )}
        </div>
        <div className="flex gap-2">
          {issaving || isunsaving ? (
            <Loader />
          ) : (
            <img
              src={
                isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"
              }
              alt="save"
              height={25}
              width={25}
              className="cursor-pointer"
              onClick={handleSavePost}
            />
          )}
        </div>
      </div>
      <div className="flex gap-1 items-center">
        {firstUser && firstUserId && (
          <>
            <img
              src={firstUser.imageUrl}
              alt="profile"
              className="rounded-full h-5 w-5"
            />
            <p className="text-sm mt-1">
              Liked by
              <span className="ml-2 text-sm font-semibold">
                {firstUser.name}
              </span>
            </p>
            {likedList.length > 1 && (
              <p className="text-sm mt-1">
                and <span className="text-sm font-semibold">others</span>
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PostStat;
