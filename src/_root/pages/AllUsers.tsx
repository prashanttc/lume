import SearchResult from "@/components/SearchResult";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import UserCard from "@/components/UserCard";
import { useGetAllUser } from "@/lib/react-query/QueryAndMutations";
import { useState } from "react";
import { useDebounce } from "use-debounce";

const AllUsers = () => {
  const [searchvalue, setSearchvalue] = useState("");
  const [debouncedValue] = useDebounce(searchvalue, 1000);
  const shouldShowSearchresult = searchvalue !== "";
  const { data: users, isPending } = useGetAllUser();

  const showLoader = isPending || !users;
  const userList = users?.users || []; 
  const showNoUsers = !isPending && userList.length === 0;
  const showUsers = !shouldShowSearchresult && userList.length > 0;

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search User</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
          />
          <Input
            className="explore-search"
            placeholder="Search by username"
            value={searchvalue}
            onChange={(e) => setSearchvalue(e.target.value)}
            type="text"
          />
        </div>
        <div className="flex flex-wrap gap-9 w-full max-w-5xl">
          {shouldShowSearchresult ? (
            <SearchResult value={debouncedValue} type="user" />
          ) : showLoader ? (
            <Loader />
          ) : showNoUsers ? (
            <p className="text-light-4 mt-10 text-center w-full">
              No users found
            </p>
          ) : showUsers ? (
            <UserCard users={userList} />
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

export default AllUsers;
