import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Stethoscope,
  Edit,
  Info,
  Loader,
  Home,
  Star,
} from "lucide-react";
import { getClinicDetail } from "@/api/doctor.api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";
import useAuthToken from "@/utils/userAuthToken";
const ClinicDetail = () => {
  const auth = useAuthToken();
  const { clinicId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [clinicDetail, setClinicDetail] = useState();
  useEffect(() => {
    fetchClinicDetail();
  }, [clinicId]);

  const fetchClinicDetail = async () => {
    try {
      const res = await getClinicDetail(clinicId);
      console.log("res", res);
      if (res && res.EC === 0) {
        setClinicDetail(res.DT);
      }
    } catch (error) {
      console.log("Error fetching clinic detail:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500 mr-2" size={30} />
        <span className="text-xl text-blue-700">
          Đang tải thông tin phòng khám...
        </span>
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
            onClick={() => navigate("/clinics")}
          >
            Danh sách cơ sở y tế
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-500">{clinicDetail?.name}</li>
        </ol>
      </nav>
      <div className="relative mt-5 rounded-lg h-72 sm:h-96 w-full bg-gradient-to-r from-blue-700 to-indigo-600 overflow-hidden shadow-xl">
        {/* Nút chỉnh sửa - góc trên phải */}

        {(auth?.role === 1 || auth?.userId === clinicDetail.doctor_id) &&
          clinicDetail && (
            <div className="absolute top-4 right-4 z-20">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center px-3 py-1.5 text-sm bg-white/90 hover:bg-white text-blue-600 backdrop-blur-sm border-white/50 shadow-sm hover:shadow-md transition-all"
                onClick={() =>
                  navigate(
                    `/doctor/${auth.userId}/clinics/${clinicDetail.id}/update`
                  )
                }
              >
                <Edit className="h-[14px] w-[14px] mr-1" />
              </Button>
            </div>
          )}

        {/* Hình ảnh phòng khám */}
        {clinicDetail?.avatar && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={clinicDetail.avatar}
              alt={clinicDetail.name}
              className="w-full h-full object-cover object-center opacity-70 transform scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
            />
          </div>
        )}

        {/* Lớp phủ gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent backdrop-blur-[1px]" />

      

        {/* Hình ảnh phòng khám */}
        {clinicDetail?.avatar && (
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={clinicDetail.avatar}
              alt={clinicDetail.name}
              className="w-full h-full object-cover object-center opacity-70 transform scale-100 hover:scale-105 transition-transform duration-1000 ease-out"
            />
          </div>
        )}

        {/* Lớp phủ gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent backdrop-blur-[1px]" />

        {/* Nội dung thông tin */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
              Phòng khám
            </Badge>
            {clinicDetail?.type && (
              <Badge
                variant="outline"
                className="text-white border-white/50 bg-white/10 backdrop-blur-sm"
              >
                {clinicDetail.type}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-2 drop-shadow-lg">
            {clinicDetail?.name || "Phòng khám"}
          </h1>

          <div className="flex items-start text-white/95 mt-3">
            <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-base sm:text-lg leading-snug">
              {clinicDetail?.address}
              {clinicDetail?.district && `, ${clinicDetail.district}`}
              {clinicDetail?.province && `, ${clinicDetail.province}`}
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className=" mx-auto py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 w-full sm:w-auto  border shadow-sm rounded-lg p-1">
            <TabsTrigger value="overview" className="text-sm">
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="doctors" className="text-sm">
              Bác sĩ{" "}
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
                        <ul className="list-disc pl-5 space-y-1" {...props} />
                      ),
                    }}
                  >
                    {String(clinicDetail?.description || "")}
                  </ReactMarkdown>
                </div>
                <div className="mt-10">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Một số hình ảnh về{" "}
                    <span className="text-blue-500">{clinicDetail?.name}</span>
                  </h2>

                  {clinicDetail?.clinic_images?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {clinicDetail.clinic_images.map((image, index) => (
                        <div
                          key={index}
                          className="group rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out h-64 relative"
                        >
                          <img
                            src={image.imageUrl}
                            alt={`Ảnh ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white text-sm p-2 text-center">
                            Ảnh {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 text-lg mt-6 italic">
                      Không có ảnh mô tả!
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-blue-700 flex items-center mb-3">
                    <MapPin className="h-5 w-5 mr-2" />
                    Địa chỉ
                  </h3>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="h-96 w-full rounded-lg overflow-hidden mb-4">
                      <iframe
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          clinicDetail.address
                        )}&output=embed`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <h2 className="text-xl font-bold text-blue-600 flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Đội ngũ bác sĩ tại {clinicDetail?.name}
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    key={clinicDetail.doctor.DT.userData.id}
                    className="flex flex-col sm:flex-row p-4 border rounded-lg bg-white hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() =>
                      navigate(`/doctor/${clinicDetail.doctor_id}`)
                    }
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-4 sm:mb-0 mx-auto sm:mx-0">
                      <img
                        src={clinicDetail.doctor.DT.userData.profile_picture}
                        alt={clinicDetail.doctor.DT.userData.full_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="sm:ml-6 flex-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <h3 className="font-bold text-lg text-blue-700">
                          {clinicDetail.doctor.DT.doctor.position}{" "}
                          {clinicDetail.doctor.DT.userData.full_name}
                        </h3>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mt-1 gap-2 sm:gap-4">
                        <span className="flex items-center">
                          <Stethoscope className="h-3.5 w-3.5 mr-1" />
                          {clinicDetail.doctor.DT.doctor.specialization.name}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {clinicDetail.doctor.DT.doctor.experience}
                        </span>
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="flex text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < 4 ? "fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          4.8 (120 đánh giá)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related info */}
      <div className=" mx-auto  py-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Thông tin liên quan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h3 className="font-medium text-blue-700">
                Tìm hiểu thêm về các gói khám
              </h3>
              <p className="text-sm text-gray-600 mt-2 mb-4">
                Các gói khám sức khỏe tổng quát và chuyên sâu tại phòng khám
              </p>
              <Button variant="link" className="text-blue-600 px-0">
                Xem chi tiết →
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h3 className="font-medium text-blue-700">
                Hướng dẫn sử dụng BHYT
              </h3>
              <p className="text-sm text-gray-600 mt-2 mb-4">
                Quy trình và thủ tục khi sử dụng bảo hiểm y tế tại phòng khám
              </p>
              <Button variant="link" className="text-blue-600 px-0">
                Xem chi tiết →
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h3 className="font-medium text-blue-700">Câu hỏi thường gặp</h3>
              <p className="text-sm text-gray-600 mt-2 mb-4">
                Giải đáp các thắc mắc phổ biến của bệnh nhân về dịch vụ
              </p>
              <Button variant="link" className="text-blue-600 px-0">
                Xem chi tiết →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClinicDetail;
