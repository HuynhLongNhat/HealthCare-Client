import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const EditAppointmentForm = ({ appointment, onSave, onCancel }) => {
  const [editedAppointment, setEditedAppointment] = useState(appointment);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Ngày</label>
        <Select
          value={editedAppointment.day}
          onValueChange={(value) =>
            setEditedAppointment({ ...editedAppointment, day: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn ngày" />
          </SelectTrigger>
          <SelectContent>
            {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"].map(
              (day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Khung giờ</label>
        <Input
          type="text"
          value={editedAppointment.time}
          onChange={(e) =>
            setEditedAppointment({
              ...editedAppointment,
              time: e.target.value,
            })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Số bệnh nhân tối đa
        </label>
        <Input
          type="number"
          value={editedAppointment.maxPatients}
          onChange={(e) =>
            setEditedAppointment({
              ...editedAppointment,
              maxPatients: parseInt(e.target.value) || 0,
            })
          }
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Trạng thái</label>
        <Select
          value={editedAppointment.status}
          onValueChange={(value) =>
            setEditedAppointment({
              ...editedAppointment,
              status: value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Có thể đặt</SelectItem>
            <SelectItem value="full">Đã đầy</SelectItem>
            <SelectItem value="canceled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button onClick={() => onSave(editedAppointment)}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default EditAppointmentForm;