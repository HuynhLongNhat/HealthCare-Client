/* eslint-disable react/prop-types */

import {
  Stethoscope,
  Clock1,
  User,
  Building,
  Info,
  BadgeCheck,
  CheckCircle,
  X,
  CircleSlash,
  FileText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InfoBooking from "./InfoBooking";
import PatientInfo from "./PatientInfo";
import DoctorInfo from "./DoctorInfo";
import ClinicInfo from "./ClinicInfo";
import NoAppointment from "./NoAppointment";
import MedicalExaminationResults from "./Prescription/Prescription/MedicalExaminationResults";

const statusConfig = {
  1: {
    text: "Chờ xác nhận",
    variant: "warning",
    icon: <Clock1 className="h-4 w-4 mr-1" />,
  },
  2: {
    text: "Đã xác nhận",
    variant: "success",
    icon: <BadgeCheck className="h-4 w-4 mr-1" />,
  },
   3: {
    text: "Đã hủy",
    variant: "destructive",
    icon: <X className="h-4 w-4 mr-1" />,
  },
  4: {
    text: "Đã từ chối",
    variant: "destructive",
    icon: <CircleSlash className="h-4 w-4 mr-1" />,
  },
  5: {
    text: "Đã thanh toán",
    variant: "success",
    icon: <CheckCircle className="h-4 w-4 mr-1" />,
  },
 
};

const AppointmentDetail = ({ booking , fetch }) => {
  if (!booking) {
    return (
      <>
       <NoAppointment/>
      </>
     )
  }

  const status =
    statusConfig[booking?.appointment?.status_id] || statusConfig[1];

  return (
    <div className="bg-white rounded-lg">
      {/* Header with status */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700 mb-1">
            Chi tiết lịch khám
          </h1>
          <p className="text-gray-600 text-sm">
            Mã lịch khám:{" "}
            <span className="font-semibold">#{booking.appointment.id}</span>
          </p>
        </div>
        <div className="flex gap-4">
          <Badge
            className={`px-3 py-1.5 text-sm flex items-center gap-1.5
              ${
                status.variant === "success"
                  ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
                  : status.variant === "warning"
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
                  : "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
              }`}
          >
            {status.icon}
            {status.text}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-4 w-full grid grid-cols-5 gap-2">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" />
            Thông tin chung
          </TabsTrigger>
          <TabsTrigger value="patient" className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            Bệnh nhân
          </TabsTrigger>

           <TabsTrigger value="medical_examination_results" className="flex items-center gap-2">
            <FileText  className="h-4 w-4 text-blue-600" />
           Kết quả khám bệnh
          </TabsTrigger>
          <TabsTrigger value="doctor" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-blue-600" />
            Bác sĩ
          </TabsTrigger>
          <TabsTrigger value="clinic" className="flex items-center gap-2">
            <Building className="h-4 w-4 text-blue-600" />
            Phòng khám
          </TabsTrigger>
          
        </TabsList>

        {/* Tab Contents */}
        <TabsContent value="info">
          <InfoBooking fetch={fetch} booking={booking} />
        </TabsContent>

        <TabsContent value="patient">
          <PatientInfo booking={booking} />
        </TabsContent>
     
    <TabsContent value="medical_examination_results" className="space-y-6">
        <MedicalExaminationResults booking={booking} />
      </TabsContent>
        <TabsContent value="doctor">
          <DoctorInfo booking={booking} />
        </TabsContent>

        <TabsContent value="clinic">
          <ClinicInfo booking={booking} />
        </TabsContent>

         
      </Tabs>
    </div>
  );
};

export default AppointmentDetail;