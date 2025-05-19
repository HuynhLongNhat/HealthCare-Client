import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit,
  Loader,
  Info,
  Stethoscope,
  Home,
  MapPinCheck,
  Star,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";
import {
  getAllDoctorBySpecialization,
  getSpecializationsById,
} from "@/api/doctor.api";
import useAuthToken from "@/utils/userAuthToken";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
const DetailSpecialization = () => {
  const { specializationId } = useParams();
  const auth = useAuthToken();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataSpecializationById();
    fetchAllDoctorsBySpecialization();
  }, [specializationId]);

  const fetchDataSpecializationById = async () => {
    try {
      const res = await getSpecializationsById(specializationId);
      setSpecialization(res.DT);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchAllDoctorsBySpecialization = async () => {
    const res = await getAllDoctorBySpecialization(specializationId);
    if (res.EC === 0) {
      setDoctors(res.DT);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 mt-20 bg-white shadow-md rounded-lg mb-3">
      <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
        <ol className="list-reset flex">
          <li>
            <Link to="/" className="text-blue-600 hover:underline">
              <Home size={18} />
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/specializations")}
          >
            Danh sách chuyên khoa
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-500">{specialization.name}</li>
        </ol>
      </nav>

      <div className="bg-blue-50 rounded-2xl shadow-xl overflow-hidden mt-6 relative isolate">
        <div className="">
          {/* Edit button - floating with better styling */}
          {(auth?.role === 1 ) && specializationId && (
            <div className="absolute top-6 right-6 z-20">
              <button
                className="absolute top-0 right-0 p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-md border border-gray-200"
                onClick={() =>
                  navigate(`/doctor/specializations/update/${specializationId}`)
                }
              >
                <Edit className="h-4 w-4 text-blue-600" />
              </button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            {/* Avatar section - redesigned with elegant effects */}
            <div className="relative group">
              <div className="relative w-56 h-56 rounded-full overflow-hidden flex-shrink-0 border-4 border-white shadow-xl ring-4 ring-blue-100/50 hover:ring-blue-200 transition-all duration-500">
                {specialization.avatar ? (
                  <>
                    <img
                      src={specialization.avatar}
                      alt={specialization.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-800/10" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Stethoscope className="h-24 w-24 text-white/90 drop-shadow-lg" />
                  </div>
                )}
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-3 -right-3 bg-blue-500/10 backdrop-blur-sm w-24 h-24 rounded-full -z-10 group-hover:scale-150 transition-transform duration-700"></div>
            </div>

            {/* Content section - enhanced with visual hierarchy */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                    Chuyên khoa
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  {specialization.name}
                </h1>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                    <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                    4.9 (128 đánh giá)
                  </span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Đang trực tuyến
                  </span>
                </div>
              </div>

              {/* Decorative divider */}
              <div className="w-20 h-0.5 bg-gray-200 my-4"></div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold text-blue-600">15+</div>
                  <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold text-blue-600">2K+</div>
                  <div className="text-sm text-gray-600">Bệnh nhân</div>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold text-blue-600">98%</div>
                  <div className="text-sm text-gray-600">Hài lòng</div>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="text-3xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600">Hỗ trợ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="  py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-[250px] grid-cols-2">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="doctors">Bác sĩ ({doctors.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-none shadow-md bg-blue-50">
              <CardHeader className="pb-2">
                <h2 className="text-xl font-bold text-blue-600 flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Giới thiệu
                </h2>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    <div className="prose max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ ...props }) => (
                            <h1
                              className="text-2xl font-bold text-primary mb-4"
                              {...props}
                            />
                          ),
                          h2: ({ ...props }) => (
                            <h2
                              className="text-xl font-semibold text-primary mb-3"
                              {...props}
                            />
                          ),
                          p: ({ ...props }) => (
                            <p
                              className="text-gray-800 leading-relaxed mb-2"
                              {...props}
                            />
                          ),
                          strong: ({ ...props }) => (
                            <strong
                              className="font-semibold text-gray-900"
                              {...props}
                            />
                          ),
                          li: ({ ...props }) => (
                            <li
                              className="ml-4 list-disc text-gray-800 leading-relaxed mb-1"
                              {...props}
                            />
                          ),
                          a: ({ ...props }) => (
                            <a
                              className="text-blue-600 underline hover:text-blue-800"
                              target="_blank"
                              rel="noopener noreferrer"
                              {...props}
                            />
                          ),
                          ul: ({ ...props }) => (
                            <ul
                              className="list-disc pl-5 space-y-1"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {String(specialization?.description || "")}
                      </ReactMarkdown>
                    </div>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <h2 className="text-xl font-bold text-blue-600 flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Đội ngũ bác sĩ chuyên khoa {specialization.name}
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.userData.id}
                      className="flex cursor-pointer flex-col sm:flex-row items-center gap-4 p-5 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md hover:bg-blue-50 transition"
                      onClick={() => navigate(`/doctor/${doctor.userData.id}`)}
                    >
                         <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <Avatar className="h-16 w-16 border-2 border-gray-200 shadow-sm">
                      <AvatarImage src={doctor.userData.profile_picture} />
                      <AvatarFallback className="text-2xl">
                        {doctor.userData.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Thông tin */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-blue-700 truncate">
                    {doctor.doctor.position} {doctor.userData.full_name}
                  </h3>

                  {/* Chuyên khoa */}
                  <div className="flex flex-wrap items-center gap-x-6 text-gray-500 mt-1">
                    {/* Chuyên khoa */}
                    <div className="flex items-center">
                      <Stethoscope className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                      <span className="truncate">
                        {doctor?.doctor?.specialization?.name ||
                          "Chưa cập nhật chuyên khoa"}
                      </span>
                    </div>

                    {/* Địa chỉ */}
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                      <span className="truncate">
                        {doctor?.userData?.address
                          ? doctor.userData.address
                              .split(",")
                              .slice(3)
                              .join(", ")
                          : "Chưa cập nhật địa chỉ"}
                      </span>
                    </div>
                  </div>
                </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DetailSpecialization;
