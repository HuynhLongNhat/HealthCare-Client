import { useState, useEffect } from "react";
import { Loader, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAllDoctors, getAllSpecializations } from "@/api/doctor.api";
import Select from "react-select";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DoctorStatistic from "./DoctorStatistic";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(5);
  const navigate = useNavigate();

  const [positionFilter, setPositionFilter] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [specializations, setSpecializations] = useState([]);
  
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
      setLoading(false);
    } catch (err) {
      setError("Error fetching doctors");
      setLoading(false);
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
      doctor.userData.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.doctor?.specialization?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Lọc theo chức vụ
    const selectedPositionLabel = positions.find((pos) => pos.value === positionFilter)?.label || "";
    const matchesPosition = positionFilter
      ? doctor.doctor?.position === selectedPositionLabel
      : true;

    // Lọc theo chuyên khoa - sửa lại phần này
    const matchesSpecialization = selectedSpecialization
      ? doctor.doctor?.specialization?.name === selectedSpecialization
      : true;

    return matchesSearch && matchesPosition && matchesSpecialization;
  });

  // Tạo options cho select chuyên khoa
  const specializationOptions = [
    { value: "", label: "Tất cả chuyên khoa" },
    ...specializations.map((spec) => ({
      value: spec.name,
      label: spec.name,
    })),
  ];
  // Phân trang
  const endIndex = currentPage * doctorsPerPage;
  const startIndex = endIndex - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 mt-20">
      <Card>
        <CardHeader>
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Quản lý bác sĩ
            </h1>
            <p className="text-gray-600 dark:text-gray-300 my-2">
              Quản lý thông tin bác sĩ
            </p>
          </div>
   <DoctorStatistic/>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
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
                  setCurrentPage(1);
                }}
                options={[{ value: "", label: "Tất cả chức vụ" }, ...positions]}
                className="w-64"
                placeholder="Chọn chức vụ..."
                isClearable
              />

              {/* Lọc chuyên khoa - sửa lại phần này */}
              <div className="w-64">
                <Select
                  options={specializationOptions}
                  value={
                    specializationOptions.find(
                      (option) => option.value === selectedSpecialization
                    ) || { value: "", label: "Tất cả chuyên khoa" }
                  }
                  onChange={(selectedOption) => {
                    setSelectedSpecialization(selectedOption.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Chọn chuyên khoa..."
                  isClearable
                />
              </div>
            </div>

            {/* Ô tìm kiếm */}
            <div className="relative w-full md:w-64 mt-4 md:mt-0">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-50 text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Họ và tên</th>
                  <th className="px-4 py-2">Chức danh</th>
                  <th className="px-4 py-2">Kinh nghiệm</th>
                  <th className="px-4 py-2">Chuyên khoa</th>
                </tr>
              </thead>
              <tbody>
                {currentDoctors.map((doctor) => (
                  <tr
                    key={doctor?.userData?.id}
                    className="border-b cursor-pointer hover:bg-gray-100"
                    onClick={() => navigate(`/doctor/${doctor?.userData?.id}`)}
                  >
                    <td className="px-4 py-2">
                      {doctor?.userData?.id || "Chưa cập nhật"}
                    </td>
                    <td className="px-4 py-2">
                      {doctor?.userData?.email || "Chưa cập nhật"}
                    </td>
                    <td className="px-4 py-2">
                      {doctor?.userData?.full_name || "Chưa cập nhật"}
                    </td>
                    <td className="px-4 py-2">
                      <Badge
                        className={`px-3 py-1 rounded-xl font-semibold text-sm
                          ${
                            doctor.doctor?.position === "Bác sĩ"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                              : doctor.doctor?.position === "Thạc sĩ"
                              ? "bg-cyan-100 text-cyan-800 hover:bg-cyan-200"
                              : doctor.doctor?.position === "Tiến sĩ"
                              ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                              : doctor.doctor?.position === "Phó giáo sư"
                              ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                              : doctor.doctor?.position === "Giáo sư"
                              ? "bg-red-100 text-red-800 hover:bg-red-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }
                        `}
                      >
                        {doctor.doctor?.position || "Chưa cập nhật"}
                      </Badge>
                    </td>
                    <td className="px-4 py-2">
                      {doctor?.doctor?.experience
                        ? `${doctor.doctor.experience} năm`
                        : "Chưa cập nhật"}
                    </td>
                    <td className="px-4 py-2">
                      {doctor?.doctor?.specialization?.name || "Chưa cập nhật"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredDoctors.length > 0 && (

          <div className="mt-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showingFrom={startIndex + 1}
              showingTo={Math.min(endIndex, filteredDoctors.length)}
              totalItems={filteredDoctors.length}
              itemName="Bác sĩ"
              />
          </div>
              )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorList;