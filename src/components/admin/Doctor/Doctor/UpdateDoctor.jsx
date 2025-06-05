import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Star, Save, Home, X, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllSpecializations,
  getDoctorById,
  updateDoctorProfile,
} from "@/api/doctor.api";
import { Link, useNavigate, useParams } from "react-router-dom";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";

const mdParser = new MarkdownIt();

import "react-markdown-editor-lite/lib/index.css";
import { ComboBox } from "@/components/Combobox";
const formSchema = z.object({
  name: z.string().min(2, "Tên bác sĩ phải có ít nhất 2 ký tự"),
  specialty: z.string().min(1, "Vui lòng chọn chuyên khoa"),
  experience: z.coerce.number().min(0, "Số năm kinh nghiệm không hợp lệ"),
  fee: z.coerce.number().min(0, "Phí khám không hợp lệ"),
  position: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  bio: z
    .string()
    .min(10, "Tiểu sử phải trên 10 ký tự")
    .optional()
    .or(z.literal("")),

});

const UpdateDoctor = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      specialty: null,
      experience: 0,
      fee: 0,
      position: "",
      bio: null,
    },
  });

  const positions = ["Bác sĩ", "Thạc sĩ", "Tiến sĩ", "Phó giáo sư", "Giáo sư"];
  useEffect(() => {
    fetchDoctorById();
    fetchAllSpecialties();
  }, []);

  const onSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const res = await updateDoctorProfile(doctorId, values);
      if (res && res.EC === 0) {
        toast.success(res.EM);
        navigate(-1);
      }
      if (res && res.EC === -1) {
        toast.error(res.EM);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchDoctorById = async () => {
    try {
      const res = await getDoctorById(doctorId);
      if (res && res.DT) {
        const doctorData = res.DT.doctor;

        form.reset({
          name: res.DT.userData.full_name || "",
          specialty: doctorData?.specialization_id
            ? String(doctorData.specialization_id)
            : "",
          experience: doctorData?.experience || 0,
          fee: doctorData?.consultation_fee || 0,
          position: doctorData?.position || "",
          bio: doctorData?.bio || "",
        });
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin bác sĩ:", error);
    }
  };

  const fetchAllSpecialties = async () => {
    const res = await getAllSpecializations();
    if (res && res.DT) {
      setSpecialties(res.DT);
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
            onClick={() => navigate("/doctors")}
          >
           Đội ngũ bác sĩ
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
           <li
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate(`/doctor/${doctorId}`)}
          >
            {form.watch("name")}
          </li>
          <li>
            <span className="mx-2">/</span>
          </li> 
           <li
         
          >
           Cập nhật
          </li>
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
          <li className="flex items-center cursor-pointer" onClick={() => navigate("/doctors")}>
            <span className="text-blue-700 hover:text-blue-800 font-medium">Đội ngũ bác sĩ</span>
          </li>
          <li className="flex items-center">
            <ChevronRight
              size={16}
              className="text-gray-400 mx-1"
              aria-hidden="true"
            />
          </li>
          <li className="flex items-center cursor-pointer" onClick={() => navigate(`/doctor/${doctorId}`)}>
            <span className="text-blue-700 font-medium">
              {form.watch("position") || " "} {" "}
              {form.watch("name")}</span>
          </li>
            <li className="flex items-center">
            <ChevronRight
              size={16}
              className="text-gray-400 mx-1"
              aria-hidden="true"
            />
          </li>
          <li className="flex items-center cursor-pointer" onClick={() => navigate(`/doctor/${doctorId}`)}>
            <span className="text-gray-700 font-medium">Cập nhật</span>
          </li>
        </ol>
      </nav>
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-50 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-blue-800 flex items-center gap-2">
            <User className="h-6 w-6" /> Cập nhật thông tin bác sĩ
          </CardTitle>
          <CardDescription>
            Cập nhật thông tin cá nhân và chuyên môn của bác sĩ
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CardContent className="pt-6 space-y-6">
              {/* Tên bác sĩ */}
              <div className="flex gap-8">
                {/* Tên bác sĩ */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="font-medium">Tên bác sĩ</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Tên bác sĩ"
                            className="pl-10"
                            {...field}
                            disabled={true}
                          />
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Chuyên khoa */}
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="font-medium">Chuyên khoa</FormLabel>
                      <FormControl>
                        <ComboBox
                          options={
                            specialties?.map((specialty) => ({
                              label: specialty.name,
                              value: String(specialty.id),
                            })) || []
                          }
                          value={field.value ? String(field.value) : undefined}
                          onChange={field.onChange}
                          placeholder="Chọn chuyên khoa"
                          className="text-muted-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Kinh nghiệm và Phí khám */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        Năm kinh nghiệm
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type="number" min="0" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">
                        Phí khám (VNĐ)
                      </FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="10000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Địa chỉ */}

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      Chức danh bác sĩ
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn chức danh bác sĩ" />
                        </SelectTrigger>
                        <FormControl>
                          <SelectContent>
                            {positions.map((position) => (
                              <SelectItem key={position} value={position}>
                                {position}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </FormControl>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
              {/* Tiểu sử */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      Tiểu sử chuyên môn
                    </FormLabel>
                    <FormControl>
                      <MdEditor
                        value={field.value}
                        style={{ height: "400px" }}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={({ text }) => field.onChange(text)}
                        placeholder="Nhập thông tin về quá trình đào tạo, kinh nghiệm làm việc và thành tựu của bác sĩ..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Đánh giá */}
            </CardContent>

            <CardFooter className="flex justify-end gap-3 pt-2 bg-gray-50 rounded-b-lg">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4"/>
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 gap-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full mr-2"></span>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Lưu thông tin
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateDoctor;
