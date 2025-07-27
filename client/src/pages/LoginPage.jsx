import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { loginUser } from "@/api/authService";
import { setAuthUser } from "@/redux/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await loginUser(input);

    if (data) {
      toast.success("Logged in successfully");
      dispatch(setAuthUser(data.accessToken));
      setInput({ email: "", password: "" });
      setFieldErrors({});
      navigate("/");
    }

    if (error) {
      if (error.message) toast.error(error.message);
      if (error.validationErrors?.length) {
        error.validationErrors.forEach((msg) => toast.error(msg));
      }
      if (error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <form
        className="bg-white shadow-lg flex flex-col gap-5 p-8 w-full max-w-md rounded-xl"
        onSubmit={loginHandler}
      >
        <div className="my-4 text-center">
          <h1 className="font-bold text-2xl">LOGO</h1>
          <p className="text-sm text-gray-600">
            Login to share photos and videos
          </p>
        </div>

        {/* Email */}
        <div>
          <Label className="font-medium">Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={input.email}
            onChange={handleChange}
            className={`my-2 ${fieldErrors.email ? "border-red-500" : ""}`}
          />
          {fieldErrors.email && (
            <p className="text-sm text-red-500 mt-1">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Label className="font-medium">Password</Label>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            value={input.password}
            onChange={handleChange}
            className={`my-2 ${fieldErrors.password ? "border-red-500" : ""}`}
          />
          {fieldErrors.password && (
            <p className="text-sm text-red-500 mt-1">{fieldErrors.password}</p>
          )}
        </div>

        {/* Submit */}
        <div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 hover:underline underline-offset-2"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
