import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { createNewSpecializations, getSpecializationsById, updateSpecializations } from "@/api/doctor.api";
import { toast } from "react-toastify";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import MarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import ReactMarkdown from "react-markdown";
// Define validation schema
const formSchema = z.object({
  name: z.string().min(1, "Tên chuyên khoa là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  avatar: z.string().min(1, "Ảnh đại diện là bắt buộc"),
});

const UpdateSpecialization = () => {
  const {specializationId} = useParams()
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      avatar: "",
    },
  });

  useEffect(() => {
    fetchSpecializationDetails();
   }, []);
 
     const fetchSpecializationDetails = async () => {
     try {
       const res = await getSpecializationsById(specializationId);
       const data = res?.DT;
       if (data) {
         form.setValue("name", data.name || "");
         form.setValue("description", data.description || "");
         form.setValue("avatar", data.avatar || "");
         setAvatarPreview(data.avatar || "");

       }
     } catch (error) {
       console.error(error);
     }
   }
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      setLoading(true);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_DB
        }/image/upload`,
        formData
      );
      form.setValue("avatar", response.data.secure_url);
      toast.success("Tải ảnh lên thành công");
    } catch (error) {
      toast.error("Lỗi khi tải ảnh lên");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await updateSpecializations(specializationId ,{
        name: values.name,
        description: values.description,
        avatar: values.avatar,
      });
      if (res && res.EC === 0) {
        toast.success(res.EM);
        navigate(-1);
      } else if (res && res.EC === -1) {
        toast.error(res.EM);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi thêm chuyên khoa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Button
            variant="ghost"
            className="w-9 h-9 p-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Chỉnh sửa thông tin chuyên khoa </h2>
            <p className="text-muted-foreground">
          Cập nhật thông tin cho chuyên khoa
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình ảnh đại diện</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-center w-full">
                        <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative">
                          {avatarPreview ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <img
                                src={avatarPreview}
                                alt="Preview"
                                className="w-auto h-full max-h-full object-contain rounded-lg"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={() => {
                                  setAvatarPreview(null);
                                  form.setValue("avatar", "");
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-gray-500" />
                              <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click để tải ảnh</span>{" "}
                                hoặc kéo thả vào đây
                              </p>
                              <p className="text-xs text-gray-500">
                                PNG, JPG (Tối đa 2MB)
                              </p>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên chuyên khoa</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên chuyên khoa"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <div className="border rounded-md">
                        <MarkdownEditor
                          style={{ height: 300 }}
                          value={field.value}
                          onChange={({ text }) => field.onChange(text)} // Sửa ở đây
                          renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
                          config={{
                            view: { md: true, html: true, menu: true },
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Cập nhật"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateSpecialization;