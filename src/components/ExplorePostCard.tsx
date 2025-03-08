import { Models } from "appwrite";

import { useUserContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import PostStat from "./PostStat";
import { timeAgo } from "@/lib/utils";

type PostProps = {
  post: Models.Document;
};
const ExplorePostCard = ({ post }: PostProps) => {
  const { user } = useUserContext();
  return (
    <div className="flex flex-col sm:flex-row sm:w-[70%] ">
      <div className="w-full sm:hidden">
        <div className="w-full p-3 items-center flex justify-between">
          <div className="flex gap-5 justify-center items-center">
            <img
              src={post.imageUrl || "/assets/images/profile.png"}
              alt="profile"
              className="rounded-full h-8 w-8"
            />
            <div className="flex flex-col">
              <p className="font-semibold text-[15px]">
                {post.creator.username}
              </p>
              <p className="text-light-3 text-xs">{post.location}</p>
            </div>
          </div>
          {post.creator.$id === user.id && (
            <Link to={`/update-post/${post.$id}`}>
              <img
                src="/assets/icons/edit.svg"
                alt="edit"
                width={20}
                height={20}
              />
            </Link>
          )}
        </div>
      </div>
      <div className="explore-post-card">
        <img
          src={post.imageUrl || "/assets/icons/profile.png"}
          alt="image"
          className="w-full h-full"
        />
      </div>
      <div className="flex flex-col p-3 sm:w-1/2">
        <div className="hidden w-full  items-center sm:flex justify-between">
          <div className="flex gap-5 justify-center items-center">
            <img
              src={post.creator.imageUrl || "/assets/images/profile.png"}
              alt="profile"
              className="rounded-full h-8 w-8"
            />
            <div className="flex flex-col">
              <p className="font-semibold text-[15px]">
                {post.creator.username}
              </p>
              <p className="text-light-3 text-xs">{post.location}</p>
            </div>
          </div>
          {post.creator.$id === user.id && (
            <Link to={`/update-post/${post.$id}`}>
              <img
                src="/assets/icons/edit.svg"
                alt="edit"
                width={20}
                height={20}
              />
            </Link>
          )}
        </div>
        <Separator className="bg-white/20 my-5" />
        <div className="w-full h-[70%] flex">
          <div className="flex gap-5">
            <img
              src={post.creator.imageUrl || "/assets/images/profile.png"}
              alt="profile"
              className="rounded-full h-8 w-8"
            />
            <div className="flex gap-5 justify-center h-fit items-center">
              <p className="font-semibold text-[15px]">
                {post.creator.username}
              </p>
              <p className="text-light-1 text-xs">{post.caption} <span>{post.tags}</span></p>
            </div>
          </div>
        </div>
        <Separator className="bg-white/20 mb-2" />
        <div className="w-full flex flex-col gap-1 justify-start ">
          <PostStat post={post} userId={user.id} />
          <p className="text-xs text-light-3">{timeAgo(post.$createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default ExplorePostCard;
