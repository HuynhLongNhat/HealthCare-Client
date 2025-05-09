import { useState } from "react";
import { Eye, EyeOff, Stethoscope, Mail, Lock, Loader2, Heart, Shield, Activity } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
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
import { Checkbox } from "./ui/checkbox";
import { loginUser } from "@/api/auth.api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data) => {
    setIsLoading(true);
    const { email, password } = data;
    try {
      const res = await loginUser({ email, password });
      if (res && res.EC === 0) {
        const { accessToken, user } = res.DT;
        localStorage.setItem("accessToken", accessToken);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="md:w-2/5 relative hidden md:flex flex-col items-center bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500">
        <div className="absolute inset-0 bg-pattern opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }}></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 flex flex-col items-center justify-center h-full w-full px-8 max-w-md text-white"
        >
          <div className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-full">
            <Stethoscope size={48} className="text-white" />
          </div>
          
          <h2 className="text-4xl font-bold mb-6 text-center">HealthCare Online</h2>
          <p className="text-xl mb-12 text-center font-light">
            Chăm sóc sức khỏe mọi lúc, mọi nơi
          </p>
          
          <div className="grid grid-cols-1 gap-8 w-full max-w-xs">
            <motion.div 
              variants={itemVariants}
              className="flex items-center space-x-4"
            >
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Tư vấn y tế 24/7</h3>
                <p className="text-sm text-blue-50">Kết nối với bác sĩ mọi lúc</p>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="flex items-center space-x-4"
            >
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Chăm sóc toàn diện</h3>
                <p className="text-sm text-blue-50">Sức khỏe thể chất và tinh thần</p>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="flex items-center space-x-4"
            >
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-semibold">Bảo mật thông tin</h3>
                <p className="text-sm text-blue-50">An toàn và riêng tư tuyệt đối</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full space-y-6 bg-white p-8 rounded-2xl shadow-lg"
          >
            <div className="text-center">
              <Stethoscope className="h-10 w-10 text-blue-600 mx-auto md:hidden" />
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Đăng nhập</h2>
              <p className="mt-2 text-sm text-gray-600">
                Đăng nhập để tiếp tục sử dụng dịch vụ
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Email
                      </FormLabel>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Nhập email"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={isLoading}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />
                
                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Mật khẩu
                        </FormLabel>
                        <button
                          type="button"
                          className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors"
                          disabled={isLoading}
                          onClick={() => navigate("/forgot-password")}
                        >
                          Quên mật khẩu?
                        </button>
                      </div>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <FormControl>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu"
                            className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <FormMessage className="text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />
                
                {/* Remember me */}
                <div className="flex items-center mt-2">
                  <Checkbox
                    id="remember"
                    disabled={isLoading}
                    className="text-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm text-gray-700 cursor-pointer"
                  >
                    Lưu thông tin đăng nhập
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 py-3 text-white bg-blue-600 hover:bg-blue-700 transition-colors rounded-xl disabled:opacity-50 font-medium text-base shadow-md hover:shadow-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    "Đăng nhập"
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"/>
                  <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"/>
                  <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"/>
                  <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"/>
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
            
            <p className="mt-6 text-center text-sm text-gray-600">
              Bạn chưa có tài khoản?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:text-blue-500 font-semibold transition-colors"
                disabled={isLoading}
              >
                Đăng ký ngay
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;