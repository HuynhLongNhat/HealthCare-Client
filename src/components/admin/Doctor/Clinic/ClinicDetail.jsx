import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Stethoscope,
  Edit,
  Info,
  Loader,
  Home,
  ChevronRight,
} from "lucide-react";
import { getClinicDetail } from "@/api/doctor.api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";
import useAuthToken from "@/utils/userAuthToken";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
          <li className="flex items-center cursor-pointer" onClick={() => navigate("/clinics")}>
            <span className="text-blue-700 hover:text-blue-800 font-medium">Cơ sở y tế</span>
          </li>
          <li className="flex items-center">
            <ChevronRight
              size={16}
              className="text-gray-400 mx-1"
              aria-hidden="true"
            />
          </li>
          <li className="flex items-center">
            <span className="text-gray-700 font-medium">{clinicDetail?.name}</span>
          </li>
        </ol>
      </nav>
      <div className="relative rounded-2xl w-full bg-white overflow-hidden shadow-lg border border-gray-100">
        {/* Edit button for authorized users - positioned more discreetly */}
        {(auth?.role === 1 || auth?.userId === clinicDetail.doctor_id) &&
          clinicDetail && (
            <div className="absolute top-4 right-4 z-20">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                onClick={() =>
                  navigate(
                    `/doctor/${auth.userId}/clinics/${clinicDetail.id}/update`
                  )
                }
              >
                <Edit className="h-4 w-4 text-blue-500" />
                <span className="sr-only">Chỉnh sửa</span>
              </Button>
            </div>
          )}

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row">
          {/* Image section - more subtle presentation */}
          {clinicDetail?.avatar && (
            <div className="md:w-1/3  w-full h-64  relative overflow-hidden">
              <img
                src={clinicDetail.avatar}
                alt={clinicDetail.name}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          )}

          {/* Content section - clean typography */}
          <div className="flex-1 p-6 md:p-8 space-y-4">
            {/* Badge row */}

            {/* Clinic name - prominent but not overwhelming */}
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600">
              {clinicDetail?.name || "Phòng khám"}
            </h1>

            {/* Location section - clean and readable */}
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-medium">Địa chỉ:</p>
                  <p className="text-gray-600">
                    {clinicDetail?.address}
                    {clinicDetail?.district && `, ${clinicDetail.district}`}
                    {clinicDetail?.province && `, ${clinicDetail.province}`}
                  </p>
                </div>
              </div>

              {/* Additional info sections can be added here */}
            </div>

            {/* Decorative divider */}
            <div className="pt-4">
              <div className="border-t border-gray-200"></div>
            </div>

            {/* Action buttons */}
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
                          className="ml-10 list-disc text-gray-800 leading-relaxed mb-1"
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
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
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
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 mb-4 sm:mb-0 mx-auto sm:mx-0">
                      <Avatar className="h-16 w-16 border-2 border-gray-200 shadow-sm">
                        <AvatarImage
                          src={clinicDetail.doctor.DT.userData.profile_picture}
                        />
                        <AvatarFallback className="text-2xl">
                          {clinicDetail.doctor.DT.userData.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
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
                          {clinicDetail?.doctor?.DT?.doctor?.specialization
                            ?.name || "Chưa cập nhật"}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                          <span className="truncate">
                            {clinicDetail.doctor.DT?.userData?.address
                              ? clinicDetail.doctor.DT?.userData.address
                                  .split(",")
                                  .slice(3)
                                  .join(", ")
                              : "Chưa cập nhật địa chỉ"}
                          </span>
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
