import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Check, Plus, Trash2, Save, FileText } from "lucide-react";
import { createPrescription } from "@/api/appointment.api";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Schema validation
const medicationSchema = z.object({
  name: z.string().min(1, "Tên thuốc là bắt buộc"),
  category: z.string().min(1, "Dạng thuốc là bắt buộc"),
  unit: z.string().min(1, "Đơn vị tính là bắt buộc"),
  quantity: z.string().min(1, "Số lượng là bắt buộc"),
  instructions: z.string().optional(),
  notes: z.string().optional(),
});

const medicationForms = [
  "Viên nén",
  "Viên nang",
  "Viên sủi",
  "Sirô",
  "Thuốc tiêm",
  "Kem bôi",
  "Dung dịch",
  "Thuốc nhỏ mắt",
  "Thuốc nhỏ mũi",
];

// Danh sách đơn vị tính
const medicationUnits = [
  "Viên",
  "Lọ",
  "Tuýp",
  "Chai",
  "Gói",
  "Ống",
  "Hộp",
  "Vỉ",
];
const AddNewPrescription = ({ open, onOpenChange, fetch }) => {
  const { appointmentId } = useParams();
  const [medications, setMedications] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: "",
      category: "",
      unit: "",
      quantity: "",
      instructions: "",
      notes: "",
    },
  });

  const addMedication = (data) => {
    setMedications([...medications, data]);
    form.reset();
  };

  const removeMedication = (index) => {
    const updatedMedications = [...medications];
    updatedMedications.splice(index, 1);
    setMedications(updatedMedications);
  };

  const submitPrescription = async () => {
    if (medications.length === 0) {
      toast.error("Vui lòng thêm ít nhất một loại thuốc vào đơn thuốc!");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createPrescription({
        appointment_id: appointmentId,
        medications: medications,
      });

      if (res.EC === 0) {
        toast.success(res.EM);
        setMedications([]);
        onOpenChange(false);
        fetch();
      } else {
        throw new Error(res.EM);
      }
    } catch (error) {
      toast.error(error.message || "Lỗi khi tạo đơn thuốc");
      console.error("Error creating prescription:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] lg:max-w-[80vw] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Tạo đơn thuốc mới
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
          <div className="w-full lg:w-2/3 overflow-auto ml-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(addMedication)}
                className="space-y-6"
              >
                <div className="grid gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Medicine Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Tên thuốc{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Nhập tên thuốc"
                              className="border-input"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Medicine Form */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Dạng thuốc{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-input">
                                <SelectValue placeholder="Chọn dạng thuốc" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {medicationForms.map((form) => (
                                <SelectItem key={form} value={form}>
                                  {form}
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
                    {/* Dosage */}
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Đơn vị tính{" "}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="border-slate-300">
                                <SelectValue placeholder="Chọn đơn vị" />
                              </SelectTrigger>
                              <SelectContent>
                                {medicationUnits.map((unit) => (
                                  <SelectItem key={unit} value={unit}>
                                    {unit}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Quantity */}
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Số lượng <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ví dụ: 15 viên"
                              className="border-input"
                              type="number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Instructions */}
                  <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hướng dẫn sử dụng</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Nhập hướng dẫn chi tiết về cách sử dụng thuốc"
                            rows={3}
                            className="border-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lưu ý</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Nhập các lưu ý khi sử dụng thuốc"
                            rows={2}
                            className="border-input"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    variant="outline"
                    className="w-full md:w-auto flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm vào đơn thuốc
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div className="w-full lg:w-1/3 flex flex-col border-l pl-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-700">
                Đơn thuốc hiện tại
              </h2>
              <Badge variant="outline" className="px-3 py-1 text-sm">
                {medications.length} thuốc
              </Badge>
            </div>

            {medications.length > 0 ? (
              <ScrollArea className="flex-grow mb-4 pr-4">
                <div className="space-y-3">
                  {medications.map((medication, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {medication.name}
                            </h3>
                            <div className="flex flex-wrap gap-2 my-1">
                              <Badge
                                variant="secondary"
                                className="font-normal"
                              >
                                {medication.category}
                              </Badge>
                              <Badge variant="outline" className="font-normal">
                                {medication.unit}
                              </Badge>
                              <Badge variant="outline" className="font-normal">
                                SL: {medication.quantity}
                              </Badge>
                            </div>

                            <p className="text-sm mt-2">
                              <span className="font-medium">Hướng dẫn:</span>{" "}
                              {medication.instructions || "Không có"}
                            </p>

                            <p className="text-sm mt-1 text-amber-700">
                              <span className="font-medium">Lưu ý:</span>{" "}
                              {medication.notes || "Không có"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeMedication(index)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center text-muted-foreground p-8">
                <div className="bg-slate-50 p-4 rounded-full mb-3">
                  <FileText className="h-10 w-10 text-slate-300" />
                </div>
                <p className="text-base">Chưa có thuốc nào trong đơn</p>
                <p className="text-sm mt-1">
                  Thêm thuốc bằng cách điền thông tin và nhấn nút "Thêm vào đơn
                  thuốc"
                </p>
              </div>
            )}

            <div className="mt-auto pt-4 border-t">
              <Button
                onClick={submitPrescription}
                disabled={medications.length === 0 || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang lưu...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Lưu đơn thuốc
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewPrescription;
