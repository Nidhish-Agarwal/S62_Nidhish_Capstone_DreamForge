import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { z } from "zod";
import {
  ArrowLeft,
  Key,
  Sparkles,
  Stars,
  CloudMoon,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
} from "lucide-react";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(
      z.object({
        password: z
          .string()
          .min(8, "Password must be at least 8 characters")
          .max(16, "Password can be at most 16 characters")
          .regex(/[A-Z]/, "Must include at least one uppercase letter")
          .regex(/[a-z]/, "Must include at least one lowercase letter")
          .regex(/\d/, "Must include at least one number")
          .regex(/[^A-Za-z0-9]/, "Must include at least one special character"),
      })
    ),
  });

  const watchedPassword = watch("password");

  // Get token from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromURL = urlParams.get("token");

    if (!tokenFromURL) {
      setInvalidToken(true);
    } else {
      setToken(tokenFromURL);
    }
  }, [location.search]);

  const onSubmit = async (data) => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    try {
      setLoading(true);
      await axiosPrivate.post("/auth/reset-password", {
        token,
        newPassword: data.password,
      });

      setPasswordReset(true);
      toast.success("✅ Password reset successful! Redirecting to login...");
      // Wait 3 seconds before navigating
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      const message =
        err.response?.data?.message || "Something went wrong. Try again.";

      if (message.includes("expired") || message.includes("Invalid")) {
        setInvalidToken(true);
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { strength: 0, label: "Very Weak", color: "text-red-400" },
      { strength: 1, label: "Weak", color: "text-orange-400" },
      { strength: 2, label: "Fair", color: "text-yellow-400" },
      { strength: 3, label: "Good", color: "text-blue-400" },
      { strength: 4, label: "Strong", color: "text-green-400" },
      { strength: 5, label: "Very Strong", color: "text-emerald-400" },
    ];

    return levels[score];
  };

  const passwordStrength = getPasswordStrength(watchedPassword);

  if (invalidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-red-400/20 to-orange-400/20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${15 + Math.random() * 25}px`,
                height: `${15 + Math.random() * 25}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Card className="backdrop-blur-xl bg-white/5 border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5" />

              <CardHeader className="relative z-10 text-center p-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-3 shadow-lg">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Link Expired
                </CardTitle>
                <p className="text-red-200 opacity-90 text-sm">
                  This reset link is invalid or has expired
                </p>
              </CardHeader>

              <CardContent className="relative z-10 p-8 pt-0">
                <div className="text-center space-y-6">
                  <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-6 backdrop-blur-sm">
                    <p className="text-red-200 text-sm">
                      The mystical portal has closed. Request a new password
                      reset to access your dream realm again.
                    </p>
                  </div>

                  <Button
                    onClick={() => navigate("/forgot-password")}
                    className="w-full h-12 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-500 hover:via-orange-500 hover:to-yellow-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
                  >
                    <Key className="w-5 h-5 mr-2" />
                    Request New Reset Link
                  </Button>

                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center justify-center w-full text-purple-300 hover:text-white transition-colors duration-200 text-sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        {/* Fewer floating orbs */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${15 + Math.random() * 25}px`,
              height: `${15 + Math.random() * 25}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Small constellation */}
        <div className="absolute top-20 right-20 opacity-20">
          <div className="relative">
            {[...Array(4)].map((_, i) => (
              <Stars
                key={i}
                className="absolute w-2 h-2 text-cyan-300 animate-twinkle"
                style={{
                  left: `${Math.cos((i * Math.PI) / 2) * 30}px`,
                  top: `${Math.sin((i * Math.PI) / 2) * 30}px`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center text-purple-300 hover:text-white transition-colors duration-200 mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Login
          </button>

          <Card className="backdrop-blur-xl bg-white/5 border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5" />

            <CardHeader className="relative z-10 text-center p-8">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 shadow-lg">
                  <Key className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                {passwordReset ? "Password Restored" : "Forge New Key"}
              </CardTitle>
              <p className="text-purple-200 opacity-90 text-sm">
                {passwordReset
                  ? "Your access to the dream realm has been restored"
                  : "Create a new sacred password to protect your dreams"}
              </p>
            </CardHeader>

            <CardContent className="relative z-10 p-8 pt-0">
              {!passwordReset ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label className="text-purple-200 font-medium flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-purple-400" />
                      New Sacred Password
                    </Label>
                    <div className="relative group">
                      <Input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create your mystical key..."
                        className="bg-white/10 backdrop-blur-sm text-white border border-white/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl h-12 text-lg pr-12 transition-all duration-300 placeholder:text-purple-300/60 group-hover:bg-white/15"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-purple-300 hover:text-white transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-focus-within:from-purple-500/10 group-focus-within:to-pink-500/10 transition-all duration-500 pointer-events-none" />
                    </div>

                    {/* Password Strength Indicator */}
                    {watchedPassword && (
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-purple-300">
                            Strength:
                          </span>
                          <span
                            className={`text-xs font-medium ${passwordStrength.color}`}
                          >
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordStrength.strength <= 1
                                ? "bg-red-500"
                                : passwordStrength.strength <= 2
                                ? "bg-yellow-500"
                                : passwordStrength.strength <= 3
                                ? "bg-blue-500"
                                : passwordStrength.strength <= 4
                                ? "bg-green-500"
                                : "bg-emerald-500"
                            }`}
                            style={{
                              width: `${
                                (passwordStrength.strength / 5) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {errors.password && (
                      <p className="text-pink-400 text-sm animate-pulse flex items-center">
                        <Stars className="w-3 h-3 mr-1" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-white/5 border border-white/20 rounded-xl p-4 space-y-2">
                    <p className="text-purple-200 text-sm font-medium flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Password Requirements
                    </p>
                    <div className="grid grid-cols-1 gap-1 text-xs">
                      {[
                        { regex: /.{8,}/, text: "At least 8 characters" },
                        { regex: /[A-Z]/, text: "One uppercase letter" },
                        { regex: /[a-z]/, text: "One lowercase letter" },
                        { regex: /\d/, text: "One number" },
                        {
                          regex: /[^A-Za-z0-9]/,
                          text: "One special character",
                        },
                      ].map((req, index) => (
                        <div key={index} className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              watchedPassword && req.regex.test(watchedPassword)
                                ? "bg-green-400"
                                : "bg-purple-400/40"
                            }`}
                          />
                          <span
                            className={`${
                              watchedPassword && req.regex.test(watchedPassword)
                                ? "text-green-300"
                                : "text-purple-300/70"
                            }`}
                          >
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg disabled:opacity-70 disabled:hover:scale-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        <span className="animate-pulse">
                          Forging new key...
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Key className="w-5 h-5 mr-2" />
                        Reset Password
                      </div>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-6">
                  {/* Success State */}
                  <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-6 backdrop-blur-sm">
                    <CloudMoon className="w-12 h-12 text-green-400 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Password Successfully Reset!
                    </h3>
                    <p className="text-green-200 text-sm">
                      Your mystical key has been forged. You'll be redirected to
                      the login portal shortly.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                    <p className="text-purple-200 text-sm opacity-80">
                      Redirecting to login in 3 seconds...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
