import { AlertCircle, AlertTriangle } from "lucide-react";

const messages = {
  noti: [
    "Vui lòng đến trước giờ hẹn 15-30 phút để làm thủ tục",
    "Mang theo các kết quả xét nghiệm và đơn thuốc cũ (nếu có)",
  ],
  bank: [
    "Để hoàn tất đặt lịch, Quý khách vui lòng thực hiện thanh toán trước ngày hẹn khám.",
    "Vui lòng kiểm tra kỹ thông tin tài khoản của phòng khám và ghi rõ nội dung chuyển khoản theo hướng dẫn để đảm bảo quyền lợi.",
  ],
  cash: [
    "Quý khách vui lòng thanh toán chi phí khám bệnh trực tiếp tại quầy thu ngân của phòng khám sau khi hoàn tất buổi tư vấn/thăm khám.",
    "Chúng tôi xin cảm ơn và rất hân hạnh được phục vụ Quý khách!",
  ],
};

const PatientNotifications = ({ type }) => {
  const messageList = messages[type];

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-6">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
          <div className="bg-orange-100 rounded-full p-1.5">
            <AlertCircle className="h-5 w-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Thông báo</h3>
        </div>

        {messageList && (
          <div className="bg-yellow-50 p-4 rounded-lg flex gap-3">
            <AlertTriangle className="text-yellow-600 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              {messageList.map((msg, idx) => (
                <p key={idx}>{msg}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientNotifications;
