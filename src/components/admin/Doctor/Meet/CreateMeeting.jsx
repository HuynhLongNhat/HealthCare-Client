import { useState, useEffect } from "react";
import {
  Save,

  Clock,
  Loader2,

} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { DateTimePicker } from "@/components/DateTimePicker";
import { createMeetingByDoctor } from "@/api/doctor.api";
import { useParams } from "react-router-dom";

// Form validation schema
const formSchema = z.object({
  roomName: z.string().min(1, "Tên cuộc họp không được để trống"),
   meetingDate: z.date({
    required_error: "Vui lòng chọn thời gian bắt đầu",
  }).refine(date => date > new Date(), {
    message: "Thời gian bắt đầu phải sau thời gian hiện tại"
  }),
  duration: z.coerce
    .number()
    .min(15, "Thời lượng tối thiểu 15 phút")
    .max(240, "Thời lượng tối đa 240 phút"),
});

const CreateMeeting = ({ open, onOpenChange, fetch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { doctorId } = useParams();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomName: "",
      meetingDate: "",
      duration: 30,
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const meetingData = {
        roomName: values.roomName,
        meetingUrl: `https://meet.jit.si/${values.roomName}-${uuidv4().substring(
        0,
        8
      )}`,
        date: values.meetingDate,
        duration: values.duration,
      };

     const res = await createMeetingByDoctor(doctorId , meetingData)
      if (res.EC === 0) {
      toast.success("Tạo cuộc họp thành công");
      form.reset();
      onOpenChange(false);
      fetch();
    }      
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error("Không thể tạo cuộc họp: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();

    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
    >
      <DialogContent className="max-w-2xl p-6 rounded-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-blue-700">
                Tạo cuộc họp mới
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                Điền thông tin để tạo cuộc họp trực tuyến
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{format(new Date(), "dd/MM/yyyy")}</span>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Room Name */}
              <FormField
                control={form.control}
                name="roomName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-medium">
                      Tên cuộc họp *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên cuộc họp"
                        {...field}
                        disabled={isLoading}
                        className="focus-visible:ring-blue-500 h-10"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="font-medium">
                      Thời lượng (phút) *
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="15"
                        max="120"
                        step="15"
                        {...field}
                        disabled={isLoading}
                        className="focus-visible:ring-blue-500 h-10"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />

              {/* Meeting Date */}
            </div>
              <FormField
                control={form.control}
                name="meetingDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="font-medium">
                     Thời gian bắt đầu
                    </FormLabel>
                    
                      <DateTimePicker field={field} disabled={isLoading} />
                        <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="min-w-[100px] h-9"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[100px] h-9 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Tạo cuộc họp
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
