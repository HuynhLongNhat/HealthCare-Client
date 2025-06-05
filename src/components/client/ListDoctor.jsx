import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllDoctors, getAllSpecializations } from "@/api/doctor.api";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Stethoscope,
  MapPin,
  ChevronRight,
  Users,
} from "lucide-react";
import { Input } from "../ui/input";
import { ComboBox } from "../Combobox";
import { getProvinces } from "@/api/address.api";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Badge } from "../ui/badge";

// Animation components
const AnimatedCard = ({ children, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {children}
    </motion.div>
  );
};

const ListDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const positions = [
    { value: "", label: "Tất cả chức vụ" },
    { value: 1, label: "Bác sĩ" },
    { value: 2, label: "Thạc sĩ" },
    { value: 3, label: "Tiến sĩ" },
    { value: 4, label: "Phó giáo sư" },
    { value: 5, label: "Giáo sư" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchDoctors(),
        fetchSpecializations(),
        fetchProvinces(),
      ]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const fetchProvinces = async () => {
    const provincesData = await getProvinces();
    setProvinces(provincesData);
  };

  const fetchDoctors = async () => {
    try {
      const response = await getAllDoctors();
      setDoctors(response.DT);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await getAllSpecializations();
      setSpecializations(response.DT);
    } catch (error) {
      console.error("Failed to fetch specializations:", error);
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.userData.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.userData.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      doctor.doctor?.specialization?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const selectedPositionLabel =
      positions.find((pos) => pos.value === positionFilter)?.label || "";
    const matchesPosition = positionFilter
      ? doctor.doctor?.position === selectedPositionLabel
      : true;

    const matchesSpecialization = selectedSpecialization
      ? doctor.doctor?.specialization?.name === selectedSpecialization
      : true;

    const matchesProvince = selectedProvince
      ? doctor.userData.address?.split(",").at(-1)?.trim() === selectedProvince
      : true;

    return (
      matchesSearch &&
      matchesPosition &&
      matchesSpecialization &&
      matchesProvince
    );
  });

  const specializationOptions = [
    { label: "Tất cả chuyên khoa", value: "" },
    ...specializations.map((spec) => ({
      value: spec.name,
      label: spec.name,
    })),
  ];

  const provinceOptions = [
    { label: "Tất cả tỉnh thành", value: "" },
    ...(provinces?.map((province) => ({
      label: province.label,
      value: province.label,
    })) || []),
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 mt-16 md:mt-20">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-50 -z-10 opacity-70" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Breadcrumb */}
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
            <li className="flex items-center">
              <span className="text-gray-700 font-medium">Đội ngũ bác sĩ</span>
            </li>
          </ol>
        </nav>

        {/* Header section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-600 flex items-center">
                <Users className="mr-3 text-blue-600" size={28} />
                Đội ngũ bác sĩ
              </h1>
              <p className="text-gray-600 mt-2">
                Tìm kiếm và lựa chọn bác sĩ phù hợp với nhu cầu của bạn
              </p>
            </div>
          </div>

          {/* Filter section */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm bác sĩ..."
                  className="pl-10 border-gray-300 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Position filter */}
              <ComboBox
                options={positions}
                value={positionFilter}
                onChange={setPositionFilter}
                placeholder="Chọn chức vụ"
                className="border-gray-300 focus:border-blue-500"
              />

              {/* Specialization filter */}
              <ComboBox
                options={specializationOptions}
                value={selectedSpecialization}
                onChange={setSelectedSpecialization}
                placeholder="Chọn chuyên khoa"
                className="border-gray-300 focus:border-blue-500"
              />

              {/* Province filter */}
              <ComboBox
                options={provinceOptions}
                value={selectedProvince}
                onChange={setSelectedProvince}
                placeholder="Chọn tỉnh thành"
                className="border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="text-sm text-gray-600">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 px-3 py-1">
              {filteredDoctors.length} bác sĩ
            </Badge>
            {(searchTerm ||
              positionFilter ||
              selectedSpecialization ||
              selectedProvince) && (
              <span className="ml-3 hidden sm:inline">
                {searchTerm && `Tìm kiếm: "${searchTerm}"`}
                {selectedSpecialization &&
                  ` • Chuyên khoa: ${selectedSpecialization}`}
                {positionFilter &&
                  ` • Chức vụ: ${
                    positions.find((p) => p.value === positionFilter)?.label
                  }`}
                {selectedProvince && ` • Tỉnh thành: ${selectedProvince}`}
              </span>
            )}
          </div>
        </motion.div>

        {/* Doctors List */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-200"></div>
                    <div className="space-y-3 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="space-y-4">
            {filteredDoctors.map((doctor, index) => (
              <AnimatedCard key={doctor.userData.id} index={index}>
                <Card
                  className="hover:shadow-lg border border-gray-200 transition-all duration-300 cursor-pointer rounded-xl overflow-hidden bg-white hover:border-blue-200 group"
                  onClick={() => navigate(`/doctor/${doctor.userData.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      {/* Avatar */}
                      <div className="flex-shrink-0 relative">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden shadow-sm">
                          <Avatar className="h-28 w-28">
                            <AvatarImage
                              src={doctor.userData.profile_picture}
                            />
                            <AvatarFallback className="text-2xl bg-white">
                              {doctor.userData.full_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                      {/* Information */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {doctor.doctor.position || " "}{" "}
                          {doctor.userData.full_name}
                        </h3>

                        {/* Specialization */}
                        <div className="flex items-center mt-2 text-gray-600">
                          <Stethoscope className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                          <span>
                            {doctor?.doctor?.specialization?.name ||
                              "Chưa cập nhật chuyên khoa"}
                          </span>
                        </div>

                        {/* Address */}
                        <div className="flex items-center mt-2 text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-blue-600 flex-shrink-0" />
                          <span>
                            {doctor?.userData?.address
                              ? doctor.userData.address
                                  .split(",")
                                  .slice(3)
                                  .join(", ")
                              : "Chưa cập nhật địa chỉ"}
                          </span>
                        </div>

                        {/* View details */}
                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center transition-colors">
                            Xem hồ sơ{" "}
                            <ChevronRight size={16} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Search size={40} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Không tìm thấy bác sĩ phù hợp
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm ||
              positionFilter ||
              selectedSpecialization ||
              selectedProvince
                ? "Hãy thử thay đổi tiêu chí tìm kiếm của bạn"
                : "Hiện không có bác sĩ nào trong hệ thống"}
            </p>
            {(searchTerm ||
              positionFilter ||
              selectedSpecialization ||
              selectedProvince) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setPositionFilter("");
                  setSelectedSpecialization("");
                  setSelectedProvince("");
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ListDoctor;
