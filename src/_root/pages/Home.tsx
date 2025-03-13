import PostCard from "@/components/PostCard";
import Loader from "@/components/ui/Loader";
import { useGetRecentPost } from "@/lib/react-query/QueryAndMutations";
import { Models } from "appwrite";

const Home = () => {
  const { data: posts, isPending: isPostLoading } = useGetRecentPost();
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h2-bold md:h3-bold w-full text-left">Feed</h2>
          {isPostLoading && !posts ? <Loader /> : <ul className="flex flex-col flex-1 gap-9 w-full">
            {posts?.documents.map((post:Models.Document)=>(
              <PostCard post={post} key={post.$id}/>
            ))}</ul>}
        </div>
      </div>
    </div>
  );
};

export default Home;
