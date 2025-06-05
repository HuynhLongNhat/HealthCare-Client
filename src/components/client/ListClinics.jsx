import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllClinics } from "@/api/doctor.api";
import { Link, useNavigate } from "react-router-dom";
import {
  Building,
  Building2Icon,
  ChevronRight,
  Home,
  MapPin,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProvinces } from "@/api/address.api";
import { ComboBox } from "../Combobox";
import { Separator } from "../ui/separator";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const AnimatedCard = ({ children, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={itemVariants}
      transition={{ delay: index * 0.1 }}
    >
      {children}
    </motion.div>
  );
};

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
    <div className="container mx-auto p-4 md:p-6 mt-16 md:mt-20">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-50 -z-10 opacity-70" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
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
              <span className="text-gray-700 font-medium">Cơ sở y tế</span>
            </li>
          </ol>
        </nav>

        {/* Header with search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-600 flex items-center">
                <Building2Icon className="mr-3 text-blue-600" size={28} />
                Cơ sở y tế
              </h1>
              <p className="text-gray-600 mt-1">
                Tìm kiếm và lựa chọn cơ sở y tế phù hợp
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center w-full md:w-auto gap-3">
              <div className="w-full md:w-48">
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
                  className="w-full focus-visible:ring-blue-500 border-gray-300"
                />
              </div>

              <div className="w-full md:w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm cơ sở y tế..."
                    className="pl-10 border-gray-300  bg-white focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />
        </div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-600 mb-6 flex items-center"
        >
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            {filteredClinics.length} kết quả
          </span>
          <span className="ml-3 hidden sm:inline">
            {searchTerm ? `Tìm kiếm: "${searchTerm}"` : "Tất cả cơ sở y tế"}
            {selectedProvince && ` tại ${selectedProvince}`}
          </span>
        </motion.div>

        {/* Grid List */}
        {filteredClinics.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredClinics.map((clinic, index) => (
              <AnimatedCard key={clinic.id} index={index}>
                <Card
                  className="hover:shadow-lg border border-gray-200 transition-all duration-300 cursor-pointer rounded-xl overflow-hidden bg-white hover:border-blue-200 group"
                  onClick={() => navigate(`/clinics/${clinic.id}`)}
                >
                  <CardContent className="p-4 flex flex-col items-center space-y-3">
                    {/* Image */}
                    <div className="w-full h-48 rounded-lg overflow-hidden  flex items-center justify-center">
                      {clinic.avatar ? (
                        <img
                          src={clinic.avatar}
                          alt={clinic.name}
                          className="w-full h-full object-contain"
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
                      <MapPin size={16} className="mr-1 text-blue-600" />
                      <span className="text-center line-clamp-2">
                        {(
                          <span>{clinic.address.split(",").pop().trim()}</span>
                        ) || "Địa chỉ chưa rõ"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </motion.div>
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
              Không tìm thấy cơ sở y tế phù hợp
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || selectedProvince
                ? "Hãy thử thay đổi tiêu chí tìm kiếm của bạn"
                : "Hiện không có cơ sở y tế nào trong hệ thống"}
            </p>
            {(searchTerm || selectedProvince) && (
              <button
                onClick={() => {
                  setSearchTerm("");
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

export default ListClinics;
