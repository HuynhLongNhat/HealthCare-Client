import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Loader,
  Calendar,
  Clock,
  Users,
  Info,
  FileText,
  Stethoscope,
  MapPin,
  Home,
  CalendarCheck,
  Video,
  ShieldCheck,
  MapPinCheck,
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

      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg overflow-hidden mt-5 relative">
        <div className="max-w-6xl mx-auto p-6 md:p-8">
          {/* Nút chỉnh sửa - góc trên phải */}
          {(auth?.role === 1 || auth?.role === 2) && specializationId && (
            <div className="absolute top-6 right-6 z-20">
              <Button
                variant="ghost"
                className="bg-white/90 hover:bg-white text-blue-600 shadow-sm hover:shadow-md px-4 py-2 rounded-lg transition-all backdrop-blur-sm"
                onClick={() =>
                  navigate(`/doctor/specializations/update/${specializationId}`)
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-start gap-8 pt-2">
            {/* Avatar section */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden bg-white/10 flex-shrink-0 border-[3px] border-white/30 shadow-inner hover:border-white/50 transition-all duration-300 group">
              {specialization.avatar ? (
                <img
                  src={specialization.avatar}
                  alt={specialization.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-blue-400/30 flex items-center justify-center backdrop-blur-sm">
                  <Stethoscope className="h-16 w-16 text-white/90" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
            </div>

            {/* Content section */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {specialization.name}
                </h1>
                <p className="text-white/90 mt-2 max-w-2xl">
                  {specialization.description ||
                    "Chuyên khoa y tế chất lượng cao"}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm px-4 py-1.5 border-white/30">
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Đặt khám trực tuyến
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm px-4 py-1.5 border-white/30">
                  <Video className="mr-2 h-4 w-4" />
                  Tư vấn từ xa
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm px-4 py-1.5 border-white/30">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Bảo hiểm y tế
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="  py-8">
        <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-[250px] grid-cols-2">

            <TabsTrigger value="overview" >
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="doctors" >
              Bác sĩ ({doctors.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-none shadow-md">
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
                      {/* Avatar */}
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-3xl font-semibold text-blue-600">
                        {doctor.userData?.profile_picture ? (
                          <img
                            src={doctor.userData.profile_picture}
                            alt={doctor.userData.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          doctor.userData?.full_name?.charAt(0) || "?"
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-bold text-xl text-blue-800">
                          {doctor.userData.full_name}
                        </h3>

                        {/* Address */}
                        <div className="flex items-center justify-center sm:justify-start mt-2 text-gray-600">
                          <MapPinCheck className="text-blue-700 w-5 h-5 mr-2" />
                          <span>
                            {doctor?.userData?.address
                              ? doctor.userData.address.split(",")[3] ||
                                "Địa chỉ chưa cập nhật"
                              : "Địa chỉ chưa cập nhật"}
                          </span>
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
