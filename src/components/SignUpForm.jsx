import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Stethoscope,
  User,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { toast } from "react-toastify";
import { registerUser } from "@/api/auth.api";
import { motion } from "framer-motion";

const formSchema = z
  .object({
    username: z.string().min(1, "Tên đăng nhập không được để trống"),
    full_name: z.string().min(1, "Họ và tên không được để trống"),
    email: z
      .string()
      .min(1, "Email không được để trống")
      .email("Email không hợp lệ"),
    phone_number: z
      .string()
      .min(1, "Số điện thoại không được để trống")
      .regex(/^[0-9]{10}$/, "Số điện thoại không hợp lệ"),
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
    confirmPassword: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      full_name: "",
      phone_number: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await registerUser(data);
      if (res && res.EC === 0) {
        toast.success(res.EM);
        localStorage.setItem("registeredEmail", data.email);
        navigate("/verify-code");
      }
      if (res && res.EC === 1) {
        toast.error(res.EM);
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.EM || error.message || "Có lỗi xảy ra";
      toast.error(errorMessage);
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

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-center mb-6">
              Đăng ký tài khoản
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        User name
                      </FormLabel>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter your user name"
                            className="w-full pl-10 pr-4 py-6 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
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
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Full name
                      </FormLabel>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter your name"
                            className="w-full pl-10 pr-4 py-6 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Phone number
                      </FormLabel>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Enter your phone number"
                            className="w-full pl-10 pr-4 py-6 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Password
                      </FormLabel>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <FormControl>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="w-full pl-10 pr-10 py-6 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Confirm password
                      </FormLabel>
                      <div className="relative mt-1">
                        <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <FormControl>
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="w-full pl-10 pr-10 py-6 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                            disabled={isLoading}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none text-gray-500"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit button */}
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
                    "Sign Up"
                  )}
                </Button>
              </form>
            </Form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Bạn đã có tài khoản?{" "}
              <button
                type="button"
                onClick={() => {
                  navigate("/login");
                }}
                className="text-blue-600 hover:underline font-bold"
                disabled={isLoading}
              >
                Đăng nhập
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
