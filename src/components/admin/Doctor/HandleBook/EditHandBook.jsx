import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CalendarIcon,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  LinkIcon,
  Loader2,
  Save,
  Tags,
  Trash2,
  X
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'react-toastify';

const formSchema = z.object({
  title: z.string().min(10, {
    message: "Tiêu đề phải có ít nhất 10 ký tự",
  }),
  excerpt: z.string().min(50, {
    message: "Tóm tắt phải có ít nhất 50 ký tự",
  }),
  content: z.string().min(200, {
    message: "Nội dung phải có ít nhất 200 ký tự",
  }),
  category: z.string({
    required_error: "Vui lòng chọn danh mục",
  }),
  author: z.string().min(5, {
    message: "Tên tác giả phải có ít nhất 5 ký tự",
  }),
  date: z.date({
    required_error: "Vui lòng chọn ngày đăng",
  }),
  readingTime: z.string().min(2, {
    message: "Vui lòng nhập thời gian đọc",
  }),
  tags: z.array(z.string()).min(1, {
    message: "Vui lòng thêm ít nhất 1 thẻ tag",
  }),
  image: z.string().url({
    message: "Vui lòng nhập đường dẫn hình ảnh hợp lệ",
  }),
});

// Mock data for demonstration
const mockHealthArticles = [
  {
    id: 1,
    title: "Dinh dưỡng tối ưu cho người bệnh tiểu đường",
    excerpt: "Các nguyên tắc và thực phẩm nên ăn giúp kiểm soát lượng đường trong máu và duy trì sức khỏe tổng thể cho người mắc bệnh tiểu đường.",
    content: "Nội dung chi tiết về dinh dưỡng cho người bệnh tiểu đường... Điều này bao gồm các nguyên tắc cơ bản và danh sách thực phẩm nên ăn, tránh ăn. Bài viết cũng bao gồm các mẫu thực đơn và lời khuyên từ chuyên gia dinh dưỡng.",
    image: "https://placehold.co/600x400/e2f4ff/0084d6?text=Dinh+dưỡng+tiểu+đường",
    category: "dinh-duong",
    author: "BS. Nguyễn Văn A",
    date: new Date("2025-05-10"),
    readingTime: "10 phút đọc",
    tags: ["tiểu đường", "dinh dưỡng", "sức khỏe", "chế độ ăn"]
  }
];

