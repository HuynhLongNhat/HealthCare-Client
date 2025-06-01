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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Eye, EyeOff, Loader2, UserPlus2, X } from "lucide-react";
import { toast } from "react-toastify";
import { createNewUser } from "@/api/auth.api";

const formSchema = z.object({
  fullname: z.string().min(1, "Họ và tên không được để trống"),
  username: z.string().min(1, "Tên người dùng không được để trống"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .length(10, "Số điện thoại phải chứa 10 chữ số")
    .regex(/^\d+$/, "Số điện thoại chỉ được chứa số"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
});

const CreateNewUser = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullname: "",
      password: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const newUser = await createNewUser({
        ...values,
      });
      if (newUser.EC === 0) {
        navigate("/admin/users");
        toast.success(newUser.EM);
      }
      if (newUser.EC === -1) {
        toast.error(newUser.EM);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message;
      console.error("Error message:", errorMessage);
      console.log(error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Thêm người dùng mới
          </h1>
          <p className="text-gray-600 mt-2 dark:text-gray-300">
            Điền thông tin để thêm một người dùng mới
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8"
          >
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-200">
                        Họ và tên
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập họ và tên"
                          {...field}
                          disabled={isLoading}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-200">
                        Tên người dùng
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tên người dùng"
                          {...field}
                          disabled={isLoading}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-200">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập email"
                          {...field}
                          disabled={isLoading}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm dark:text-gray-200">
                        Mật khẩu
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu"
                            disabled={isLoading}
                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none text-gray-500 dark:text-gray-300"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-200">
                        Số điện thoại
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập số điện thoại"
                          {...field}
                          disabled={isLoading}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="dark:text-gray-200">
                        Địa chỉ
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập địa chỉ"
                          {...field}
                          disabled={isLoading}
                          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => navigate("/admin/users")}
                  className="dark:border-gray-500 dark:text-white hover:dark:bg-gray-700"
                >
                  <X />
                  Hủy
                </Button>
                <Button
                  variant="info"
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus2 size={20} />
                      <span>Thêm mới</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateNewUser;
