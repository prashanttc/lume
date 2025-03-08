import { Models } from "appwrite";
import { Link } from "react-router-dom";

type postsProps = {
  posts: Models.Document[];
};
const GridPostList = ({ posts }: postsProps) => {
  return (
    <div className=" h-screen w-full">
      <div className="w-full h-full grid grid-cols-3 gap-1  ">
        {posts.map((post) => (
          <div className="cursor-pointer">
            <Link to={`/posts/${post.$id}`}>
              <img src={post.imageUrl} alt="post" className="" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridPostList;
