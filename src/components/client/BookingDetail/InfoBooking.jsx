/* eslint-disable react/prop-types */
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock1,
  CreditCard,
  Calendar as CalendarIcon,
  ClipboardList,
  CheckCircle,
  X,
  Check,
  Wallet,
  AlertTriangle,
  XCircle,
  User,
  FileText,
  Info,
  Clock,
  AlertCircle,
  CircleSlash,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import moment from "moment";
import { formatDate } from "@/utils/helpers";
import useAuthToken from "@/utils/userAuthToken";
import { useEffect, useState } from "react";
import CancellationAppointment from "./CancellationAppointment";
import ApproveAppointment from "./ApproveAppointment";
import RejectAppointment from "./RejectAppointment";
import { confirmPayment, createPaymentLink } from "@/api/appointment.api";
import {
  createPaymentHistory,
  getPaymentByAppointmentId,
} from "@/api/payment.api";
import PatientNotifications from "@/components/admin/Doctor/Doctor/Schedule/PatientNotifications";
import DialogConfirmPayment from "../Payment/DialogConfirmPayment";
import { toast } from "react-toastify";
const paymentMethodText = {
  cash: "Tiền mặt",
  bank: "Chuyển khoản",
  card: "Thẻ thanh toán",
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return null;
  return moment(dateStr).locale("vi").format("HH:mm:ss, DD/MM/YYYY");
};

