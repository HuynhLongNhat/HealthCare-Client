import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, ClockIcon, TrashIcon } from "lucide-react";
import { vi } from "date-fns/locale";
import { toast } from "react-toastify";
import { addSchedule } from "@/api/doctor.api";
import { useParams } from "react-router-dom";

const AddAppointmentDialog = ({ open, onOpenChange, clinicId, fetch }) => {
  const { doctorId } = useParams();
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState("07:00");
  const [endTime, setEndTime] = useState("07:30");
  const [appointments, setAppointments] = useState([]);

  const isTimeSlotOverlap = (newStart, newEnd) => {
    return appointments.some((appt) => {
      const existingStart = appt.startTime;
      const existingEnd = appt.endTime;

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };

  const handleAddTimeSlot = () => {
    if (!date) return;

    // Kiểm tra khung giờ hợp lệ
    if (startTime >= endTime) {
      toast.error("Giờ kết thúc phải sau giờ bắt đầu");
      return;
    }

    // Kiểm tra trùng khung giờ
    if (isTimeSlotOverlap(startTime, endTime)) {
      toast.error("Khung giờ này đã tồn tại hoặc trùng với khung giờ khác");
      return;
    }
    const newAppointment = {
      date: format(date, "yyyy-MM-dd"),
      startTime,
      endTime,
    };

    setAppointments([...appointments, newAppointment]);
    resetTimeSlotFields();
  };

  const handleAddAllAppointments = async () => {
    if (appointments.length === 0) return;
    const res = await addSchedule(doctorId, clinicId, appointments);
    if (res.EC === 0) {
      toast.success(res.EM);
      onOpenChange(false);
      fetch();
    }
    if (res.EC === -1) {
      toast.error(res.EM);
    }
    if (res.EC === -2) {
      toast.error(res.EM);
    }
    if (res.EC === -3) {
      toast.error(res.EM);
    }
    resetForm();
  };

  const removeAppointment = (index) => {
    const updated = [...appointments];
    updated.splice(index, 1);
    setAppointments(updated);
  };

  const resetTimeSlotFields = () => {
    setStartTime("07:00");
    setEndTime("07:30");
  };

  const resetForm = () => {
    setDate(new Date());
    setAppointments([]);
    resetTimeSlotFields();
  };

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

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[640px] p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            Thêm lịch khám bệnh mới
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Chọn ngày */}
          <div className="space-y-2">
            <Label className="block font-medium">Ngày khám</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full flex items-center justify-between text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? format(date, "PPPP", { locale: vi }) : "Chọn ngày"}
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(d) => d < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Khung giờ */}
          <div className="border p-4 rounded-lg space-y-4">
            <h4 className="font-semibold text-lg  ">Thêm khung giờ</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="block mb-1">Giờ bắt đầu</Label>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger className="w-full">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Chọn giờ bắt đầu" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block mb-1">Giờ kết thúc</Label>
                <Select
                  value={endTime}
                  onValueChange={setEndTime}
                  disabled={!startTime}
                >
                  <SelectTrigger className="w-full">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Chọn giờ kết thúc" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions
                      .filter((time) => time > startTime)
                      .map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="info"
                onClick={handleAddTimeSlot}
                disabled={!date || !startTime || !endTime}
              >
                <ClockIcon className="mr-2 h-4 w-4" />
                Thêm khung giờ
              </Button>
            </div>
          </div>

          {/* Danh sách các lịch đã thêm */}
          {appointments.length > 0 && (
            <div className="border rounded-lg divide-y overflow-y-auto max-h-48">
              {appointments.map((appt, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-4 py-2 hover:bg-muted transition"
                >
                  <div>
                    <span className="font-medium">
                      {appt.startTime} - {appt.endTime}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAppointment(index)}
                  >
                    <TrashIcon className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-6 border-t mt-6">
          <div className="text-sm text-muted-foreground">
            {appointments.length} lịch đã thêm
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleAddAllAppointments}
              disabled={appointments.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ClockIcon className="mr-2 h-4 w-4" />
              Thêm tất cả ({appointments.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppointmentDialog;
