import { useState, useEffect } from "react";
import { ArrowLeft, Building2, Check, ChevronRight, FileText, Home, Image, MapPin, Plus, Trash2, Upload, UploadCloud, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import { getProvinces, getDistricts, getWards } from "@/api/address.api";
import { createClinic, getAllDoctors } from "@/api/doctor.api";
import { toast } from "react-toastify";
import MarkdownEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { ComboBox } from "@/components/Combobox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactMarkdown from 'react-markdown';
import 'highlight.js/styles/github-dark.css';
import useAuthToken from "@/utils/userAuthToken";
// ===== Validation Schema =====
const clinicFormSchema = z.object({
  name: z.string().min(1, "Tên cơ sở y tế không được để trống"),
  doctor_id: z.string().min(1, "Vui lòng chọn bác sĩ"),
  description: z.string().min(1, "Mô tả không được để trống"),
  provinceId: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
  districtId: z.string().min(1, "Vui lòng chọn quận/huyện"),
  wardId: z.string().min(1, "Vui lòng chọn phường/xã"),
  streetAddress: z.string().min(1, "Vui lòng nhập số nhà, tên đường"),
});

const ClinicCreate = () => {
  const auth = useAuthToken();
  const {doctorId}  = useParams()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryUrls, setGalleryUrls] = useState([]);

  const form = useForm({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: "",
      doctor_id: "",
      description: "",
      provinceId: "",
      districtId: "",
      wardId: "",
      streetAddress: "",
    },
  });

  const provinceId = useWatch({ control: form.control, name: "provinceId" });
  const districtId = useWatch({ control: form.control, name: "districtId" });

  // ===== FETCH DATA =====
  useEffect(() => {
    getAllDoctors().then(res => setDoctors(res.DT || []));
    getProvinces().then(setProvinces).catch(() => toast.error("Không thể tải danh sách tỉnh/thành phố"));
  }, []);

  useEffect(() => {
    if (provinceId) {
      getDistricts(Number(provinceId)).then(setDistricts).catch(() =>
        toast.error("Không thể tải danh sách quận/huyện")
      );
      form.setValue("districtId", "");
      form.setValue("wardId", "");
      setWards([]);
    }
  }, [provinceId]);

  useEffect(() => {
    if (districtId) {
      getWards(Number(districtId)).then(setWards).catch(() =>
        toast.error("Không thể tải danh sách phường/xã")
      );
      form.setValue("wardId", "");
    }
  }, [districtId]);
  useEffect(() => {
    if (auth?.role === 2) {
      form.setValue("doctor_id", String(auth.userId)); 
    }
  }, [auth, form]);
  // ===== Upload Helper =====
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_DB}/image/upload`,
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

  // ===== Gallery Handler =====
  const handleGalleryImagesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => f.size <= 2 * 1024 * 1024);

    if (validFiles.length + galleryImages.length > 10) {
      toast.warning("Tối đa 10 ảnh");
      return;
    }

    const uploads = await Promise.allSettled(validFiles.map(uploadImageToCloudinary));
    const uploadedUrls = uploads
      .filter(result => result.status === "fulfilled")
      .map(result => result.value);

    setGalleryImages(prev => [...prev, ...validFiles].slice(0, 10));
    setGalleryUrls(prev => [...prev, ...uploadedUrls].slice(0, 10));
  };

  const handleRemoveGalleryImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleEditorChange = ({ text }) => {
    form.setValue("description", text);
  };

  // ===== Submit Form =====
  const onSubmit = async (values) => {
    if (!avatarUrl) {
      toast.warning("Vui lòng tải lên hình ảnh đại diện");
      return;
    }
  
    // Tìm thông tin địa chỉ từ các ID
    const selectedProvince = provinces.find(p => p.value.toString() === values.provinceId);
    const selectedDistrict = districts.find(d => d.value.toString() === values.districtId);
    const selectedWard = wards.find(w => w.value.toString() === values.wardId);
  
    // Xây dựng địa chỉ đầy đủ
    const fullAddress = [
      values.streetAddress,
      selectedWard?.label,
      selectedDistrict?.label,
      selectedProvince?.label
    ].filter(Boolean).join(", ");

    try {
      setLoading(true);
      const res = await createClinic({
        ...values,
        avatar: avatarUrl,
        address: fullAddress,
        galleryImages: galleryUrls,
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
      {/* <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
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
            onClick={() => navigate("/clinics")}
          >
            Cơ sở y tế
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate(`/doctor/${doctorId}/clinics`)}
          >
            Cơ sở của tôi
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-500">Tạo mới </li>
        </ol>
      </nav> */}
      
     <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          <li className="flex items-center">
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
          </li>
          <li className="flex items-center">
            <ChevronRight
              size={16}
              className="text-gray-400 mx-1"
              aria-hidden="true"
            />
          </li>
          <li className="flex items-center cursor-pointer"   onClick={() => navigate(`/clinics`)}>
            <span className="text-blue-700 hover:text-blue-800 font-medium">Cơ sở y tế</span>
          </li>
          <li className="flex items-center">
            <ChevronRight
              size={16}
              className="text-gray-400 mx-1"
              aria-hidden="true"
            />
          </li>
          <li className="flex items-center">
            <span className="text-gray-700 font-medium">Tạo mới</span>
          </li>
        </ol>
      </nav>
      <Card className="border-none shadow-lg mt-5">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <div className="flex flex-row items-center gap-4">

            <div>
              <h2 className="text-2xl font-bold text-blue-800">
                Thêm cơ sở y tế mới
              </h2>
              <p className="text-gray-600">
                Tạo cơ sở y tế mới với đầy đủ thông tin và hình ảnh
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-gray-700">
                          Tên cơ sở y tế
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tên cơ sở y tế"
                            {...field}
                            className="focus-visible:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {auth?.role === 2 ? (
                    <FormField
                      control={form.control}
                      name="doctor_id"
                      render={() => (
                        <FormItem>
                          <FormLabel className="font-medium text-gray-700">
                            Bác sĩ
                          </FormLabel>
                          <FormControl>
                            <Input
                              value={auth.email}
                              disabled
                              className="bg-gray-50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="doctor_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-medium text-gray-700">
                            Bác sĩ
                          </FormLabel>
                          <FormControl>
                            <ComboBox
                              options={
                                doctors?.map((doctor) => ({
                                  label: `${doctor.userData.email}`,
                                  value: String(doctor.userData.id),
                                })) || []
                              }
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Chọn bác sĩ"
                              className="focus-visible:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-blue-500" />
                  Địa chỉ
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="provinceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-gray-700">
                          Tỉnh/Thành phố
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="focus-visible:ring-blue-500">
                              <SelectValue placeholder="Chọn tỉnh/thành phố" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {provinces.map((province) => (
                              <SelectItem
                                key={province.value}
                                value={province.value.toString()}
                              >
                                {province.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="districtId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-gray-700">
                          Quận/Huyện
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!form.watch("provinceId")}
                        >
                          <FormControl>
                            <SelectTrigger className="focus-visible:ring-blue-500">
                              <SelectValue placeholder="Chọn quận/huyện" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem
                                key={district.value}
                                value={district.value.toString()}
                              >
                                {district.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="wardId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-gray-700">
                          Phường/Xã
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!form.watch("districtId")}
                        >
                          <FormControl>
                            <SelectTrigger className="focus-visible:ring-blue-500">
                              <SelectValue placeholder="Chọn phường/xã" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {wards.map((ward) => (
                              <SelectItem
                                key={ward.value}
                                value={ward.value.toString()}
                              >
                                {ward.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium text-gray-700">
                          Số nhà, tên đường
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập số nhà, tên đường"
                            {...field}
                            className="focus-visible:ring-blue-500"
                          />
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
                  Hình ảnh
                </h3>

                {/* Ảnh đại diện */}
                <FormItem className="mb-6">
                  <FormLabel className="font-medium text-gray-700">
                    Hình ảnh đại diện
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
                              Click để tải ảnh đại diện
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

                {/* Gallery images - Nhiều ảnh */}
                <FormItem>
                  <FormLabel className="font-medium text-gray-700">
                    Thêm hình ảnh cơ sở y tế
                    <span className="text-sm text-gray-500 font-normal ml-2">
                      (Tối đa 10 hình ảnh)
                    </span>
                  </FormLabel>
                  <div className="space-y-4">
                    {/* Phần hiển thị hình ảnh đã upload */}
                    {galleryImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {galleryImages.map((image, index) => (
                          <div
                            key={index}
                            className="relative group aspect-square rounded-lg overflow-hidden border"
                          >
                            <img
                              src={
                                typeof image === "string"
                                  ? image
                                  : URL.createObjectURL(image)
                              }
                              alt={`Gallery ${index}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleRemoveGalleryImage(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            {galleryUrls[index] && (
                              <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload area */}
                    {galleryImages.length < 10 && (
                      <div className="border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                        <label className="flex flex-col items-center justify-center py-6 w-full cursor-pointer">
                          <div className="bg-blue-50 p-2 rounded-full mb-2">
                            <UploadCloud className="w-5 h-5 text-blue-500" />
                          </div>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Thêm hình ảnh</span>{" "}
                            hoặc kéo thả vào đây
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG (Tối đa 2MB mỗi ảnh)
                          </p>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleGalleryImagesChange}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </FormItem>
              </div>

              {/* Mô tả */}
              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-blue-500" />
                  Mô tả
                </h3>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium text-gray-700">
                        Chi tiết về cơ sở y tế
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
                      <FormDescription className="text-xs text-gray-500 mt-2">
                        Mô tả đầy đủ về cơ sở y tế, trang thiết bị, dịch vụ và
                        các thông tin khác.
                      </FormDescription>
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
                      <Plus className="mr-2 h-4 w-4" /> Thêm cơ sở y tế
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

export default ClinicCreate;