const formatCurrency = (value) => {
  if (!value) return "Chưa cập nhật";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

const InfoBooking = ({ booking, fetch }) => {
  const { appointmentId } = useParams();
  const auth = useAuthToken();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isAppointmentCancel, setIsAppointmentCancel] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [isAppointmentApprove, setIsAppointmentApprove] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [isAppointmentReject, setIsAppointmentReject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const a = booking.appointment;

  useEffect(() => {
  
    fetchPaymentByAppointment();
  }, [appointmentId]);

   const fetchPaymentByAppointment = async () => {
     const res = await getPaymentByAppointmentId(appointmentId);
     console.log("fetchPaymentByAppointment" ,res)
    if (res.EC === 0) {
      setPaymentData(res.DT);
    }
  };
  const toggleModal = (appointment) => {
    setShowCancelModal(true);
    setIsAppointmentCancel(appointment);
  };

  const toggleModalApprove = (appointment) => {
    setShowApproveModal(true);
    setIsAppointmentApprove(appointment);
  };

  const toggleModalReject = (appointment) => {
    setShowRejectModal(true);
    setIsAppointmentReject(appointment);
  };
  const isPatient =
    auth && auth.role === 3 && auth.userId === booking.patientData.id;
  const isDoctor =
    auth &&
    (auth.role === 1 || auth.userId === booking.doctorData.doctor.user_id);

  const handlePayment = async (appointment) => {
    try {
      setIsLoading(true);
      const orderCode =
        appointment.appointment.id * 1000 + Math.floor(Math.random() * 1000);

      const orderData = {
        amount: appointment?.doctorData?.doctor?.consultation_fee,
        description: `Thanh toán phí khám bệnh - BS.${appointment?.doctorData?.userData?.full_name}`,
        orderCode: orderCode,
        returnUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
        data: appointment,
      };
      //    Validate required data
      if (!orderData.amount) {
        throw new Error("Phí khám không hợp lệ");
      }
      // Create payment link
      const response = await createPaymentLink(orderData);

      if (!response?.success || !response?.paymentUrl?.checkoutUrl) {
        throw new Error(
          response?.message || "Không thể tạo liên kết thanh toán"
        );
      }

      // Store relevant data in localStorage
      localStorage.setItem(
        "pendingPaymentData",
        JSON.stringify({
          orderCode: orderCode,
          appointmentId:  appointment.appointment.id,
          amount: orderData.amount,
          timestamp: new Date().getTime(),
        })
      );
      setIsLoading(false);
      window.location.href = response.paymentUrl.checkoutUrl;
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Lỗi thanh toán: ${error.message || "Vui lòng thử lại sau"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      const res = await createPaymentHistory({
        patient_id: booking?.patientData?.id,
        amount: booking.doctorData.doctor.consultation_fee,
        transfer_content: `Thanh toán khám bệnh cho bác sĩ ${booking.doctorData.userData.full_name}`,
        payment_date: new Date(),
        appointment_id: booking.appointment?.id,
      });
      if (res.EC === 0) {
        await confirmPayment(booking.appointment?.id)
         window.location.reload()
        fetchPaymentByAppointment()
        toast.success(res.EM);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <TabsContent value="info" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 space-y-6">
          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-5">
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Calendar className="h-5 w-5" />
                Chi tiết lịch hẹn
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1">
                      <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ngày khám</p>
                      <p className="font-medium">
                        {formatDate(booking.scheduleData?.schedule?.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1">
                      <Clock1 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Giờ khám</p>
                      <p className="font-medium">
                        {booking.scheduleData.schedule.time_start} -{" "}
                        {booking.scheduleData.schedule.time_end}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phòng khám</p>
                      <p
                        className="font-medium cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() =>
                          navigate(`/clinics/${booking.clinicData.id}`)
                        }
                      >
                        {booking.clinicData.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.clinicData.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-lg text-green-600 mt-1">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Bệnh nhân</p>
                      <p className="font-medium">
                        {booking.patientData?.full_name || "Không có thông tin"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600 mt-1">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phí khám</p>
                      <p className="font-bold text-blue-600">
                        {formatCurrency(
                          booking.doctorData.doctor.consultation_fee
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mt-1">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ngày đặt lịch</p>
                      <p className="font-medium">
                        {formatDateTime(a.booking_time)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-blue-100 rounded-md text-blue-600 mt-0.5">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Lý do khám</p>
                    <p className="font-medium">
                      {a.medical_examination_reason || "Không có thông tin"}
                    </p>
                  </div>
                </div>
              </div>

              {a.payment_method && (
                <>
                  <Separator />
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-green-100 rounded-md text-green-600 mt-0.5">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Phương thức thanh toán
                      </p>
                      <p className="font-medium">
                        {paymentMethodText[a.payment_method] ||
                          a.payment_method}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {(a.approval_time ||
                a.cancellation_reason ||
                a.rejection_reason) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    {a.approval_time && (
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 bg-green-100 rounded-md text-green-600 mt-0.5">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Thời gian xác nhận
                          </p>
                          <p className="font-medium">
                            {formatDateTime(a.approval_time)}
                          </p>
                        </div>
                      </div>
                    )}

                    {a.cancellation_reason && (
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 bg-red-100 rounded-md text-red-600 mt-0.5">
                          <XCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Lý do hủy</p>
                          <p className="font-medium">
                            {a.cancellation_reason || "Không có thông tin"}
                          </p>
                          {a.cancellation_time && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Thời gian hủy:{" "}
                              {formatDateTime(a.cancellation_time)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {a.rejection_reason && (
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 bg-orange-100 rounded-md text-orange-600 mt-0.5">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Lý do từ chối</p>
                          <p className="font-medium">
                            {a.rejection_reason || "Không có thông tin"}
                          </p>
                          {a.rejection_time && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Thời gian từ chối:{" "}
                              {formatDateTime(a.rejection_time)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary and Actions */}
        <div className="md:col-span-5 space-y-6">
          {/* Appointment Summary */}
          <Card className="border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-5">
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <ClipboardList className="h-5 w-5" />
                Tóm tắt lịch hẹn
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 mb-4">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-2">
                  <Info className="h-5 w-5" />
                  <h3 className="font-medium">Thông tin tổng quan</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Bác sĩ:
                    </span>
                    <span className="font-medium">
                      {booking.doctorData.userData.full_name}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Chuyên khoa:
                    </span>
                    <span className="font-medium">
                      {booking.doctorData.doctor.specialization?.name}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Phòng khám:
                    </span>
                    <span className="font-medium">
                      {booking.clinicData.name}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Ngày:
                    </span>
                    <span className="font-medium">
                      {moment(booking.scheduleData.schedule.date)
                        .locale("vi")
                        .format("DD/MM/YYYY")}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Giờ:
                    </span>
                    <span className="font-medium">
                      {booking.scheduleData.schedule.time_start} -{" "}
                      {booking.scheduleData.schedule.time_end}
                    </span>
                  </li>
                  <li className="flex justify-between font-medium text-blue-700 dark:text-blue-400">
                    <span>Phí khám:</span>
                    <span>
                      {formatCurrency(
                        booking.doctorData.doctor.consultation_fee
                      )}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Patient Information */}
              <div className="space-y-4 mb-4">
                <h3 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  Thông tin bệnh nhân
                </h3>
                <div className="pl-6 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Họ và tên:
                    </span>
                    <span className="font-medium">
                      {booking.patientData?.full_name || "Không có thông tin"}
                    </span>
                  </div>
                  {booking.patientData?.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Số điện thoại:
                      </span>
                      <span className="font-medium">
                        {booking.patientData.phone}
                      </span>
                    </div>
                  )}
                  {booking.patientData?.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Email:
                      </span>
                      <span className="font-medium">
                        {booking.patientData.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Action Buttons */}
              <div className="space-y-3 ">
                {/* Admin/Doctor: Reject / Approve */}
                {isDoctor && a.status_id === 1 && (
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="destructive"
                      className="w-1/2 flex items-center justify-center gap-2"
                      onClick={() => toggleModalReject(booking)}
                    >
                      <X className="h-4 w-4" />
                      Từ chối
                    </Button>
                    <Button
                      variant="info"
                      className="w-1/2 flex items-center justify-center gap-2"
                      onClick={() => toggleModalApprove(booking)}
                    >
                      <Check className="h-4 w-4" />
                      Phê duyệt
                    </Button>
                  </div>
                )}

                {/* Patient: Cancel */}
                {isPatient && a.status_id === 1 && (
                  <Button
                    variant="destructive"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => toggleModal(booking)}
                  >
                    <X className="h-4 w-4" />
                    Hủy lịch
                  </Button>
                )}
      
                {/* Patient: Pay */}
                {isPatient && a.status_id === 2 && (
                  <>
                    {a.payment_method === "bank" && (
                      <div className="mb-2">
                         <>
                            <PatientNotifications type="bank" />
                            <Button
                              variant="info"
                              className="w-full flex items-center justify-center gap-2 mt-2"
                              onClick={() => handlePayment(booking)}
                              disabled={isLoading}
                            >
                              <Wallet className="h-4 w-4" />
                              Thanh toán
                            </Button>
                          </>
                       
                      </div>
                    )}
                    {a.payment_method === "cash" && (
                      <div className="mb-2">                      
                          <>
                            <PatientNotifications type="cash" />
                           <div className="lg:col-span-1">
                              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-6">
                                <div className="bg-red-50 p-4 rounded-lg flex gap-3">
                                  <CircleSlash className="text-red-600 flex-shrink-0" />
                                  <div className="text-md text-red-800">
                                    <p>Chưa thanh toán</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>                       
                      </div>
                    )}
                  </>
                )}
   
                 {isPatient && a.status_id === 5 && (
                  <>
                      <div className="mb-2">
                         <>
                          {paymentData?.paymentData?.status_id === 2 && (
                            <div className="lg:col-span-1">
                              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-6">
                                <div className="bg-green-50 p-4 rounded-lg flex gap-3">
                                  <CheckCircle className="text-green-600 flex-shrink-0" />
                                  <div className="text-md text-green-800">
                                    <p>Đã thanh toán</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          </>                     
                      </div>
                  </>
                )}
                {isDoctor && a.status_id === 2 && (
                  <>
                    {a.payment_method === "bank" ? (
                      <div className="mb-2">                       
                          <>
                            <div className="lg:col-span-1">
                              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-6">
                                <div className="bg-yellow-50 p-4 rounded-lg flex gap-3">
                                  <AlertTriangle className="text-yellow-600 flex-shrink-0" />
                                  <div className="text-md text-yellow-800">
                                    <p>Vui lòng chờ bệnh nhân thanh toán</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>                      
                      </div>
                    ) : (
                                          
                          <>
                            <Button
                              variant="info"
                              className="w-full flex items-center justify-center gap-2 mt-2"
                              onClick={() => setShowConfirmModal(true)}
                              disabled={isLoading}
                            >
                              <Wallet className="h-4 w-4" />
                              Xác nhận thanh toán
                            </Button>
                          </>                    
                        
                    )}
                  
                  </>
                )}

                {isDoctor && a.status_id === 5 && (
                  <>
                      <div className="mb-2">                       
                          <>
                          {paymentData?.paymentData?.status_id === 2 && (
                            <div className="lg:col-span-1">
                              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-6">
                                <div className="bg-green-50 p-4 rounded-lg flex gap-3">
                                  <CheckCircle className="text-green-600 flex-shrink-0" />
                                  <div className="text-md text-green-800">
                                    <p>Bệnh nhân đã thanh toán</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          </>                      
                      </div>
                  
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {isAppointmentCancel && (
        <CancellationAppointment
          show={showCancelModal}
          handleClose={() => setShowCancelModal(false)}
          data={isAppointmentCancel}
          fetch={fetch}
        />
      )}

      {showRejectModal && (
        <RejectAppointment
          show={showRejectModal}
          handleClose={() => setShowRejectModal(false)}
          data={isAppointmentReject}
          fetch={fetch}
        />
      )}

      {isAppointmentApprove && (
        <ApproveAppointment
          show={showApproveModal}
          handleClose={() => setShowApproveModal(false)}
          data={isAppointmentApprove}
          fetch={fetch}
        />
      )}

      {showConfirmModal && (
        <DialogConfirmPayment
          open={showConfirmModal}
          onOpenChange={() => setShowConfirmModal(false)}
          onConfirm={handleConfirmPayment}
          fetch={getPaymentByAppointmentId}
        />
      )}
    </TabsContent>
  );
};

export default InfoBooking;
