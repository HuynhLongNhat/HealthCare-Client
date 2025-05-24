import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Home,
  Check,
  ArrowLeft,
  Lock,
  CheckCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import loginBg from "@/assets/login-bg.svg";
import loginTree from "@/assets/login-tree.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { resetPassword } from "@/api/auth.api";

// Define form schema
const formSchema = z
  .object({
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
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Mật khẩu không khớp",
    path: ["passwordConfirmation"],
  });

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error("Token không hợp lệ hoặc đã hết hạn");
      navigate("/login");
    }
  }, [token, navigate]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await resetPassword({
        token: token,
        newPassword: values.password,
      });

      if (response.data) {
        toast.success("Mật khẩu đã được cập nhật thành công!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Reset password error:", error);

      if (error.response?.status === 400) {
        toast.error(
          error.response.data.message || "Token không hợp lệ hoặc đã hết hạn"
        );
      } else if (error.response?.status === 404) {
        toast.error("Không tìm thấy người dùng");
      } else {
        toast.error(
          "Có lỗi xảy ra khi cập nhật mật khẩu. Vui lòng thử lại sau."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // if (!token) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
  //       <motion.div
  //         initial={{ opacity: 0, y: -20 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg"
  //         role="alert"
  //       >
  //         <strong className="font-bold">Lỗi!</strong>
  //         <span className="block sm:inline ml-2">
  //           Token không hợp lệ hoặc đã hết hạn.
  //         </span>
  //       </motion.div>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto px-4 py-8 lg:w-6xl">
      <div className="w-full rounded-2xl flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8">
          <div className="flex items-center mb-6 md:mb-8">
             <div className="flex items-center mb-6 md:mb-8">
            <Link
              to="/"
              className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Home className="h-4 w-4 mr-2 text-blue-500" />
              <span className="text-sm">Trang chủ</span>
            </Link>
          </div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Khôi phục mật khẩu
            </h2>
            <p className="text-gray-600 mb-6 w-[270px] sm:w-full">
              Vui lòng điền mật khẩu mới và xác nhận mật khẩu để hoàn tất quá
              trình đặt lại mật khẩu.
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Mật khẩu mới</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <FormControl>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu mới"
                            className="w-full px-10 py-6 border rounded-lg focus:outline-blue-500 focus:outline-2 transition-colors"
                            disabled={loading}
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

                <FormField
                  control={form.control}
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Xác nhận mật khẩu
                      </FormLabel>
                      <div className="relative">
                        <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <FormControl>
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Xác nhận mật khẩu"
                            className="w-full px-10 py-6 border rounded-lg focus:outline-blue-500 focus:outline-2 transition-colors"
                            disabled={loading}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                        >
                          {showConfirmPassword ? (
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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-lg transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span className="text-[15px]">Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      <span className="text-[15px]">Xác nhận</span>
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 flex justify-start">
              <Link
                to="/login"
                className="flex items-center text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="text-sm">Quay lại đăng nhập</span>
              </Link>
            </div>
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

export default ResetPassword;
