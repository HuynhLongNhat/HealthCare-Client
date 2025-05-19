/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cancelAppointment } from "@/api/appointment.api";
import { toast } from "react-toastify";

const schema = z.object({
  reason: z
    .string()
    .min(10, { message: "Lý do phải có ít nhất 10 ký tự" })
    .nonempty({ message: "Vui lòng nhập lý do hủy lịch" }),
});

const CancellationAppointment = ({ show, handleClose, data, fetch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      const res = await cancelAppointment(data.appointment.id, {
        cancellation_reason: values.reason,
      });
      if (res.EC === 0) {
        toast.success(res.EM);
        handleClose();
        form.reset();
        fetch();
        setIsLoading(false);
      } else {
        toast.error(res.EM);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={show}
      onOpenChange={() => {
        handleClose(false);
        form.reset();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle>Xác nhận hủy lịch hẹn</DialogTitle>
              <DialogDescription>
                Bạn đang yêu cầu hủy lịch khám với bác sĩ{" "}
                {data.doctorData.userData.full_name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Lý do hủy lịch <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Vui lòng nhập lý do hủy lịch (tối thiểu 10 ký tự)"
                      className="min-h-[120px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Lưu ý: Vui lòng hủy ít nhất 24 giờ trước giờ hẹn để chúng
                    tôi có thể sắp xếp lại lịch cho bác sĩ và bệnh nhân khác.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleClose();
                  form.reset();
                }}
              >
                <X className="h-4 w-4" />
                Hủy
              </Button>
              <Button type="submit" variant="destructive">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span className="text-[15px]">Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    <span className="text-[15px]">Xác nhận</span>
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

export default CancellationAppointment;
