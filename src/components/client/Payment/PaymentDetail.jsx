import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Stethoscope,
  Home,
  FileText,
  ArrowUpRight,
  Loader2,
  Receipt,
  CalendarClock,
  CreditCard,
  FileTerminal,
  Calendar,
  Clock4,
  MapPin,
  CalendarDays,
  Clock1,
  BadgeCheck,
  CircleSlash,
  CheckCircle,
  X,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useAuthToken from "@/utils/userAuthToken";
import { getPaymentDetail } from "@/api/payment.api";
import moment from "moment";
import { calculateAge, formatMoney } from "@/utils/helpers";

const PaymentDetail = () => {
  const { userId, paymentId } = useParams();
  const navigate = useNavigate();
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = useAuthToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getPaymentDetail(paymentId);
        if (res.EC === 0) {
          setPaymentDetail(res.DT);
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paymentId]);

  const statusAppointmentConfig = {
    1: {
      text: "Chờ xác nhận",
      variant: "warning",
      icon: <Clock1 className="h-4 w-4 mr-1 text-yellow-500" />,
    },
    2: {
      text: "Đã xác nhận",
      variant: "success",
      icon: <BadgeCheck className="h-4 w-4 mr-1 text-green-600" />,
    },
    3: {
      text: "Đã hủy",
      variant: "destructive",
      icon: <X className="h-4 w-4 mr-1 text-red-500" />,
    },
    4: {
      text: "Đã từ chối",
      variant: "destructive",
      icon: <CircleSlash className="h-4 w-4 mr-1 text-gray-500" />,
    },
    5: {
      text: "Đã thanh toán",
      variant: "success",
      icon: <CheckCircle className="h-4 w-4 mr-1 text-blue-600" />,
    },
  };

  const getStatusPaymentConfig = (status) => {
    switch (status) {
      case "SUCCESS":
        return {
          text: "Thành công",
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          color: "bg-emerald-50 border-emerald-200",
        };
      case "CANCELLED":
        return {
          text: "Hủy bỏ",
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          color: "bg-red-500 text-red-700 border-rose-200",
        };
      case "PENDING":
        return {
          text: "Đang xử lý",
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          color: "bg-amber-50 text-amber-700 border-amber-200",
        };
      default:
        return {
          text: "Không xác định",
          icon: null,
          color: "bg-gray-50 text-gray-700 border-gray-200",
        };
    }
  };
  const getPaymentMethodText = (method) => {
    switch (method) {
      case "bank":
        return "Chuyển khoản ngân hàng";
      case "cash":
        return "Thanh toán tiền mặt";
      default:
        return "Không xác định";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-gray-500 text-sm font-medium">
            Đang tải thông tin...
          </p>
        </div>
      </div>
    );
  }

  if (!paymentDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 mb-6">
            <XCircle className="h-10 w-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Không tìm thấy thông tin thanh toán
          </h1>
          <p className="text-gray-500 mb-6">
            Hóa đơn bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="rounded-full w-full justify-center"
            size="lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const appointmentStatus =
    statusAppointmentConfig[
      paymentDetail?.appointmentData?.appointment?.status_id
    ];
  const statusPaymentConfig = getStatusPaymentConfig(
    paymentDetail.paymentData?.status?.status_name
  );


  return (
    <div className="container mx-auto p-6 mt-20 bg-white shadow-md rounded-lg mb-3">
      {/* Breadcrumb */}
      {auth?.role !== 1 && (
        <nav
          className="flex items-center space-x-1 text-sm text-gray-600 mb-1"
          aria-label="Breadcrumb"
        >
          <Link
            to="/"
            className="flex items-center text-blue-600 hover:text-blue-800 transition"
          >
            <Home size={16} className="mr-1.5" />
            <span>Trang chủ</span>
          </Link>
          <span className="text-gray-400">/</span>
          <span
            className="text-blue-600 hover:text-blue-800 cursor-pointer transition"
            onClick={() => navigate(`/${userId}/lich-su-thanh-toan`)}
          >
            Lịch sử thanh toán
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Chi tiết thanh toán</span>
        </nav>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5">
        {/* Left side - Payment & Appointment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Details Card */}
          <Card className="border-none shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-6">
              <CardTitle className="flex items-center gap-3 text-blue-900">
                <Receipt className="h-5 w-5" />
                Thông tin thanh toán
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Receipt className="h-4 w-4 text-gray-400" />
                      <span>Mã hóa đơn</span>
                    </div>
                    <p className="text-lg font-semibold">
                      #HD-{paymentDetail.paymentData?.id}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <CalendarClock className="h-4 w-4 text-gray-400" />
                      <span>Ngày thanh toán</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {paymentDetail.paymentData?.payment_date
                        ? moment(
                            paymentDetail.paymentData?.payment_date
                          ).format("DD/MM/YYYY")
                        : "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                {/* Right column */}
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span>Phương thức thanh toán</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {getPaymentMethodText(
                        paymentDetail?.appointmentData?.appointment
                          ?.payment_method
                      )}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <FileTerminal className="h-4 w-4 text-gray-400" />
                      <span>Nội dung thanh toán</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {paymentDetail?.paymentData?.transfer_content ||
                        "Thanh toán dịch vụ y tế"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Total amount */}
              <div className="bg-blue-50 rounded-xl p-5 flex justify-between items-center">
                <p className="text-blue-900 font-medium">Tổng thanh toán</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatMoney(paymentDetail?.paymentData?.amount)}
                </p>
              </div>
            </CardContent>
          </Card>
          {/* Appointment Card */}
          <Card className="border-none shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 pb-6">
              <CardTitle className="flex items-center gap-3 text-purple-900">
                <CalendarDays className="h-5 w-5" />
                Thông tin lịch khám
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              {/* Appointment status */}
              <div className="flex items-center justify-between">
                <h3 className="text-gray-700 font-medium">
                  Trạng thái lịch khám:
                </h3>
                <Badge
                  className={`px-3 py-1.5 text-sm flex items-center gap-1.5
          ${
            appointmentStatus.variant === "success"
              ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
              : appointmentStatus.variant === "warning"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
              : "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
          }`}
                >
                  <span className="flex items-center gap-1.5">
                    {appointmentStatus.icon}
                    {appointmentStatus.text}
                  </span>
                </Badge>
              </div>

              {/* Appointment date and time */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-sm">Ngày khám:</p>
                    <p className="text-gray-900 font-medium">
                      {paymentDetail?.appointmentData?.scheduleData?.schedule?.date
                        ? moment(paymentDetail?.appointmentData?.scheduleData?.schedule?.date).format(
                            "DD/MM/YYYY"
                          )
                        : "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock4 className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-sm">Thời gian:</p>
                    <p className="text-gray-900 font-medium">
                      {paymentDetail?.appointmentData?.scheduleData?.schedule?.time_start} {"-"} {paymentDetail?.appointmentData?.scheduleData?.schedule?.time_end}
                        
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-gray-500 text-sm">Phòng khám:</p>
                    <p className="text-gray-900 font-medium">
                      {paymentDetail?.appointmentData?.clinicData?.name || "Chưa cập nhật"} -{" "}
                      {paymentDetail?.appointmentData?.clinicData?.address || "Chưa cập nhật địa chỉ"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment reason */}
              <div className="space-y-2">
                <h3 className="text-gray-700 font-medium">Lý do khám:</h3>
                <p className="text-gray-800 p-3 bg-gray-50 rounded-lg">
                  {paymentDetail?.appointmentData?.appointment?.medical_examination_reason || "Không có thông tin"}
                </p>
              </div>

             

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-4">
                <Button
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-600"
                  onClick={() =>
                    navigate(`/${auth.userId}/appointment/${paymentDetail?.appointmentData.appointment.id}`)
                  }
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Xem chi tiết lịch khám
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Patient Card */}
          <Card className="border-none shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-green-900">
                <User className="h-5 w-5" />
                Bệnh nhân
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4">
              <div
                className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() =>
                  navigate(
                    `/profile/${paymentDetail?.appointmentData?.patientData.id}`
                  )
                }
              >
                <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                  <AvatarImage
                    src={
                      paymentDetail?.appointmentData?.patientData
                        .profile_picture
                    }
                    alt={paymentDetail?.appointmentData?.patientData?.full_name}
                  />
                  <AvatarFallback className="bg-green-100 text-green-600 text-lg font-medium">
                    {paymentDetail?.appointmentData?.patientData?.full_name?.charAt(
                      0
                    ) || "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="ml-4 flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-0.5">
                    {paymentDetail?.appointmentData?.patientData?.full_name ||
                      "Chưa cập nhật"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {paymentDetail?.appointmentData?.patientData?.gender ||
                      "Chưa cập nhật"}{" "}
                    •{" "}
                    {calculateAge(
                      paymentDetail?.appointmentData?.patientData?.dob
                    ) || "?"}{" "}
                    tuổi
                  </p>
                  <div className="flex items-center text-xs text-green-600 font-medium">
                    <span>Xem hồ sơ</span>
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Card */}
          <Card className="border-none shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-indigo-900">
                <Stethoscope className="h-5 w-5" />
                Bác sĩ
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4">
              <div
                className="flex items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() =>
                  navigate(
                    `/doctor/${paymentDetail?.appointmentData?.doctorData.doctor.user_id}`
                  )
                }
              >
                <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                  <AvatarImage
                    src={
                      paymentDetail?.appointmentData?.doctorData.userData
                        .profile_picture
                    }
                    alt={
                      paymentDetail?.appointmentData?.doctorData.userData
                        .full_name
                    }
                  />
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 text-lg font-medium">
                    {paymentDetail?.appointmentData?.doctorData.userData.full_name?.charAt(
                      0
                    ) || "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="ml-4 flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-0.5">
                    {paymentDetail?.appointmentData?.doctorData.doctor.position}{" "}
                    {
                      paymentDetail?.appointmentData?.doctorData.userData
                        .full_name
                    }
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {paymentDetail?.appointmentData?.doctorData.doctor
                      .specialization?.name || "Chưa cập nhật"}
                  </p>
                  <div className="flex items-center text-xs text-indigo-600 font-medium">
                    <span>Xem thông tin</span>
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Status */}
          <Card className="border-none shadow-md rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <FileText className="h-5 w-5" />
                Trạng thái thanh toán
              </CardTitle>
            </CardHeader>

            <CardContent className="p-5">
              <div className="flex items-center">
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${
                    paymentDetail.paymentData?.status?.status_name === "SUCCESS"
                      ? "bg-emerald-100"
                      : paymentDetail.paymentData?.status?.status_name ===
                        "CANCELLED"
                      ? "bg-rose-100"
                      : "bg-amber-100"
                  }`}
                >
                  {statusPaymentConfig.icon}
                </div>
                <div>
                  <p
                    className={`font-medium text-lg ${
                      paymentDetail.paymentData?.status?.status_name ===
                      "SUCCESS"
                        ? "text-emerald-600"
                        : paymentDetail.paymentData?.status?.status_name ===
                          "CANCELLED"
                        ? "text-rose-600"
                        : "text-amber-600"
                    }`}
                  >
                    {statusPaymentConfig.text}
                  </p>

                  <p className="text-sm text-gray-500">
                    {moment(paymentDetail.paymentData?.payment_date).format(
                      "HH:mm, DD/MM/YYYY"
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;
