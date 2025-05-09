import { useState, useEffect } from "react";
import { Stethoscope } from "lucide-react";
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
import { toast } from "react-toastify";
import { resendOtp, verifyOTP } from "@/api/auth.api";

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
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
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
        <div className="relative z-10 text-white text-center max-w-md">
          <div className="bg-white/20 p-4 rounded-full inline-block mb-6">
            <Stethoscope className="h-14 w-14" />
          </div>
          <h2 className="text-4xl font-bold mb-6">Welcome to HealthCare</h2>
          <p className="text-xl font-light mb-8">
            &ldquo;Your health is our priority. Together, we create a healthier
            tomorrow.&#34;
          </p>
          <div className="w-16 h-1 bg-white/60 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center shadow-lg shadow-blue-100/50">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Xác thực tài khoản
            </h2>
            <p className="text-gray-600">
              Vui lòng nhập mã 6 số đã được gửi đến email của bạn
            </p>
          </div>

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
                    <FormLabel className="text-sm font-medium text-gray-700 block text-center mb-4">
                      Mã xác thực
                    </FormLabel>
                    <div className="flex justify-center gap-2 md:gap-3">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <FormControl key={index}>
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
                            className="w-10 h-14 md:w-12 md:h-16 text-center text-xl font-bold rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none disabled:bg-gray-100 disabled:text-gray-400"
                            disabled={isLoading}
                            maxLength={1}
                          />
                        </FormControl>
                      ))}
                    </div>
                    <FormMessage className="text-center mt-3" />
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
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xác thực...
                  </div>
                ) : (
                  "Xác thực"
                )}
              </Button>

              <div className="text-center text-gray-600">
                <p className="mb-2">Không nhận được mã?</p>
                <button
                  type="button"
                  onClick={() => handleResendCode()}
                  className={`text-blue-600 font-medium hover:text-blue-700 transition-colors ${
                    resendDisabled
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:underline"
                  }`}
                  disabled={isLoading || resendDisabled}
                >
                  {resendDisabled
                    ? `Gửi lại mã sau ${countdown}s`
                    : "Gửi lại mã"}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCode;
