/* eslint-disable react/prop-types */
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Clock,
  CreditCard,
  Wallet,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import useAuthToken from "@/utils/userAuthToken";
import { createBooking } from "@/api/appointment.api";
import { toast } from "react-toastify";
import { useState } from "react";

const BookingFormSchema = z.object({
  reason: z.string().min(5, "Lý do khám phải có ít nhất 5 ký tự"),
  paymentMethod: z.enum(["cash", "bank"], {
    required_error: "Vui lòng chọn phương thức thanh toán",
  }),
});

const BookingDialog = ({ schedule, show, handleClose, doctor ,fetch }) => {
  const [isLoading, setLoading] = useState(false);
  const auth = useAuthToken();
  const form = useForm({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      reason: "",
      paymentMethod: "",
    },
  });

  const paymentMethods = [
    {
      value: "cash",
      label: "Tiền mặt",
      icon: <Wallet className="h-4 w-4 mr-2 text-blue-500" />,
    },
    {
      value: "bank",
      label: "Chuyển khoản",
      icon: <CreditCard className="h-4 w-4 mr-2 text-blue-500" />,
    },
  ];

  const handleBooking = async (data) => {
    try {
      setLoading(true);
      const now = new Date();
      const payload = {
        patient_id: auth.userId,
        doctor_id: doctor.doctor.user_id,
        clinic_id: schedule.clinic_id,
        medical_examination_reason: data.reason,
        payment_method: data.paymentMethod,
        booking_time: now.toISOString(),
        schedule_id: schedule.id,
      };
      const res = await createBooking(payload);
      if (res.EC === 0) {
        toast.success(res.EM);
        handleClose(true);
        form.reset();
        setLoading(false);
        fetch()
      } else if (res.EC === -1 || res.EC === -2 || res.EC === -3 || res.EC === -4 || res.EC === -5) {
        toast.error(res.EM);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Đặt lịch khám bệnh</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleBooking)}
            className="space-y-6"
          >
            {/* Schedule Info */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Thông tin lịch khám
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>
                        {format(new Date(schedule.date), "EEEE, dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>
                        {schedule.time_start} - {schedule.time_end}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lý do khám</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả triệu chứng/lý do khám..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phương thức thanh toán</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn phương thức thanh toán" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          <div className="flex items-center">
                            {method.icon}
                            {method.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <div className=" rounded-lg   ">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">Phí khám bệnh</span>
                <span className="font-bold text-lg text-blue-600">
                  {doctor?.doctor?.consultation_fee
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        minimumFractionDigits: 0,
                      }).format(doctor.doctor.consultation_fee)
                    : "Chưa có giá khám"}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-gray-300 hover:bg-gray-50"
              >
                <X className="h-4 w-4 mr-1" />
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
                    <Check className="h-4 w-4 mr-1" />
                    Xác nhận đặt lịch
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

export default BookingDialog;
