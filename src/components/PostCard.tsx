import { timeAgo } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStat from "./PostStat";
import { useUserContext } from "@/context/AuthContext";

type PostProps = {
  post: Models.Document;
};
const PostCard = ({ post }: PostProps) => {
  const{user} =useUserContext();
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post?.creator?.imageUrl}`}>
            <img
              src={post?.creator?.imageUrl || "/assets/images/profile.png"}
              alt="creator"
              className="w-12 lg:-12 rounded-full"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post?.creator?.username}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {timeAgo(post.$createdAt)}
              </p>{" "}
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
       {post.creator.$id === user.id && 
        <Link to={`/update-post/${post.$id}`}>
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>}
      </div>
      <Link to={`posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-5 mt-2">
            {post.tags.map((tag: string) => (
              <li key={tag} className="text-light-3">
            {tag}
              </li>
            ))}
          </ul>
        </div>
        <img src={post.imageUrl|| '/assets/icons/profile.png'} alt="image"  className="post-card_img"/>
      </Link>
      <PostStat post={post} userId={post.creator.$id}/>
    </div>
  );
};

export default PostCard;
