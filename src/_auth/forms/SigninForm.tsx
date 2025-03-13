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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Signinvalidation } from "@/lib/validation";
import Loader from "@/components/ui/Loader";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSignInAccount } from "@/lib/react-query/QueryAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { sendPasswordReset } from "@/lib/appwrite/api";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialog,
  AlertDialogCancel,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const SigninForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();
  const { mutateAsync: signInAccount, isPending: isLogging } =
    useSignInAccount();
  const form = useForm<z.infer<typeof Signinvalidation>>({
    resolver: zodResolver(Signinvalidation),
    defaultValues: {
      password: "",
      email: "",
    },
  });
  const [passwordEmail, setPasswordEmail] = useState("");

  async function onSubmit(values: z.infer<typeof Signinvalidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    if (!session.success) {
      return toast.error(session.message);
    }
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
<div className="h-32 w-full md:w-[70%]">
<img src="/assets/images/logo.svg" alt="logo" className="h-full w-full object-cover" />
</div>
        <h2 className="h3-bold md:h2-bold pt-5">Log in to your account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          welcome back!! enter your details{" "}
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="text-red" />
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
                <FormMessage className="text-red" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLogging}
            className="shad-button_primary w-full"
          >
            {isLogging ? (
              <div className="flex-center gap-2">
                <Loader />
                Loading...
              </div>
            ) : (
              "Sign-In"
            )}
          </Button>
        </form>
        <AlertDialog>
          <AlertDialogTrigger className="text-red underline text-sm mt-5">
            reset password
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>enter your email</AlertDialogTitle>
            </AlertDialogHeader>
            <Input
              className="shad-input"
              placeholder="email"
              value={passwordEmail}
              onChange={(e) => setPasswordEmail(e.target.value)}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button className="bg-primary-500"
                onClick={() => sendPasswordReset(passwordEmail)}
              >Submit</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* <p className="mt-5 font-semibold">or</p>   */}
        {/* <Button
          onClick={()=>signInWithGoogle()}
          className="w-full bg-white/10 mt-5 py-6 flex items-center justify-center"
        >          <img
            src="/assets/icons/google.png"
            className="w-25 h-20"
            alt="google"
          />
        </Button> */}
        <div className="flex items-center justify-center mt-1">
          <p className="text-sm text-light-2 text-center m-2">
            don't have an account?
          </p>
          <Link
            className="text-primary-500 text-small-semibold ml-1"
            to="/signUp"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </Form>
  );
};

export default SigninForm;