const EditHandBook = () => {
  const { handbookId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "",
      author: "",
      date: new Date(),
      readingTime: "",
      tags: [],
      image: "",
    },
  });

  useEffect(() => {
    // Simulate API call to fetch article data
    setLoading(true);
    setTimeout(() => {
      const article = mockHealthArticles.find(a => a.id === Number(handbookId));
      
      if (article) {
        form.reset({
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category,
          author: article.author,
          date: article.date,
          readingTime: article.readingTime,
          tags: article.tags,
          image: article.image,
        });
        
        setImagePreview(article.image);
      } else {
        // Handle case when article is not found
        toast({
          title: "Không tìm thấy bài viết",
          description: "Bài viết không tồn tại hoặc đã bị xóa.",
          variant: "destructive",
        });
        navigate("/health-handbook");
      }
      
      setLoading(false);
    }, 1000);
  }, [handbookId, navigate]);

  const tags = form.watch("tags");

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      form.setValue("tags", [...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const removeTag = (tag) => {
    form.setValue("tags", tags.filter(t => t !== tag));
  };

  const handlePreviewImage = (url) => {
    if (url) {
      setImagePreview(url);
    }
  };

  const onSubmit = (data) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Updated data:", data);
      setIsSubmitting(false);
      toast({
        title: "Bài viết đã được cập nhật!",
        description: "Các thay đổi đã được lưu thành công.",
        variant: "success",
      });
      navigate(`/health-handbook/${handbookId}`);
    }, 1500);
  };

  const handleDelete = () => {
    // Simulate delete API call
    setTimeout(() => {
      toast({
        title: "Đã xóa bài viết!",
        description: "Bài viết đã được xóa thành công.",
        variant: "default",
      });
      navigate("/health-handbook");
    }, 1000);
  };

  const categories = [
    { value: "dinh-duong", label: "Dinh dưỡng" },
    { value: "tap-luyen", label: "Tập luyện" },
    { value: "phong-benh", label: "Phòng bệnh" },
    { value: "tam-ly", label: "Tâm lý" },
    { value: "nhi-khoa", label: "Nhi khoa" },
    { value: "da-lieu", label: "Da liễu" },
    { value: "cap-cuu", label: "Cấp cứu" },
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-6 mt-20">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-52 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-10 w-full mb-3" />
                <Skeleton className="h-40 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 mt-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/health-handbook/${handbookId}`)}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold">Chỉnh sửa bài viết</h1>
        </div>
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="h-4 w-4 mr-1" />
              Xóa bài viết
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Xóa bài viết
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiêu đề bài viết</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nhập tiêu đề bài viết" 
                            {...field} 
                            className="text-lg font-medium"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tóm tắt</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Nhập tóm tắt ngắn gọn về bài viết" 
                            {...field} 
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Tóm tắt sẽ hiển thị ở trang chủ và kết quả tìm kiếm
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nội dung bài viết</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Nhập nội dung chi tiết bài viết" 
                            {...field} 
                            rows={15}
                            className="font-normal"
                          />
                        </FormControl>
                        <FormDescription>
                          Hỗ trợ định dạng Markdown
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tác giả</FormLabel>
                          <FormControl>
                            <Input placeholder="Tên tác giả" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Danh mục</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem 
                                  key={category.value} 
                                  value={category.value}
                                >
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Ngày đăng</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={`w-full pl-3 text-left font-normal ${
                                    !field.value && "text-muted-foreground"
                                  }`}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>Chọn ngày</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="readingTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thời gian đọc</FormLabel>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Input 
                                placeholder="Ví dụ: 5 phút đọc" 
                                {...field} 
                                className="flex-1"
                              />
                            </FormControl>
                            <Clock className="h-4 w-4 text-gray-400" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={() => (
                      <FormItem>
                        <FormLabel>Thẻ tag</FormLabel>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {tags.map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="secondary"
                              className="flex items-center gap-1 px-3 py-1"
                            >
                              {tag}
                              <X 
                                className="h-3 w-3 cursor-pointer" 
                                onClick={() => removeTag(tag)}
                              />
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Nhập tag"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                          />
                          <Button 
                            type="button" 
                            onClick={addTag}
                            variant="outline"
                            size="sm"
                          >
                            <Tags className="h-4 w-4 mr-1" />
                            Thêm
                          </Button>
                        </div>
                        {form.formState.errors.tags && (
                          <p className="text-sm font-medium text-destructive mt-2">
                            {form.formState.errors.tags.message}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="mt-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Lưu thay đổi
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Hình ảnh bài viết</h3>
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL hình ảnh</FormLabel>
                    <div className="space-y-2">
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input 
                            placeholder="https://example.com/image.jpg" 
                            {...field} 
                            className="flex-1"
                            onChange={(e) => {
                              field.onChange(e);
                              handlePreviewImage(e.target.value);
                            }}
                          />
                          <Button 
                            type="button" 
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreviewImage(field.value)}
                          >
                            <LinkIcon className="h-4 w-4 mr-1" />
                            Xem
                          </Button>
                        </div>
                      </FormControl>
                      {imagePreview && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500 mb-2">Xem trước:</p>
                          <div className="aspect-video rounded-md overflow-hidden bg-gray-100 relative">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                              onError={() => setImagePreview("")}
                            />
                          </div>
                        </div>
                      )}
                      {!imagePreview && (
                        <div className="aspect-video rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                            <p className="text-sm">Xem trước hình ảnh</p>
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center text-amber-600 bg-amber-50 rounded-md p-3 mb-4">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p className="text-sm">Bài viết này đã được công khai. Các thay đổi sẽ ngay lập tức được cập nhật.</p>
              </div>
              
              <h3 className="text-lg font-medium mb-4">Thông tin bài viết</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">ID:</span>
                  <span className="font-medium">{handbookId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày tạo:</span>
                  <span className="font-medium">01/05/2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cập nhật lần cuối:</span>
                  <span className="font-medium">10/05/2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Trạng thái:</span>
                  <span className="text-green-600 font-medium">Đã xuất bản</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lượt xem:</span>
                  <span className="font-medium">1,245</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditHandBook;