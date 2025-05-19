/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { FormControl } from "./ui/form";
import { Button } from "./ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
export const DateTimePicker = ({ field }) => {
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  // Lấy thời gian hiện tại
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const handleTimeChange = (type, value) => {
    const currentDate = field.value || new Date();
    const newDate = new Date(currentDate);
    const now = new Date();

    if (type === "hour") {
      newDate.setHours(parseInt(value), newDate.getMinutes(), 0);
    } else {
      newDate.setMinutes(parseInt(value));
    }

    // Kiểm tra nếu thời gian mới không nằm trong quá khứ
    if (newDate >= now) {
      field.onChange(newDate);
    } else {
      // Nếu thời gian ở quá khứ, đặt lại thành thời gian hiện tại
      const updatedDate = new Date(currentDate);
      if (updatedDate < now) {
        updatedDate.setHours(now.getHours(), now.getMinutes(), 0);
      }
      field.onChange(updatedDate);
    }
  };

  // Kiểm tra xem giờ có khả dụng hay không (chỉ cho phép giờ hiện tại hoặc tương lai)
  const isHourDisabled = (hour) => {
    if (!field.value) return false;

    const selectedDate = new Date(field.value);
    const today = new Date();

    // Nếu ngày được chọn là ngày hiện tại, chỉ cho phép giờ hiện tại hoặc tương lai
    if (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    ) {
      return parseInt(hour) < currentHour;
    }

    return false;
  };

  // Kiểm tra xem phút có khả dụng hay không (chỉ cho phép phút hiện tại hoặc tương lai)
  const isMinuteDisabled = (minute) => {
    if (!field.value) return false;

    const selectedDate = new Date(field.value);
    const today = new Date();

    // Nếu ngày và giờ được chọn là hiện tại, chỉ cho phép phút hiện tại hoặc tương lai
    if (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getHours() === today.getHours()
    ) {
      return parseInt(minute) < currentMinute;
    }

    return false;
  };

  // Đảm bảo field.value không ở quá khứ khi component khởi tạo
  useEffect(() => {
    if (field.value) {
      const now = new Date();
      if (field.value < now) {
        const newDate = new Date();
        newDate.setSeconds(0, 0);
        field.onChange(newDate);
      }
    }
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            className={`w-full justify-start text-left font-normal border-gray-200 hover:bg-gray-50 dark:hover:bg-blue-950 ${
              !field.value && "text-gray-500"
            }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
            {field.value
              ? format(field.value, "EEEE, dd MMMM yyyy 'lúc' HH:mm", {
                  locale: vi,
                })
              : "Chọn thời gian"}
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-700 dark:text-white">
                Chọn ngày
              </span>
            </div>
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={(date) => {
                if (!date) return;
                const newDate = new Date(date);
                const oldDate = field.value || new Date();
                newDate.setHours(oldDate.getHours(), oldDate.getMinutes(), 0);

                // Kiểm tra nếu ngày được chọn không ở quá khứ
                const now = new Date();
                if (
                  newDate.getDate() < now.getDate() &&
                  newDate.getMonth() <= now.getMonth() &&
                  newDate.getFullYear() <= now.getFullYear()
                ) {
                  // Nếu ngày ở quá khứ, đặt thành ngày hiện tại
                  newDate.setDate(now.getDate());
                  newDate.setMonth(now.getMonth());
                  newDate.setFullYear(now.getFullYear());

                  // Đảm bảo giờ cũng không ở quá khứ
                  if (newDate < now) {
                    newDate.setHours(now.getHours(), now.getMinutes(), 0);
                  }
                }

                field.onChange(newDate);
              }}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              className="rounded-md border shadow-sm"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-700 dark:text-white">
                Chọn giờ
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <select
                value={field.value ? format(field.value, "HH") : "00"}
                onChange={(e) => handleTimeChange("hour", e.target.value)}
                className="flex-1 rounded-md border  border-gray-200 px-3 py-2 bg-white dark:bg-[#020818] focus:ring-2 focus:ring-blue-500"
              >
                {hours.map((hour) => (
                  <option
                    key={hour}
                    value={hour}
                    disabled={isHourDisabled(hour)}
                  >
                    {hour} giờ
                  </option>
                ))}
              </select>
              <span className="text-xl font-medium text-gray-400">:</span>
              <select
                value={field.value ? format(field.value, "mm") : "00"}
                onChange={(e) => handleTimeChange("minute", e.target.value)}
                className="flex-1 rounded-md border border-gray-200 px-3 py-2 bg-white dark:bg-[#020818] focus:ring-2 focus:ring-blue-500"
              >
                {minutes.map((minute) => (
                  <option
                    key={minute}
                    value={minute}
                    disabled={isMinuteDisabled(minute)}
                  >
                    {minute} phút
                  </option>
                ))}
              </select>
            </div>
          </div>

          {field.value && (
            <div className="pt-4 border-t">
              <div className="text-sm text-gray-500">Đã chọn:</div>
              <div className="font-medium text-blue-600">
                {format(field.value, "EEEE, dd MMMM yyyy 'lúc' HH:mm", {
                  locale: vi,
                })}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};