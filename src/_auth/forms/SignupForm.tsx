import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage ,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Signupvalidation } from "@/lib/validation";
import Loader from "@/components/ui/Loader";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/QueryAndMutations";
import { useUserContext } from "@/context/AuthContext";
  
const SignupForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();
  const { mutateAsync: createUserAccount, isPending: isCreating } =
    useCreateUserAccount();
  const { mutateAsync: signInAccount } = useSignInAccount();

  const form = useForm<z.infer<typeof Signupvalidation>>({
    resolver: zodResolver(Signupvalidation),
    defaultValues: {
      name: "",
      password: "",
      email: "",
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof Signupvalidation>) {
    const response = await createUserAccount(values);
    if (!response.success) {
      toast.error(response.message);
      form.setError("email", {
        type: "manual",
        message: response.message,
      });
      return;
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    if (!session) return toast.error("sign up failed.please try again");
    const isLoggedIn = await checkAuthUser();
    if (isLoggedIn) {
      form.reset();
      navigate("/home");
    } else {
      toast.error("sign up,please try again.");
    }
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
 <h2 className="h3-bold md:h2-bold pt-5">Create a new Account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          to use lume,please enter your account details
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className='text-red' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className='text-red' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className='text-red' />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isCreating}
            className="shad-button_primary w-full"
          >
            {isCreating ? (
              <div className="flex-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              "Sign-up"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center m-2">
            already have an account?
            <Link
              className="text-primary-500 text-small-semibold ml-1"
              to="/signIn"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
