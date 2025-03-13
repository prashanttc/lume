import FileUploader from "@/components/FileUploader";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/Loader";
import { UserValidation } from "@/lib/validation";
import {
  useGetCurrentUser,
  useGetUserById,
  useUpdateUserProfile,
} from "@/lib/react-query/QueryAndMutations";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const UpdateProfile = () => {
  const param = useParams();
  const id = param.id;
  const navigate = useNavigate();
  const { data: user, isPending: isGettingUser } = useGetUserById(id!);
  const { mutateAsync: updateProfile, isPending } = useUpdateUserProfile();
  const { data: currentUser, isPending: isgettinguser } = useGetCurrentUser();
  const isCurrentUser = currentUser?.$id === id;
  if(!isCurrentUser){
    navigate(`/profile/${id}`)
  }
  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      name: "",
      file: [],
      bio: "",
    },
  });
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        file: [],
        bio: user.bio || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    const result = await updateProfile({ ...values, userId: id! });
    if (!result) return toast.error("Error updating user.");
    toast.success("Profile updated successfully.");
    navigate(`/profile/${id}`);
  };

  return (
    <div className="w-full p-10 xl:p-20">
      <p className="text-xl font-semibold mb-10">Edit Profile</p>
      {isGettingUser || isgettinguser ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 flex flex-col w-full max-w-5xl gap-9"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Name</FormLabel>
                    <FormControl>
                      <Input
                        className="shad-input"
                        placeholder="Enter your name"
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
                    <FormLabel className="shad-form_label">
                      Update Profile Photo
                    </FormLabel>
                    <FormControl>
                      <FileUploader
                        fieldChange={field.onChange}
                        mediaUrl={user?.imageUrl}
                      />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">
                      Update Bio
                    </FormLabel>
                    <FormControl>
                      <Input className="shad-input" type="text" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4 items-center">
                <Button
                  type="button"
                  onClick={() => navigate(`/profile/${id}`)}
                  className="shad-button_dark_4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="shad-button_primary whitespace-nowrap"
                >
                  {isPending ? (
                    <div className="flex-center gap-2">
                      <Loader />
                      Loading...
                    </div>
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default UpdateProfile;
