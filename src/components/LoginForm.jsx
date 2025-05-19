import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2, LogIn, Home } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { loginUser } from "@/api/auth.api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import loginBg from "@/assets/login-bg.svg";
import loginTree from "@/assets/login-tree.svg";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/(?=.*[a-z])/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
    .regex(/(?=.*[A-Z])/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
    .regex(/(?=.*\d)/, "Mật khẩu phải chứa ít nhất 1 số")
    .regex(
      /(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"
    ),
});

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
   const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      try {
        localStorage.setItem("token", token);
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate('/');
        toast.success("Đăng nhập thành công");
      } catch (error) {
        console.error("Lỗi xử lý đăng nhập:", error);
        toast.error("Có lỗi xảy ra khi xử lý đăng nhập");
      }
    }
  }, [searchParams]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const { email, password } = data;
    try {
      const res = await loginUser({ email, password });
      if (res && res.EC === 0) {
        const { accessToken, user } = res.DT;
          localStorage.setItem("token", accessToken);
          localStorage.setItem("user", JSON.stringify(user));
        toast.success(res.EM);
        navigate("/");
      }
      if ((res && res.EC === -1) || res.EC === -2) {
        toast.error(res.EM);
      }
    } catch (error) {
      console.log("error", error);
      const errorMessage =
        error.response?.data?.error?.details || error?.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8001/api/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:8001/api/auth/facebook";
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:w-6xl">
      <div className="w-full rounded-2xl flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8">
          <div className="flex items-center mb-6 md:mb-8">
            <Link
              to="/"
              className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Home className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-sm">Trang chủ</span>
            </Link>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
            <p className="text-gray-600 mb-8">Chào mừng bạn quay trở lại! 👋</p>

            {/* Social Login Buttons */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nhập email"
                            className="w-full px-10 py-6 border rounded-lg focus:outline-blue-500 focus:outline-2 transition-colors"
                            disabled={isLoading}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel className="text-sm">Mật khẩu</FormLabel>
                        <FormLabel
                          className="text-sm text-blue-700 cursor-pointer"
                          onClick={() => navigate("/forgot-password")}
                        >
                          Quên mật khẩu ?
                        </FormLabel>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <FormControl>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu"
                            className="w-full px-10 py-6 border rounded-lg focus:outline-blue-500 focus:outline-2 transition-colors"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-gray-500 text-sm">
                      Hoặc{" "}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row space-x-4 mb-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-1/2 py-6 flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
                    onClick={() => handleGoogleLogin()}
                  >
                    <FcGoogle className="w-5 h-5" />
                    <span>Đăng nhập với Google</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-1/2 py-6 flex items-center justify-center gap-2 border-gray-300 hover:bg-blue-50"
                    onClick={() => handleFacebookLogin()}
                  >
                    <FaFacebook className="w-5 h-5 text-blue-600" />
                    <span>Đăng nhập với Facebook</span>
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-lg transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span className="text-[15px]">Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      <span className="text-[15px]">Đăng nhập</span>
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <p className="text-center mt-6 text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Đăng ký ngay
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right Column - Image */}
        <div className="hidden md:flex md:w-1/2 lg:w-1/2 bg-gradient-to-br items-center justify-center">
          <motion.div
            className="flex w-1/2 items-center justify-center p-8"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <img
              src={loginBg}
              alt="Login background"
              className="max-w-52 md:max-w-96 h-auto"
            />
          </motion.div>
          <div className="flex md:w-1/2 items-center justify-center p-2 md:p-4 lg:p-6">
            <img
              src={loginTree}
              alt="Login tree"
              className="max-w-32 md:max-w-96 h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
