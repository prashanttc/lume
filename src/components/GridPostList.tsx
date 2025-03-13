import { Models } from "appwrite";
import { Link } from "react-router-dom";

type postsProps = {
  posts: Models.Document[];
};
const GridPostList = ({ posts }: postsProps) => {
  return (
    <div className=" w-full">
      <div className="w-full grid grid-cols-3 gap-1  ">
        {posts.map((post) => (
          <div className="cursor-pointer" key={post.$id}>
            <Link to={`/posts/${post.$id}`}>
              <img src={post.imageUrl} alt="post" className=" w-full object-cover h-full" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridPostList;
