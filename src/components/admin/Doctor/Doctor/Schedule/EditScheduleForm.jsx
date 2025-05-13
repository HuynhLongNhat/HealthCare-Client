/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Check, Clock, X } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { updateScheduleById } from "@/api/doctor.api";
import { useParams } from "react-router-dom";

const formSchema = z.object({
  date: z.date({
    required_error: "Vui lòng chọn ngày",
  }),
  time_start: z.string().min(1, "Vui lòng chọn giờ bắt đầu"),
  time_end: z.string().min(1, "Vui lòng chọn giờ kết thúc"),
  status: z.enum(["AVAILABLE", "BOOKED", "CANCELED"], {
    required_error: "Vui lòng chọn trạng thái",
  }),
});

const EditAppointmentForm = ({ show, handleClose, data, fetch }) => {
  const  {doctorId} = useParams()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      time_start: "08:00",
      time_end: "08:30",
      status: "AVAILABLE",
    },
  });

  useEffect(() => {
    console.log("data" ,data)
    if (show && data) {
      form.reset({
        date: new Date(data.date),
        time_start: dayjs(data.time_start, "HH:mm:ss").format("HH:mm"),
        time_end: dayjs(data.time_end, "HH:mm:ss").format("HH:mm"),
        status: data.status || "AVAILABLE",
      });
    }
  }, [show, data, form]);

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 7; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        options.push(time);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const onSubmit = async (values) => {
    try {
      // Prepare data for API
      const payload = {
        date: format(values.date, "yyyy-MM-dd"),
        time_start: values.time_start + ":00",
        time_end: values.time_end + ":00",
        status: values.status.toUpperCase(),
      };
      console.log("payload" ,payload)
      const res = await updateScheduleById(doctorId, data.id, payload);
      console.log("res" , res)
      if (res.EC === 0) {
        toast.success(res.EM)
        fetch();
        handleClose();
      }    
       if (res.EC === -1 || res.EC === -2 || res.EC === -3||res.EC === -4 ) {
        toast.error(res.EM)
      }  
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Có lỗi xảy ra khi cập nhật lịch hẹn");
    }
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chỉnh sửa lịch khám bệnh
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Date Picker */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ngày khám</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 pr-3 text-left font-normal flex justify-between items-center",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <span>
                            {field.value ? (
                              `${format(field.value, "EEEE", {
                                locale: vi,
                              })}, ngày ${format(field.value, "d", {
                                locale: vi,
                              })} tháng ${format(field.value, "M", {
                                locale: vi,
                              })} năm ${format(field.value, "yyyy", {
                                locale: vi,
                              })}`
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                          </span>
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="time_start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ bắt đầu</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Chọn giờ bắt đầu" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
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
                name="time_end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giờ kết thúc</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!form.watch("time_start")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Chọn giờ kết thúc" />
                          </div>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeOptions
                          .filter((time) =>
                            form.watch("time_start")
                              ? time > form.watch("time_start")
                              : true
                          )
                          .map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="AVAILABLE">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                          Có thể đặt
                        </div>
                      </SelectItem>
                      <SelectItem value="BOOKED">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                          Đang bận
                        </div>
                      </SelectItem>
                      <SelectItem value="CANCELED">
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                          Đã hủy
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Hủy
              </Button>
              <Button
                type="submit"
                className="gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Check className="h-4 w-4" />
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAppointmentForm;
