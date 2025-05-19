/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { Phone, Mail, Building, User } from "lucide-react";
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
import { formatPhoneNumber } from "@/utils/helpers";

const DoctorInfo = ({ booking }) => {
  const navigate = useNavigate();
  return (
    <TabsContent value="doctor" className="space-y-6">
      <Card
        onClick={() => navigate(`/doctor/${booking.doctorData.doctor.user_id}`)}
      >
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Thông tin bác sĩ
          </CardTitle>
          <CardDescription>
            Chi tiết thông tin bác sĩ và người khám bệnh
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-6 space-y-6">
          <div
            className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 cursor-pointer"
          >
              <Avatar className="h-16 w-16 border-2 border-gray-200 shadow-sm">
              <AvatarImage src={booking.doctorData.userData.profile_picture} />
              <AvatarFallback>
                {booking.doctorData.userData.full_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600">
                   <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600">
                  {booking.doctorData.doctor.position}{" "}
                  {booking.doctorData.userData.full_name}
                </h3>
                <p className="text-sm text-gray-600">
                  {booking.doctorData.doctor.specialization?.name}
                </p>
              </h3>
            </div>
          </div>

          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Thông tin cá nhân</h3>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Chuyên khoa</p>
                <p className="font-medium">
                  {booking.doctorData.doctor.specialization?.name}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Kinh nghiệm</p>
                <p className="font-medium">
                  {booking.doctorData.doctor.experience
                    ? `${booking.doctorData.doctor.experience} năm kinh nghiệm`
                    : "Chưa có thông tin"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Ngôn ngữ</p>
                <p className="font-medium">
                  {booking.doctorData.doctor.languages || "Tiếng Việt"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Thông tin liên hệ</h3>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-600" />
                  {booking.doctorData.userData.email || "Không có thông tin"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-blue-600" />
                  {booking?.doctorData?.userData?.phone_number
                    ? formatPhoneNumber(
                        booking.doctorData.userData.phone_number
                      )
                    : "Không có thông tin"}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Phòng khám</p>
                <p className="font-medium flex items-center">
                  <Building className="h-4 w-4 mr-2 text-blue-600" />
                  {booking.clinicData.name}
                </p>
              </div>
            </div>
          </div>

          <Separator />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default DoctorInfo;
