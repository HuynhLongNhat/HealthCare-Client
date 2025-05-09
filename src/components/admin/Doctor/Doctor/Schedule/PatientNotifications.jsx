import { AlertTriangle } from "lucide-react";

const PatientNotifications = () => (
  <div className="bg-yellow-50 p-4 rounded-lg flex gap-3">
    <AlertTriangle className="text-yellow-600 flex-shrink-0" />
    <div className="text-sm text-yellow-800">
      <p>Vui lòng đến trước giờ hẹn 15-30 phút để làm thủ tục</p>
      <p>Mang theo các kết quả xét nghiệm và đơn thuốc cũ (nếu có)</p>
    </div>
  </div>
);

export default PatientNotifications;