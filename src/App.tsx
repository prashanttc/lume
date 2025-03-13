import AuthLayout from "./_auth/AuthLayout";
import SigninForm from "./_auth/forms/SigninForm";
import SignupForm from "./_auth/forms/SignupForm";
import PasswordReset from "./_auth/PasswordReset";
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from "./_root/pages";
import RootLayout from "./_root/RootLayout";
import "./global.css";
import { Toaster } from "@/components/ui/sonner"
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout/>}>
        <Route path="/signIn" element={<SigninForm />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/signUp" element={<SignupForm />} />
        </Route>
        {/* private route */}
        <Route element={<RootLayout/>}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore/>}/>
        <Route path="/saved" element={<Saved/>}/>
        <Route path="/create-post" element={<CreatePost/>}/>
        <Route path="/update-post/:id" element={<EditPost/>}/>
        <Route path="/posts/:id" element={<PostDetails/>}/>
        <Route path="/profile/:id" element={<Profile/>}/>
        <Route path="/all-users" element={<AllUsers/>}/>
        <Route path="/update-profile/:id" element={<UpdateProfile/>}/>
        </Route>
      </Routes>
      <Toaster visibleToasts={1} richColors={true}/>
    </main>
  );
}

export default App;
