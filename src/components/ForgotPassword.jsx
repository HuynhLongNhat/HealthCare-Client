import { useState } from "react";
import { Mail, Stethoscope, Loader2, ChevronLeft } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "@/service/authService";
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

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});
const ForgotPassword = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      <div
        className="md:w-1/2 bg-primary relative hidden md:flex flex-col justify-center items-center p-12"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1631217868264-e5b90bb7e133)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-primary/70"></div>
        <div className="relative z-10 text-white text-center">
          <Stethoscope className="text-6xl mb-6 mx-auto" />
          <h2 className="text-3xl font-bold mb-4">Welcome to HealthCare</h2>
          <p className="text-xl italic">
            &ldquo;Your health is our priority. Together, we create a healthier
            tomorrow.&ldquo;
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl"
        >
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">
              Quên mật khẩu
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Đừng lo lắng! Chỉ cần nhập email của bạn và chúng tôi sẽ gửi hướng
              dẫn đặt lại mật khẩu.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email
                      </FormLabel>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            className="w-full pl-10 pr-4 py-6 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="w-full mt-4 py-6 text-white bg-blue-600 hover:bg-blue-600/90 transition-colors rounded-md disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading...</span>
                      </>
                    </>
                  ) : (
                    <>
                      <Mail className="h-10 w-10" />
                      <span>Gửi</span>
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  disabled={isLoading}
                  onClick={() => navigate("/")}
                >
                  <ChevronLeft className="h-10 w-10" />
                  Quay lại trang chủ
                </Button>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
