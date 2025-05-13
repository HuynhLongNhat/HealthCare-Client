import { useState, useEffect } from "react";
import {
  Building2,
  Check,
  FileText,
  Home,
  Image,
  Upload,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import {  createNewHealthHandbook } from "@/api/doctor.api";
import { toast } from "react-toastify";
import MarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import ReactMarkdown from "react-markdown";
import "highlight.js/styles/github-dark.css";
import useAuthToken from "@/utils/userAuthToken";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
// ===== Validation Schema =====
const clinicFormSchema = z.object({
  title: z.string().min(1, "Tiêu đề bài viếtkhông được để trống"),
  slug: z.string().min(1, "Slug không được để trống"),
  content: z.string().min(1, "Nội dung bài viết không được để trống"),
});

const CreateNewHandBook = () => {
  const auth = useAuthToken();
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const form = useForm({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
    },
  });

  const title = useWatch({
    control: form.control,
    name: "title",
  });

  useEffect(() => {
    if (title) {
      const slug = slugify(title, {
        lower: true,
        strict: true,
        locale: "vi",
      });
      const uniqueSlug = `${slug}-${uuidv4().split("-")[0]}`;
      form.setValue("slug", uniqueSlug);
    }
  }, [title, form.setValue]);
  // ===== Upload Helper =====
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_DB
      }/image/upload`,
      formData
    );
    return res.data.secure_url;
  };

  // ===== Avatar Handler =====
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setAvatar(file);
      const url = await uploadImageToCloudinary(file);
      setAvatarUrl(url);
    } catch {
      toast.error("Lỗi khi tải ảnh đại diện");
    }
  };

  const handleEditorChange = ({ text }) => {
    form.setValue("content", text);
  };

  // ===== Submit Form =====
  const onSubmit = async (values) => {
    if (!avatarUrl) {
      toast.warning("Vui lòng tải lên hình ảnh đại diện");
      return;
    }
    try {
      setLoading(true);
      const res = await createNewHealthHandbook({
        ...values,
        image: avatarUrl,
        author_id : auth.userId
      });
      if (res?.EC === 0) {
        toast.success(res.EM);
        navigate(-1);
      } else {
        toast.error(res.EM || "Đã xảy ra lỗi");
      }
    } catch (err) {
      toast.error("Lỗi gửi dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 mt-20 bg-white shadow-md rounded-lg mb-3">
      <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
        <ol className="list-reset flex">
          <li>
            <Link to="/" className="text-blue-600 hover:underline">
              <Home size={18} />
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/cam-nang-suc-khoe")}
          >
            Cẩm nang sức khỏe
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate(`/doctor/${doctorId}/handbooks`)}
          >
            Bài viết của tôi
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-500">Tạo mới </li>
        </ol>
      </nav>
      <Card className="border-none shadow-lg mt-5">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="flex flex-row items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-blue-800">
                Tạo bài viết mới
              </h2>
              <p className="text-gray-600">
                Hãy chia sẻ những kiến thức hữu ích, mẹo chăm sóc sức khỏe hoặc
                kinh nghiệm phòng bệnh đến cộng đồng.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Thông tin cơ bản */}
              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-blue-500" />
                  Thông tin cơ bản
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-gray-700">
                          Tiêu đề bài viết
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tiêu đề bài viết"
                            {...field}
                            className="focus-visible:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-gray-700">
                          Slug
                        </FormLabel>
                        <FormControl>
                          <Input {...field} disabled className="bg-gray-50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Hình ảnh */}
              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Image className="mr-2 h-5 w-5 text-blue-500" />
                  Hình ảnh bài viết
                </h3>

                <FormItem className="mb-6">
                  <FormLabel className="font-medium text-gray-700">
                    Hình ảnh bài viết
                  </FormLabel>
                  <div className="flex items-center justify-center w-full">
                    <div className="flex flex-col items-center justify-center w-full h-48 md:h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative transition-all">
                      {avatar ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img
                            src={
                              typeof avatar === "string"
                                ? avatar
                                : URL.createObjectURL(avatar)
                            }
                            alt="Preview"
                            className="w-auto h-full max-h-full object-contain rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 rounded-full h-8 w-8 shadow-md hover:shadow-lg transition-all"
                            onClick={() => {
                              setAvatar(null);
                              setAvatarUrl(null);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          {avatarUrl && (
                            <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-md">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center pt-5 pb-6 w-full h-full cursor-pointer">
                          <div className="bg-blue-50 p-3 rounded-full mb-2">
                            <Upload className="w-6 h-6 text-blue-500" />
                          </div>
                          <p className="mb-2 text-sm text-gray-700">
                            <span className="font-semibold">
                              Click để tải ảnh
                            </span>{" "}
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
                  {!avatarUrl && (
                    <p className="text-sm text-red-500 mt-1">
                      Hình ảnh đại diện là bắt buộc
                    </p>
                  )}
                </FormItem>
              </div>

              {/* Mô tả */}
              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-500" />
                  Nội dung bài viết
                </h3>

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Nội dung bài viết
                      </FormLabel>
                      <FormControl>
                        <div className="border rounded-md overflow-hidden">
                          <MarkdownEditor
                            style={{ height: 350 }}
                            value={field.value}
                            onChange={handleEditorChange}
                            renderHTML={(text) => (
                              <ReactMarkdown>{text}</ReactMarkdown>
                            )}
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
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => navigate(-1)}
                  className="border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <X className="mr-2 h-4 w-4" /> Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-white rounded-full"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Tạo mới
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateNewHandBook;
