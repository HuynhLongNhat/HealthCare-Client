import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoctorById } from "@/api/doctor.api";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Briefcase,
  ChevronRight,
  Edit,
  Home,
  MapPinCheck,
  Phone,
  Stethoscope,
} from "lucide-react";
import InfoDoctor from "./InfoDoctor";
import ScheduleDoctor from "./Schedule/ScheduleDoctor";
import ReviewDoctor from "../../../client/ReviewDoctor";
import useAuthToken from "@/utils/userAuthToken";
import { formatPhoneNumber } from "@/utils/helpers";
import MyBooking from "@/components/client/MyBooking";
import MeetingList from "../Meet/MeetingList";

const DoctorProfile = () => {
  const [doctorProfile, setDoctorProfile] = useState(null);
  const auth = useAuthToken();
  const navigate = useNavigate();
  const { doctorId } = useParams();

  useEffect(() => {
    fetchDoctorById();
  }, [doctorId]);

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

  return (
    <div className="container mx-auto p-6 mt-20 bg-white shadow-md rounded-lg mb-3">
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          <li className="flex items-center">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center group"
            >
              <Home
                size={16}
                className="mr-2 text-blue-500 group-hover:text-blue-700 transition-colors"
              />
              <span className="font-medium">Trang chủ</span>
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight
              size={16}
              className="text-gray-400 mx-1"
              aria-hidden="true"
            />
          </li>
          <li
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/doctors")}
          >
            <span className="text-blue-700 hover:text-blue-800 font-medium">
              Đội ngũ bác sĩ
            </span>
          </li>
          <li className="flex items-center">
            <ChevronRight
              size={16}
              className="text-gray-400 mx-1"
              aria-hidden="true"
            />
          </li>
          <li className="flex items-center">
            <span className="text-gray-700 font-medium">
              {" "}
              {doctorProfile?.doctor?.position || "Bác sĩ"} {" "}
              {doctorProfile?.userData?.full_name}
            </span>
          </li>
        </ol>
      </nav>
      <div className="relative bg-blue-50 rounded-xl mb-4 shadow">
        <div className="flex flex-col md:flex-row gap-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          {/* Avatar bác sĩ với hiệu ứng đẹp */}
          <div className="relative shrink-0">
            <div className="relative w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden">
              {doctorProfile?.userData?.profile_picture ? (
                <img
                  src={doctorProfile.userData.profile_picture}
                  alt="Avatar"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-5xl text-white font-bold">
                    {doctorProfile.userData?.full_name?.charAt(0) || "?"}
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Thông tin chi tiết */}
          <div className="flex-1 relative space-y-4">
            {auth &&
              (auth.role === 1 || Number(auth.userId) === Number(doctorId)) && (
                <button
                  className="absolute top-0 right-0 p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-md border border-gray-200"
                  onClick={() => navigate(`/doctor/${doctorId}/update`)}
                >
                  <Edit className="h-5 w-5 text-blue-600" />
                </button>
              )}

            {/* Tên và chức danh */}
            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-1">
                {doctorProfile?.doctor?.position || "Bác sĩ"}{" "}
                {doctorProfile?.userData?.full_name}
              </h4>
              <p className="text-blue-600 font-medium"></p>
            </div>

            {/* Chuyên khoa và kinh nghiệm */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full">
                <Stethoscope className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">
                  {doctorProfile?.doctor?.specialization?.name ||
                    "Chưa cập nhật chuyên khoa"}
                </span>
              </div>

              {doctorProfile?.doctor?.experience > 0 && (
                <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-full">
                  <Briefcase className="h-5 w-5 text-amber-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {doctorProfile.doctor.experience}+ năm kinh nghiệm
                  </span>
                </div>
              )}
            </div>

            {/* Thông tin liên hệ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Số điện thoại</p>
                  <p className="font-medium text-gray-800">
                    {formatPhoneNumber(doctorProfile?.userData?.phone_number) ||
                      "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  <MapPinCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Địa chỉ làm việc</p>
                  <p className="font-medium text-gray-800">
                    {doctorProfile?.userData?.address
                      ? doctorProfile?.userData?.address
                          .split(",")
                          .slice(3)
                          .join(", ")
                      : "Chưa cập nhật địa chỉ"}
                  </p>
                </div>
              </div>
            </div>

            {/* Các thông tin khác có thể thêm vào */}
            {doctorProfile?.doctor?.description && (
              <div className="pt-2">
                <p className="text-gray-600 leading-relaxed">
                  {doctorProfile.doctor.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList
          className={`grid w-full gap-2 grid-cols-2 md:grid-cols-4 ${
            auth && auth.userId === doctorProfile.doctor.user_id
              ? "lg:grid-cols-5"
              : "lg:grid-cols-4"
          }`}
        >
          <TabsTrigger value="info" className="text-center">
            Thông tin
          </TabsTrigger>
          <TabsTrigger value="schedule" className="text-center">
            Lịch làm việc
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-center">
            Đánh giá
          </TabsTrigger>
          {auth && auth.userId === doctorProfile.doctor.user_id && (
            <TabsTrigger value="appointments" className="text-center">
              Lịch khám
            </TabsTrigger>
          )}
          <TabsTrigger value="meetings" className="text-center">
            Tư vấn sức khỏe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <InfoDoctor doctor={doctorProfile} />
        </TabsContent>
        <TabsContent value="schedule">
          <ScheduleDoctor doctor={doctorProfile} />
        </TabsContent>
        <TabsContent value="reviews">
          <ReviewDoctor />
        </TabsContent>
        <TabsContent value="appointments">
          {/* <AppointmentManager /> */}
          <MyBooking />
        </TabsContent>
        <TabsContent value="meetings">
          <MeetingList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoctorProfile;
