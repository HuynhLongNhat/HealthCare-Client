/* eslint-disable react/prop-types */
import { Calendar, User, Phone, Mail, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { calculateAge, formatPhoneNumber } from "@/utils/helpers";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const PatientInfo = ({ booking }) => {
  const navigate = useNavigate()
  return (
    <TabsContent value="patient" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Thông tin bệnh nhân
          </CardTitle>
          <CardDescription>
            Chi tiết thông tin người đặt lịch và bệnh nhân
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 cursor-pointer"
            onClick={()=> navigate(`/profile/${booking.patientData.id}`)}
          >
            <Avatar className="h-16 w-16 border-2 border-gray-200 shadow-sm">
              <AvatarImage
                src={booking.patientData.profile_picture}
                alt={booking.patientData.full_name}
              />
              <AvatarFallback>
                {booking.patientData.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600">
                {booking.patientData.full_name || "Chưa cập nhật"}
              </h3>
              <p className="text-sm text-gray-600">
                {booking.patientData.gender || "Chưa cập nhật"} ·{" "}
                {calculateAge(booking.patientData.dob) || "Chưa cập nhật"} tuổi
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Thông tin cá nhân</h3>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Ngày sinh</p>
                <p className="font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                  {moment(booking.patientData.dob).format("DD/MM/YYYY") || "Không có thông tin"}           
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-blue-600" />
                 {formatPhoneNumber(booking.patientData.phone_number || "Không có thông tin")}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  {booking.patientData.email || "Không có thông tin"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Địa chỉ</p>
                <p className="font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  {booking.patientData.address || "Không có thông tin"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Thông tin y tế</h3>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Tiền sử bệnh</p>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-700">
                    {booking.patientData.medical_history ||
                      "Không có thông tin"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Dị ứng</p>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-700">
                    {booking.patientData.allergies || "Không có thông tin"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Thuốc đang sử dụng</p>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-700">
                    {booking.patientData.current_medications ||
                      "Không có thông tin"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Thông tin bảo hiểm</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Bảo hiểm y tế</p>
                <p className="font-medium">
                  {booking.patientData.health_insurance || "Không có thông tin"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Số thẻ bảo hiểm</p>
                <p className="font-medium">
                  {booking.patientData.insurance_number || "Không có thông tin"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default PatientInfo;
