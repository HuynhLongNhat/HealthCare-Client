import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllDoctors, getAllSpecializations } from "@/api/doctor.api";
import { Link, useNavigate } from "react-router-dom";
import { Home, User, Star, Search, Stethoscope, MapPin } from "lucide-react";
import { Input } from "../ui/input";
import { ComboBox } from "../Combobox";
import { getProvinces } from "@/api/address.api";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ListDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");

  const navigate = useNavigate();

  const positions = [
    { value: 1, label: "Bác sĩ" },
    { value: 2, label: "Thạc sĩ" },
    { value: 3, label: "Tiến sĩ" },
    { value: 4, label: "Phó giáo sư" },
    { value: 5, label: "Giáo sư" },
  ];

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
    fetchProvinces();
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
    // Tìm kiếm theo từ khóa
    const matchesSearch =
      doctor.userData.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.userData.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      doctor.doctor?.specialization?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    // Lọc theo chức vụ
    const selectedPositionLabel =
      positions.find((pos) => pos.value === positionFilter)?.label || "";
    const matchesPosition = positionFilter
      ? doctor.doctor?.position === selectedPositionLabel
      : true;

    // Lọc theo chuyên khoa
    const matchesSpecialization = selectedSpecialization
      ? doctor.doctor?.specialization?.name === selectedSpecialization
      : true;

    // Lọc theo tỉnh/thành phố (địa chỉ là chuỗi, tỉnh thường nằm ở phần cuối)
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
    ...specializations.map((spec) => ({
      value: spec.name,
      label: spec.name,
    })),
  ];
  return (
    <div className="container mx-auto p-6 mt-20 bg-white shadow-md rounded-lg">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="list-reset flex items-center">
          <li>
            <Link
              to="/"
              className="text-blue-600 hover:underline flex items-center"
            >
              <Home size={18} className="mr-1" />
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-500">Danh sách bác sĩ</li>
        </ol>
      </nav>
      <div className="mb-6">
        {/* Tiêu đề */}
        <h1 className="text-2xl font-bold text-blue-600 mb-4 md:mb-6">
          Danh sách bác sĩ
        </h1>

        {/* Bộ lọc nằm ngang */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
          {/* ComboBox: Lọc chức vụ */}
          <div className="flex-1 min-w-[180px]">
            <ComboBox
              options={[
                { label: "Tất cả chức vụ", value: "" },
                ...positions.map((pos) => ({
                  label: pos.label,
                  value: pos.value,
                })),
              ]}
              value={positionFilter}
              onChange={setPositionFilter}
              placeholder="Chọn chức vụ..."
              className="w-full"
            />
          </div>

          {/* ComboBox: Lọc chuyên khoa */}
          <div className="flex-1 min-w-[180px]">
            <ComboBox
              options={[
                { label: "Tất cả chuyên khoa", value: "" },
                ...specializationOptions,
              ]}
              value={selectedSpecialization}
              onChange={setSelectedSpecialization}
              placeholder="Chọn chuyên khoa..."
              className="w-full"
            />
          </div>

          {/* ComboBox: Lọc tỉnh thành */}
          <div className="flex-1 min-w-[180px]">
            <ComboBox
              options={[
                { label: "Tất cả tỉnh thành", value: "" },
                ...(provinces?.map((province) => ({
                  label: province.label,
                  value: province.label,
                })) || []),
              ]}
              value={selectedProvince}
              onChange={setSelectedProvince}
              placeholder="Tỉnh thành"
              className="w-full"
            />
          </div>

          {/* Ô tìm kiếm */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Tìm thấy {filteredDoctors.length} kết quả
      </div>

      {/* Danh sách bác sĩ */}
      <div className="space-y-4">
        {filteredDoctors.map((doctor) => (
          <Card
            key={doctor.userData.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/doctor/${doctor.userData.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
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
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListDoctor;
