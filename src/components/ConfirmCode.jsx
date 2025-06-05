import { useState, useEffect } from "react";
import { ArrowLeft, Check, Home, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { resendOtp, verifyOTP } from "@/api/auth.api";
import { motion } from "framer-motion";
import loginBg from "@/assets/login-bg.svg";
import loginTree from "@/assets/login-tree.svg";
// Định nghĩa schema xác thực với mã gồm 6 số
const confirmCodeSchema = z.object({
  verificationCode: z.array(z.string().regex(/^\d$/)).length(6, {
    message: "Mã xác thực phải gồm 6 chữ số",
  }),
});

const ConfirmCode = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const email = localStorage.getItem("registeredEmail");
  const form = useForm({
    resolver: zodResolver(confirmCodeSchema),
    defaultValues: {
      verificationCode: ["", "", "", "", "", ""],
    },
  });

  const onSubmit = async (data) => {
    const otp = data.verificationCode.join("");
    setIsLoading(true);
    try {
      const res = await verifyOTP(email, otp);
      if (res && res.EC === 0) {
        toast.success(res.EM);
        navigate("/login");
      }
    } catch (error) {
      console.log("error", error);
      const errorMessage =
        error.response?.data?.error?.details || error?.message;
      toast.error(errorMessage || "Đã xảy ra lỗi khi xác thực");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const res = await resendOtp(email);
      if (res && res.EC === 0) {
        toast.success(res.EM);
        setResendDisabled(true);
        setCountdown(60);
      }
      if (res && res.EC === 1) {
        toast.error(res.EM);
      }
      if (res && res.EC === 2) {
        toast.error(res.EM);
      }
      if (res && res.EC === 3) {
        toast.error(res.EM);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.details || error?.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const inputRefs = Array(6)
    .fill(0)
    .map(() => useState(null));

  const handleCodeChange = (index, value) => {
    const newValues = [...form.getValues().verificationCode];
    const numericValue = value.replace(/\D/g, "").slice(0, 1);
    newValues[index] = numericValue;
    form.setValue("verificationCode", newValues);
    if (numericValue && index < 5 && inputRefs[index + 1][0]) {
      inputRefs[index + 1][0].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !form.getValues().verificationCode[index] &&
      index > 0
    ) {
      e.preventDefault();
      inputRefs[index - 1][0].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text/plain")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData) {
      const values = [...form.getValues().verificationCode];
      for (let i = 0; i < pastedData.length && i < 6; i++) {
        values[i] = pastedData[i];
      }
      form.setValue("verificationCode", values);

      // Focus vào ô cuối cùng đã dán hoặc ô cuối cùng nếu dán đủ 6 số
      const focusIndex = Math.min(pastedData.length - 1, 5);
      if (inputRefs[focusIndex][0]) {
        inputRefs[focusIndex][0].focus();
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 lg:w-6xl">
      <div className="w-full rounded-2xl flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8">
          <div className="flex items-center mb-6 md:mb-8">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center group"
            >
              <Home
                size={16}
                className="mr-2 text-blue-500 group-hover:text-blue-700 transition-colors"
              />
              <span className="font-medium">Trang chủ</span>
            </Link>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-blue-600 mb-2">
              {" "}
              Xác thực tài khoản
            </h2>
            <p className="text-gray-600 mb-8">
              {" "}
              Vui lòng nhập mã 6 số đã được gửi đến email của bạn👋
            </p>

            {/* Social Login Buttons */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="verificationCode"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-6 text-center">
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          Mã xác minh
                        </FormLabel>
                        <p className="text-xs text-gray-500">
                          Nhập 6 chữ số đã gửi đến email của bạn
                        </p>
                      </div>

                      <div className="flex justify-center gap-3">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <FormControl key={index}>
                            <motion.div
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                              className="relative"
                            >
                              <input
                                ref={(el) => inputRefs[index][1](el)}
                                type="text"
                                inputMode="numeric"
                                value={field.value[index]}
                                onChange={(e) =>
                                  handleCodeChange(index, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={index === 0 ? handlePaste : undefined}
                                onFocus={(e) => e.target.select()}
                                className={`
                  w-14 h-14 md:w-16 md:h-16
                  text-2xl font-semibold text-center
                  bg-white border-2 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  transition-all duration-150
                  ${
                    field.value[index]
                      ? "border-blue-500 text-blue-600 focus:ring-blue-200 shadow-blue-100 shadow-inner"
                      : "border-gray-300 text-gray-800 focus:ring-gray-200 hover:border-gray-400"
                  }
                  ${isLoading ? "bg-gray-50 cursor-not-allowed" : ""}
                `}
                                disabled={isLoading}
                                maxLength={1}
                              />

                              {/* Animation indicator */}
                              {field.value[index] && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute inset-x-0 -bottom-1 mx-auto w-6 h-1 bg-blue-500 rounded-full"
                                />
                              )}
                            </motion.div>
                          </FormControl>
                        ))}
                      </div>

                      <FormMessage className="mt-3 text-center text-sm font-medium text-rose-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 rounded-lg text-base font-medium shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Đang xác thực...
                    </div>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Xác thực
                    </>
                  )}
                </Button>

                <div className="mt-6 flex justify-between items-center flex-wrap gap-4">
                  <Link
                    to="/login"
                    className="flex items-center text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    <span className="text-sm">Quay lại đăng nhập</span>
                  </Link>
                  <div className="text-gray-600 flex items-center gap-2">
                    <p className="mb-0">Không nhận được mã?</p>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className={`text-blue-600 font-medium transition-colors ${
                        resendDisabled
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:text-blue-700 hover:underline"
                      }`}
                      disabled={isLoading || resendDisabled}
                    >
                      {resendDisabled
                        ? `Gửi lại mã sau ${countdown}s`
                        : "Gửi lại mã"}
                    </button>
                  </div>
                </div>
              </form>
            </Form>
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

export default ConfirmCode;
