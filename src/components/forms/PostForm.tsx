import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../FileUploader";
import { PostValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  useCreatePost,
  useUpdatePost,
} from "@/lib/react-query/QueryAndMutations";
import Loader from "../ui/Loader";

type PostProps = {
  post?: Models.Document;
  type: "Update" | "Create";
};
const PostForm = ({ post, type }: PostProps) => {
  const navigate = useNavigate();
  const { mutateAsync: createPost, isPending: isCreating } = useCreatePost();
  const { mutateAsync: updatePost, isPending: isUpdating } = useUpdatePost();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post?.location : "",
      tags: post ? post?.tags.join(",") : "",
    },
  });

  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if (post && type === "Update") {
      const Post = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      });
      if (!Post) return toast.error("error updating post.");
      toast.success("post updated successfully.");
      navigate("/");
    } else {
      const newPost = await createPost({
        ...values,
        userId: user.id,
      });
      if (!newPost) {
        toast.error("post creation failed.please try again.");
        return;
      }
      navigate("/");
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col w-full max-w-5xl gap-9"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  placeholder="caption"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">add photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">add location</FormLabel>
              <FormControl>
                <Input className="shad-input" type="text" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">tags</FormLabel>
              <FormControl>
                <Input
                  className="shad-input"
                  placeholder="#food #love #party"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 items-center">
          <Button className="shad-button_dark_4">Cancel</Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
          >
            {isCreating || isUpdating? (
              <div className="flex-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
