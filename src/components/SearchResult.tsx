// import { useGetSearchPost } from "@/lib/react-query/QueryAndMutations";
import { useGetSearch } from "@/lib/react-query/QueryAndMutations";
import GridPostList from "./GridPostList";
import Loader from "./ui/Loader";
import UserCard from "./UserCard";

const SearchResult = ({
  value,
  type,
}: {
  value: string;
  type: "user" | "post";
}) => {
  const { data, isPending, isError, error } = useGetSearch(value, type);
  return (
    <div className="w-full h-full">
      {isError && <p className="text-center text-red-500">{error.message}</p>}
      {!isPending && !isError && data?.length === 0 && (
        <p className="text-center text-gray-500">No results found</p>
      )}
      {isPending ? <Loader /> : type==='post'?<GridPostList posts={data || []} />:<UserCard users={data||[]}/>}
    </div>
  );
};

export default SearchResult;
