import ExplorePostCard from "@/components/ExplorePostCard";
import Loader from "@/components/ui/Loader";
import { useGetPostById } from "@/lib/react-query/QueryAndMutations";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const PostDetails = () => {
  const params = useParams();
  const postId = params.id;
  const navigate = useNavigate();
  const { data: post, isPending: isloading } = useGetPostById(postId!);
  const [, setOpen] = useState(true);
  if (!post || isloading) {
    return <Loader />;
  }

  const handleBack = () => {
    setOpen(false);
    navigate(-1); 
  };

  return (
    <div className="h-full w-full absolute left-0 bg-black/60 flex sm:pt-0 sm:items-center pt-32 justify-center">
      <div
        className="absolute top-20 right-5 cursor-pointer  z-[99]"
        onClick={handleBack}
      >
        <img
          src="/assets/icons/back.svg"
          alt="back"
          className="invert-white hidden md:flex h-8 w-8"
        />
      </div>
<div className="w-full flex justify-center ">
  <ExplorePostCard post={post}/>
</div>
    </div>
  );
};

export default PostDetails;
