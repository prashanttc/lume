import GridPostList from "@/components/GridPostList";
import { useUserContext } from "@/context/AuthContext";
import { useGetSavedPosts } from "@/lib/react-query/QueryAndMutations";
import Loader from "@/components/ui/Loader";
import { Models } from "appwrite";

const Saved = () => {
  const { user, isLoading: isUserLoading } = useUserContext();
  const { data: saved, isPending: isPostsLoading, error } = useGetSavedPosts(user?.id);

  if (isUserLoading || isPostsLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
{error.message} </div>
    );
  }

  const posts = saved?.map((item:Models.Document) => item.post) || [];

  return (
    <div className="w-full h-full">
      {posts.length > 0 ? (
        <GridPostList posts={posts} />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-light-3">
          No saved posts yet.
        </div>
      )}
    </div>
  );
};

export default Saved;
