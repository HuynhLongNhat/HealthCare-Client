import { useState } from "react";
import { Loader2, Home, User, Check, ArrowLeft } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import loginBg from "@/assets/login-bg.svg";
import loginTree from "@/assets/login-tree.svg";
import { forgotPassword } from "@/api/auth.api";
const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});
const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const { email } = data;
    try {
      const res = await forgotPassword({ email });
      if (res && res.data.EC === 0) {
        toast.success(res.data.EM);
        form.reset();
      } else {
        toast.error(res.data.EM);
        form.reset();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Quên mật khẩu
            </h2>
            <p className="text-gray-600 mb-6 w-[270px] sm:w-full ">
              Vui lòng điền email bạn đã đăng ký cho tài khoản muốn khôi phục
              mật khẩu
            </p>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 sm:space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 rounded-lg transition-colors duration-200 mt-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm sm:text-[15px]">
                        Đang xử lý...
                      </span>
                    </>
                  ) : (
                    <>
                      <Check />
                      <span className="text-sm sm:text-[15px]">Xác nhận</span>
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

export default ForgotPassword;
