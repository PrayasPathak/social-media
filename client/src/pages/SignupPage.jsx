import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerUser } from "@/api/authService";

const Signup = () => {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const signUpHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await registerUser(input);
    console.log("API REsponse: ", { data, error });
    if (data?.accessToken) {
      toast.success("User registered successfully!");
      setInput({ fullName: "", email: "", password: "" });
      setFieldErrors({});
      navigate("/login");
    } else if (error) {
      // Show general error message toast
      if (error.message) toast.error(error.message);

      // Show all validation error messages as toasts
      if (error.validationErrors?.length) {
        error.validationErrors.forEach((msg) => toast.error(msg));
      }

      // Set field level errors to show inline errors
      if (error.fieldErrors) {
        setFieldErrors(error.fieldErrors);
      }
    } else {
      toast.error("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <form
        className="bg-white shadow-lg flex flex-col gap-5 p-8 w-full max-w-md rounded-xl"
        onSubmit={signUpHandler}
        noValidate
      >
        <div className="my-4 text-center">
          <h1 className="font-bold text-2xl">LOGO</h1>
          <p className="text-sm text-gray-600">
            Sign up to see photos from your friends
          </p>
        </div>

        {/* Full Name */}
        <div>
          <Label className="font-medium">Full Name</Label>
          <Input
            placeholder="John Doe"
            type="text"
            name="fullName"
            value={input.fullName}
            onChange={handleChange}
            className={`my-2 ${fieldErrors.fullName ? "border-red-500" : ""}`}
          />
          {fieldErrors.fullName && (
            <p className="text-sm text-red-500 mt-1">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label className="font-medium">Email</Label>
          <Input
            placeholder="john@doe.com"
            type="email"
            name="email"
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
            placeholder="Your password here"
            type="password"
            name="password"
            value={input.password}
            onChange={handleChange}
            className={`my-2 ${fieldErrors.password ? "border-red-500" : ""}`}
          />
          {fieldErrors.password && (
            <p className="text-sm text-red-500 mt-1">{fieldErrors.password}</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Signup"
          )}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline underline-offset-2"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
