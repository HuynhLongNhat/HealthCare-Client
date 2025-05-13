import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllDoctors, getAllSpecializations } from "@/api/doctor.api";
import { Link, useNavigate } from "react-router-dom";
import { Home, User, Star, Search } from "lucide-react";
import { Input } from "../ui/input";
import Select from "react-select";

const ListDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

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
  }, []);

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

    // Lọc theo chuyên khoa - sửa lại phần này
    const matchesSpecialization = selectedSpecialization
      ? doctor.doctor?.specialization?.name === selectedSpecialization
      : true;

    return matchesSearch && matchesPosition && matchesSpecialization;
  });
  const specializationOptions = [
    { value: "", label: "Tất cả chuyên khoa" },
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
      <div className="flex flex-wrap items-center justify-between mb-6">
        {/* Tiêu đề bên trái */}
        <h1 className="text-2xl font-bold text-gray-800">Danh sách bác sĩ</h1>

        {/* Bộ lọc nằm bên phải */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 ml-auto mt-4 md:mt-0">
          {/* Lọc chức vụ */}
          <Select
            value={
              positions.find((pos) => pos.value === positionFilter) || {
                value: "",
                label: "Tất cả chức vụ",
              }
            }
            onChange={(selectedOption) => {
              setPositionFilter(selectedOption?.value || "");
            }}
            options={[{ value: "", label: "Tất cả chức vụ" }, ...positions]}
            className="w-64"
            placeholder="Chọn chức vụ..."
            isClearable
          />

          {/* Lọc chuyên khoa */}
          <Select
            options={specializationOptions}
            value={
              specializationOptions.find(
                (option) => option.value === selectedSpecialization
              ) || { value: "", label: "Tất cả chuyên khoa" }
            }
            onChange={(selectedOption) => {
              setSelectedSpecialization(selectedOption.value);
            }}
            placeholder="Chọn chuyên khoa..."
            isClearable
            className="w-64"
          />

          {/* Ô tìm kiếm */}
          <div className="relative w-64">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-8"
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
                    {doctor.userData?.profile_picture ? (
                      <img
                        src={doctor.userData.profile_picture}
                        alt={doctor.userData.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-2xl font-medium text-gray-600">
                        {doctor.userData?.full_name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Thông tin */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {doctor.doctor.position} {doctor.userData.full_name}
                  </h3>

                  {/* Chuyên khoa */}
                  <div className="flex items-center text-gray-600 mt-1">
                    <User className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {doctor.doctor.specialization?.name ||
                        "Chưa cập nhật chuyên khoa"}
                    </span>
                  </div>

                  {/* Địa chỉ làm việc */}

                  {/* Đánh giá */}
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListDoctor;
