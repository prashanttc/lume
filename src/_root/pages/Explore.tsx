import GridPostList from "@/components/GridPostList";
import SearchResult from "@/components/SearchResult";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import { useGetInfinitePost } from "@/lib/react-query/QueryAndMutations";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from 'use-debounce';


const Explore = () => {
  const [searchvalue, setSearchvalue] = useState("");
  const [debouncedValue] = useDebounce(searchvalue,1000);
  const {
    data: Post,
    isLoading: isfetching,
    isFetchingNextPage: isfetchingNextPage,
  } = useGetInfinitePost();

  if (!Post || isfetching || isfetchingNextPage) {
    return <Loader />;
  }

  const shouldShowSearchresult = searchvalue !== "";
  const showPosts =
    !shouldShowSearchresult &&
    Post.pages.some((page) => page!.posts?.length > 0);

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
    <div className="flex gap-2 w-full justify-between">
    <h2 className="h3-bold md:h2-bold w-full">Search posts</h2>
    <Button className="md:hidden bg-primary-500 text-xs " variant='ghost'><Link to='/all-users'>Search user</Link></Button>
    </div>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
          />
          <Input
            className="explore-search"
            placeholder="Search something"
            value={searchvalue}
            onChange={(e) => setSearchvalue(e.target.value)}
            type="text"
          />
        </div>
        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          {shouldShowSearchresult ? (
            <SearchResult value={debouncedValue} type="post"/>
          ) : showPosts ? (
            Post.pages.map((item, index) => (
              <GridPostList key={`PAGE=${index}`} posts={item?.posts || []} />
            ))
          ) : (
            <p className="text-light-4 mt-10 text-center w-full">
              End of posts
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
