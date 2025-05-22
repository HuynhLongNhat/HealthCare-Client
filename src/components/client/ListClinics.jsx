import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllClinics } from "@/api/doctor.api";
import { Link, useNavigate } from "react-router-dom";
import { Home, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProvinces } from "@/api/address.api";
import { ComboBox } from "../Combobox";
import { Separator } from "../ui/separator";
const ListClinics = () => {
  const [clinics, setClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [provinces, setProvinces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClinics();
    fetchProvinces();
  }, []);

  useEffect(() => {
    filterClinics();
  }, [searchTerm, selectedProvince, clinics]);

  const fetchClinics = async () => {
    try {
      const res = await getAllClinics();
      if (res && res.EC === 0) {
        setClinics(res.DT);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProvinces = async () => {
    const provincesData = await getProvinces();
    setProvinces(provincesData);
  };

  const filterClinics = () => {
    let result = [...clinics];

    // Filter by search term
    if (searchTerm) {
      result = result.filter((clinic) =>
        clinic.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedProvince) {
      result = result.filter((clinic) => {
        const addressParts = clinic.address?.split(",")[3]?.trim();
        return addressParts && addressParts === selectedProvince;
      });
    }

    setFilteredClinics(result);
  };

  return (
    <div className="container mx-auto p-6 mt-20 bg-white shadow-lg rounded-xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <ol className="list-reset flex items-center space-x-2">
          <li>
            <Link
              to="/"
              className="text-blue-600 hover:underline flex items-center"
            >

              <Home size={18} className="mr-1" /> 
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-600 ">Danh sách cơ sở y tế</li>

         
        </ol>
      </nav>
    
      <div className="mb-8">

        <div className="flex items-center justify-between mb-4 w-full">
  {/* Tiêu đề bên trái */}
  <h1 className="text-2xl font-bold text-blue-600">Cơ sở y tế</h1>

  {/* Bộ lọc bên phải */}
  <div className="flex items-center space-x-3">
    {/* ComboBox */}
    <div className="w-1/3 min-w-[180px]">
      <ComboBox
        options={
          provinces?.map((province) => ({
            label: province.label,
            value: province.label,
          })) || []
        }
        value={selectedProvince}
        onChange={setSelectedProvince}
        placeholder="Tỉnh thành"
        className="w-full focus-visible:ring-blue-500"
      />
    </div>

    {/* Ô tìm kiếm (giữ nguyên chiều rộng) */}
    <div className="w-[280px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm cơ sở y tế..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  </div>
</div>

  <Separator />
</div>


      {/* Results Count */}
      <div className="text-sm text-gray-500 mb-4">
        Tìm thấy {filteredClinics.length} cơ sở y tế
      </div>

      {/* Grid List */}
      {filteredClinics.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredClinics.map((clinic) => (
            <Card
              key={clinic.id}
              className="hover:shadow-xl border border-gray-100 transition-shadow duration-300 cursor-pointer rounded-xl overflow-hidden"
              onClick={() => navigate(`/clinics/${clinic.id}`)}
            >
              <CardContent className="p-4 flex flex-col items-center space-y-3">
                {/* Image */}
                <div className="w-full h-44 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {clinic.avatar ? (
                    <img
                      src={clinic.avatar}
                      alt={clinic.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-4xl font-bold">
                      {clinic.name.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-center text-base font-semibold text-gray-800 line-clamp-2">
                  {clinic.name}
                </h3>

                {/* Address */}
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-center line-clamp-2">
                    {clinic.address?.split(",")[3]?.trim() || clinic.address?.split(",")[2]?.trim() || clinic.address?.split(",")[1]?.trim() ||
                    
                    "Địa chỉ chưa rõ"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Không tìm thấy cơ sở y tế phù hợp
        </div>
      )}
    </div>
  );
};

export default ListClinics;
