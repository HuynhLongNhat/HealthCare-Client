import { useState, useEffect } from "react";
import { Save, X, Clock, Loader2, User, Calendar as CalendarIcon } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const formSchema = z.object({
  roomName: z.string().min(1, "Tên cuộc họp không được để trống"),
  meetingDate: z.date({
    required_error: "Vui lòng chọn ngày khám",
  }),
  meetingTime: z.string().min(1, "Vui lòng chọn giờ khám"),
  duration: z.string().min(1, "Thời lượng không được để trống"),
  reason: z.string().min(1, "Lý do khám không được để trống"),
});

const CreateMeeting = ({ open, onOpenChange, fetchAllMeetingList, selectedPatient }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomName: selectedPatient ? `Khám cho bệnh nhân ${selectedPatient?.patientName}` : "",
      meetingDate: new Date(),
      meetingTime: "",
      duration: "30",
      reason: "",
    },
  });

  useEffect(() => {
    if (selectedPatient) {
      form.reset({
        roomName: `Khám cho bệnh nhân ${selectedPatient.patientName}`,
        meetingDate: new Date(),
        meetingTime: "",
        duration: "30",
        reason: "",
      });
    }
  }, [selectedPatient, form]);

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Combine date and time
      const meetingDateTime = new Date(values.meetingDate);
      const [hours, minutes] = values.meetingTime.split(':').map(Number);
      meetingDateTime.setHours(hours, minutes);
      
      const patientId = selectedPatient?.patientId || "new-patient";
      const newMeetLink = `https://meet.google.com/${uuidv4().substring(0, 8)}`;

      // Prepare meeting data
      const meetingData = {
        patientId: patientId,
        roomName: values.roomName,
        meetingUrl: newMeetLink,
        date: meetingDateTime.toISOString(),
        duration: parseInt(values.duration),
        reason: values.reason,
        status: "scheduled"
      };

      console.log("Creating meeting:", meetingData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In a real application, you would call your API here
      // const response = await createMeetingByPatientId(patientId, meetingData);
      
      const response = { success: true, message: "Đặt lịch khám mới thành công" };

      if (response.success) {
        form.reset();
        toast.success(response.message || "Đặt lịch khám mới thành công");
        onOpenChange(false);
        fetchAllMeetingList();
      }
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error("Không thể tạo cuộc họp mới: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Đặt lịch khám mới
                  </h1>
                  {selectedPatient && (
                    <p className="text-gray-600 mt-2 flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Bệnh nhân: {selectedPatient.patientName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white">
                <Clock className="h-4 w-4" />
                <span>{new Date().toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Tên cuộc họp */}
            <FormField
              control={form.control}
              name="roomName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Tên cuộc họp
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên cuộc họp"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ngày và giờ khám */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="meetingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-base font-medium">
                      Ngày khám
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
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
                            date < new Date(new Date().setHours(0, 0, 0, 0))
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
                name="meetingTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Giờ khám
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thời lượng */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Thời lượng (phút)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Thời lượng cuộc gọi (phút)"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Lý do khám */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Lý do khám
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập lý do khám"
                      {...field}
                      disabled={isLoading}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Lưu</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMeeting;