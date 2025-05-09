import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoctorById } from "@/api/doctor.api";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Edit,
  Home,
  MapPinCheck,
  Phone,
} from "lucide-react";
import InfoDoctor from "./InfoDoctor";
import ScheduleDoctor from "./Schedule/ScheduleDoctor";
import ReviewDoctor from "../../../client/ReviewDoctor";
import { getAuth } from "@/utils/getAuth";
import AppointmentManager from "../Appointment/AppointmentManager";
import TelemedicineSchedule from "../Meet/TelemedicineSchedule";

const DoctorProfile = () => {
  const [doctorProfile, setDoctorProfile] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();
  const { doctorId } = useParams();

  useEffect(() => {
    fetchDoctorById();
  }, []);

  const fetchDoctorById = async () => {
    try {
      const res = await getDoctorById(doctorId);
      if (res && res.DT) {
        setDoctorProfile(res.DT);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin bác sĩ:", error);
    }
  };

  if (!doctorProfile) return <div>Loading...</div>;

  const formatPhoneNumber = (phone) => {
    if (!phone) return "Số điện thoại chưa cập nhật";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
    } else if (cleaned.length === 9) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
    } else {
      return phone;
    }
  };

  return (
    <div className="container mx-auto p-6 mt-20 bg-white shadow-md rounded-lg mb-3">
      <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
        <ol className="list-reset flex">
          <li>
            <Link to="/" className="text-blue-600 hover:underline">
              <Home size={18} />
            </Link>
          </li>
          <li><span className="mx-2">/</span></li>
          <li
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/doctors")}
          >
            Danh sách bác sĩ
          </li>
          <li><span className="mx-2">/</span></li>
          <li className="text-gray-500">
            {doctorProfile?.userData?.full_name}
          </li>
        </ol>
      </nav>

      <div className="relative bg-blue-50 rounded-xl p-6 mb-6 mt-5 shadow">
        <div className="flex flex-col md:flex-row gap-6 relative">
          {/* Avatar bác sĩ */}
          <div className="relative w-44 h-44 shrink-0">
            {doctorProfile?.userData?.profile_picture ? (
              <img
                src={doctorProfile.userData.profile_picture}
                alt="Avatar"
                className="w-44 h-44 rounded-full border-4 border-blue-200 object-cover"
              />
            ) : (
              <div className="w-44 h-44 rounded-full border-4 border-blue-200 flex items-center justify-center bg-gray-100">
                <span className="text-4xl text-blue-600 font-bold">
                  {doctorProfile.userData?.full_name?.charAt(0) || "?"}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 relative">
            {auth?.role !== 3 && (
              <button
                className="absolute top-0 right-0 p-2 rounded-full bg-white/70 hover:bg-white transition-colors shadow"
                onClick={() => navigate(`/doctor/${doctorId}/update`)}
              >
                <Edit className="h-5 w-5 text-blue-600" />
              </button>
            )}
            <div className="mb-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                {doctorProfile?.doctor?.position}{" "}
                {doctorProfile?.userData?.full_name}
              </h1>
            </div>

            {/* Chuyên khoa + kinh nghiệm */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
              <span>
                {doctorProfile?.doctor?.specialization?.name || "Chuyên khoa chưa cập nhật"}
              </span>
              {doctorProfile?.doctor?.experience > 0 && (
                <span>{doctorProfile.doctor.experience} năm kinh nghiệm</span>
              )}
            </div>

            {/* Liên hệ */}
            <div className="flex flex-wrap items-center text-gray-700 text-sm gap-x-4 gap-y-2">
              <div className="flex items-center">
                <Phone className="text-blue-700 w-5 h-5 mr-2" />
                <span>{formatPhoneNumber(doctorProfile?.userData?.phone_number)}</span>
              </div>

              <div className="flex items-center">
                <MapPinCheck className="text-blue-700 w-5 h-5 mr-2" />
                <span>
                  {doctorProfile?.userData?.address
                    ? doctorProfile.userData.address.split(",")[3] || "Địa chỉ chưa cập nhật"
                    : "Địa chỉ chưa cập nhật"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="flex flex-wrap justify-between w-full md:w-2/3 gap-2">
          <TabsTrigger value="info" className="flex-1 text-center">Thông tin</TabsTrigger>
          <TabsTrigger value="schedule" className="flex-1 text-center">Lịch khám</TabsTrigger>
          <TabsTrigger value="reviews" className="flex-1 text-center">Đánh giá</TabsTrigger>
          <TabsTrigger value="appointments" className="flex-1 text-center">Lịch hẹn</TabsTrigger>
          <TabsTrigger value="telemedicine" className="flex-1 text-center">Khám trực tuyến</TabsTrigger>
        </TabsList>

        <TabsContent value="info"><InfoDoctor doctor={doctorProfile} /></TabsContent>
        <TabsContent value="schedule"><ScheduleDoctor doctor={doctorProfile} /></TabsContent>
        <TabsContent value="reviews"><ReviewDoctor /></TabsContent>
        <TabsContent value="appointments"><AppointmentManager /></TabsContent>
        <TabsContent value="telemedicine"><TelemedicineSchedule /></TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorProfile;
