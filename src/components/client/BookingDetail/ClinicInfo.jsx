/* eslint-disable react/prop-types */

import {
  MapPin,
  Phone,
  Mail,
  Building,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {  TabsContent} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";


const ClinicInfo = ({ booking }) => {
  const navigate = useNavigate();
  return (
      <TabsContent value="clinic" className="space-y-6">
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => navigate(`/clinics/${booking.clinicData.id}`)}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="hover:text-blue-600">{booking.clinicData.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {booking.clinicData.type || "Phòng khám đa khoa"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">
                    Thông tin cơ bản
                  </h3>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Địa chỉ</p>
                    <p className="font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      {booking.clinicData.address}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Liên hệ</p>
                    <p className="font-medium flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-blue-600" />
                      {booking.clinicData.phone || "Không có thông tin"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      {booking.clinicData.email || "Không có thông tin"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">
                    Thời gian làm việc
                  </h3>

                  <div className="p-4 bg-gray-50 rounded-md space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600">Thứ Hai - Thứ Sáu</p>
                      <p className="font-medium">08:00 - 17:00</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600">Thứ Bảy</p>
                      <p className="font-medium">08:00 - 12:00</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600">Chủ Nhật</p>
                      <p className="font-medium">Đóng cửa</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Bảo hiểm được chấp nhận
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="px-3 py-1">
                        Bảo hiểm y tế
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        Bảo Việt
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        Bảo Minh
                      </Badge>
                      <Badge variant="outline" className="px-3 py-1">
                        + Khác
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              
            </CardContent>
          </Card>
        </TabsContent>
  )
}

export default ClinicInfo