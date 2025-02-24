import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "../api/axios.js";
import useAuth from "../hooks/useAuth.jsx";

// Validation Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password cannot be empty"),
});

export default function LoginForm() {
  const { setAuth, persist, setPersist } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectMessage, setRedirectMessage] = useState("");

  useEffect(() => {
    if (location.state?.from) {
      setRedirectMessage("You need to log in to access this feature.");
    }
  }, [location.state?.from]);

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await axios.post("/user/login", data, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setErrorMessage("");
        const accessToken = response.data?.accessToken;
        const roles = response.data?.roles;
        const userId = response.data?._id;
        setAuth({
          userId,
          accessToken,
          roles,
        });
        navigate(from, { replace: true });
      }
    } catch (err) {
      if (!err?.response) {
        console.log(err);
        setErrorMessage("No server response. Please check your internet.");
      } else if (err.response?.status === 401) {
        setErrorMessage("Invalid credentials");
      } else {
        console.log(err);
        setErrorMessage("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md p-6 shadow-lg border border-gray-700 bg-gray-800 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <p className="text-gray-400 text-sm mt-1">Log in to continue</p>
        </CardHeader>
        <CardContent>
          {redirectMessage && (
            <p className="text-yellow-400 text-center mb-2">
              {redirectMessage}
            </p>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  Logging in...
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center mt-2">
              {errorMessage}
            </p>
          )}

          {/* Signup Redirect */}
          <p className="text-center text-sm text-gray-400 mt-3">
            Don't have an account?{" "}
            <a href="/signup" className="text-indigo-400 hover:text-indigo-500">
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
