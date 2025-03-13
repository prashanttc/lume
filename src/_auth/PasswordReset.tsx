import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePassword } from "@/lib/appwrite/api";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  const navigate = useNavigate();
  if (!userId || !secret) {
    return <p>error</p>;
  }
  const handlepasswordreset = async () => {
    const response = await updatePassword({ userId, secret, password });
    if (response.success) {
      navigate("/signIn");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <p className="text-white text-sm">enter new password</p>
      <Input
        className="shad-input"
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button className="bg-primary-500" onClick={handlepasswordreset}>
        Submit
      </Button>
    </div>
  );
};

export default PasswordReset;
