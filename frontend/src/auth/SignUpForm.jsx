import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";
// import axios from "../api/axios.js";

// Validation Schema
const signupSchema = z
  .object({
    username: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(16, "Password can be at most 16 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[a-z]/, "Must include at least one lowercase letter")
      .regex(/\d/, "Must include at least one number")
      .regex(/[^A-Za-z0-9]/, "Must include at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupForm() {
  const { setAuth, persist, setPersist } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/user/signup", data, {
        withCredentials: true,
      });
      if (response.status === 201) {
        // User created successfully
        console.log(response);
        setErrorMessage("");
        const accessToken = response.data?.accessToken;
        const roles = response.data?.user?.roles;
        const userId = response.data?.user?._id;
        setAuth({
          userId,
          accessToken,
          roles,
        });
        navigate("/dashboard"); // Redirect to login page
      }
    } catch (err) {
      if (!err?.response) {
        setErrorMessage("No server response. Please check your internet.");
      } else if (err.response?.status === 409) {
        setErrorMessage("Email is already taken. Try a different one.");
      } else {
        setErrorMessage("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md p-6 shadow-lg border border-gray-700 bg-gray-800 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Create an Account
          </CardTitle>
          <p className="text-gray-400 text-sm mt-1">
            Join us and start your journey!
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div>
              <Label className="text-gray-300">Name</Label>
              <Input
                {...register("username")}
                type="text"
                placeholder="John Doe"
                className="mt-1 bg-gray-700 text-white border border-gray-600 focus:ring-indigo-500"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <Label className="text-gray-300">Email</Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="mt-1 bg-gray-700 text-white border border-gray-600 focus:ring-indigo-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <Label className="text-gray-300">Password</Label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="mt-1 bg-gray-700 text-white border border-gray-600 focus:ring-indigo-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <Label className="text-gray-300">Confirm Password</Label>
              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="mt-1 bg-gray-700 text-white border border-gray-600 focus:ring-indigo-500 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="persist"
                checked={persist}
                onChange={togglePersist}
                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
              />
              <Label htmlFor="persist" className="ml-2 text-gray-300">
                Remember me
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-2 bg-indigo-500 hover:bg-indigo-600"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing Up...
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center mt-2">
              {errorMessage}
            </p>
          )}

          {/* Already have an account? */}
          <p className="text-center text-sm text-gray-400 mt-3">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-400 hover:text-indigo-500">
              Log in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
