/* eslint-disable react/prop-types */
import { useState } from "react";
import { Check, Loader2, Stethoscope, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDiagnosis } from "@/api/appointment.api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const formSchema = z.object({
  symptoms: z.string().min(1, { message: "Triệu chứng không được để trống" }),

  diagnosis: z.string().min(1, { message: "Chẩn đoán không được để trống" }),

  treatmentPlan: z
    .string()
    .min(1, { message: "Kế hoạch điều trị không được để trống" }),

  notes: z.string().optional(),
});
const AddNewDiagnosis = ({show , handleClose ,fetch}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { appointmentId } = useParams();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
      diagnosis: "",
      treatmentPlan: "",
      notes: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const payload = {
        appointment_id: appointmentId,
        symptoms: data.symptoms,
        diagnosis: data.diagnosis,
        treatment_plan: data.treatmentPlan,
        notes: data.notes || "",
      };

      const res = await createDiagnosis(payload);
      if (res.EC === 0) {
        toast.success(res.EM);
        form.reset();
        fetch(); 
        handleClose(false);
        setIsLoading(false);
      }
        if (res.EC === 1) {
        toast.error(res.EM)
      }
    } catch (error) {
      console.error("Error creating diagnosis:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Stethoscope className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-blue-800">
                Thêm chẩn đoán mới
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Nhập thông tin chẩn đoán cho bệnh nhân
              </p>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[65vh] pr-4">
              <div className="grid gap-6 py-4 px-1">
                {/* Symptoms Section */}
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <Label className="text-gray-700 font-medium">
                        Triệu chứng
                      </Label>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[120px]"
                          placeholder="Nhập triệu chứng, mỗi triệu chứng một dòng..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Diagnosis Section */}
                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <Label className="text-gray-700 font-medium">
                        Chẩn đoán
                      </Label>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[80px]"
                          placeholder="Nhập chẩn đoán chính..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Treatment Plan Section */}
                <FormField
                  control={form.control}
                  name="treatmentPlan"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <Label className="text-gray-700 font-medium">
                        Kế hoạch điều trị
                      </Label>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[100px]"
                          placeholder="Nhập kế hoạch điều trị chi tiết..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Notes Section */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <Label className="text-gray-700">Ghi chú</Label>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[80px]"
                          placeholder="Nhập ghi chú thêm (nếu có)..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Follow-up Section */}
              </div>
            </ScrollArea>

            <DialogFooter className="border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  handleClose(false);
                }}
                className="border-gray-300"
              >
                <X />
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span className="text-[15px]">Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    <span className="text-[15px]">Tạo mới</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewDiagnosis;
