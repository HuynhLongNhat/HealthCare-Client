/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAuthToken from "@/utils/userAuthToken";
import {
  Calendar,
  Clock,
  CreditCard,
  User,
  FileText,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  MapPin,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDate, formatMoney, formatTime } from "@/utils/helpers";

const AppointmentCard = ({  appointment, getStatusBadge }) => {
  const navigate = useNavigate();
  const auth = useAuthToken();
  const a = appointment?.appointment;





  const paymentMethodText = {
    cash: "Tiền mặt",
    bank: "Chuyển khoản",
    card: "Thẻ thanh toán",
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all hover:shadow-lg cursor-pointer border-0",
        "bg-gradient-to-br from-white to-gray-50",
        "dark:from-gray-900 dark:to-gray-800"
      )}
      onClick={() => navigate(`/${auth.userId}/appointment/${a?.id}`)}
    >
      {/* Header với thông tin bác sĩ và trạng thái */}
      <CardHeader className="p-6 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
              <Stethoscope className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold leading-tight">
              {appointment.doctorData?.doctor?.position} {" "} {appointment.doctorData?.userData?.full_name}
              </CardTitle>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {appointment.doctorData?.doctor?.specialization?.name}
              </div>
            </div>
          </div>
          <div className="ml-4">{getStatusBadge(a?.status_id)}</div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0 space-y-4">
        {/* Thông tin lịch hẹn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cột 1: Thông tin thời gian */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mt-0.5">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày khám</p>
                <p className="font-medium">
                  {formatDate(appointment.scheduleData?.schedule?.date)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mt-0.5">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Giờ khám</p>
                <p className="font-medium">
                  {appointment.scheduleData?.schedule?.time_start} -{" "}
                  {appointment.scheduleData?.schedule?.time_end}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mt-0.5">
                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Địa điểm</p>
                <p className="font-medium">
                  {appointment.clinicData?.name || "Phòng khám"}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {appointment.clinicData?.address}
                </p>
              </div>
            </div>
          </div>

          {/* Cột 2: Thông tin khác */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg mt-0.5">
                <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Bệnh nhân</p>
                <p className="font-medium">
                  {appointment.patientData?.full_name || "Không có thông tin"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mt-0.5">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Lý do khám</p>
                <p className="font-medium">
                  {a?.medical_examination_reason || "Không có thông tin"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg mt-0.5">
                <CreditCard className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Phí khám</p>
                <p className="font-medium text-blue-600 dark:text-blue-400">
                  {formatMoney(
                    appointment.doctorData?.doctor?.consultation_fee
                  ) || "Chưa cập nhật"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Thông tin bổ sung */}
        {(a?.payment_method ||
          a?.cancellation_reason ||
          a?.rejection_reason ||
          a?.approval_time) && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {a?.payment_method && (
              <div className="flex items-center gap-2 text-sm">
                <BadgeCheck className="h-4 w-4 text-blue-500" />
                <span>
                  Phương thức thanh toán:{" "}
                  <span className="font-medium">
                    {paymentMethodText[a.payment_method] || a.payment_method}
                  </span>
                </span>
              </div>
            )}

            {a?.cancellation_reason && (
              <div className="flex items-start gap-2 text-sm">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <div>
                  <span className="font-medium">Lý do hủy: </span>
                  {a.cancellation_reason}
                  {a.cancellation_time && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Thời gian hủy: {formatDate(a.cancellation_time)} lúc{" "}
                      {formatTime(a.cancellation_time)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {a?.rejection_reason && (
              <div className="flex items-start gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                <div>
                  <span className="font-medium">Lý do từ chối: </span>
                  {a.rejection_reason}
                  {a.rejection_time && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Thời gian từ chối: {formatDate(a.rejection_time)} lúc{" "}
                      {formatTime(a.rejection_time)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {a?.approval_time && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>
                  Đã xác nhận lúc{" "}
                  <span className="font-medium">
                    {formatTime(a.approval_time)}, {formatDate(a.approval_time)}
                  </span>
                </span>
              </div>
            )}
          </div>
        )}

       
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;