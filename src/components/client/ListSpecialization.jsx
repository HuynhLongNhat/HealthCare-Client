import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllSpecializations } from "@/api/doctor.api";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Home, Search, Stethoscope } from "lucide-react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Loading from "../Loading";

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

const ListSpecialization = () => {
  const [specializations, setSpecializations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const filteredData = specializations.filter((spec) => {
    return spec.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const fetchSpecializations = async () => {
    try {
      setLoading(true);

      let res = await getAllSpecializations();
      if (res && res.EC === 0) {
        setSpecializations(res.DT);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }
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
              <span className="text-gray-700 font-medium">
                Chuyên khoa y tế
              </span>
            </li>
          </ol>
        </nav>

        {/* Header section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-600 flex items-center">
                <Stethoscope className="mr-3 text-blue-600" size={28} />
                Chuyên khoa y tế
              </h1>
              <p className="text-gray-600 mt-2">
                Tìm kiếm và lựa chọn chuyên khoa phù hợp với nhu cầu của bạn
              </p>
            </div>

            {/* Search bar */}
            <div className="w-full md:w-96">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm chuyên khoa..."
                  className="pl-10 border-gray-300  bg-white focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
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
          className="flex items-center justify-between mb-6"
        >
          <div className="text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
              {filteredData.length} kết quả
            </span>
            {searchTerm && (
              <span className="ml-3 hidden sm:inline">
                Tìm kiếm: "{searchTerm}"
              </span>
            )}
          </div>
        </motion.div>

        {/* Specializations Grid */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredData.map((specialty, index) => (
              <AnimatedCard key={specialty.id} index={index}>
                <Card
                  className="hover:shadow-lg border border-gray-200 transition-all duration-300 cursor-pointer rounded-xl overflow-hidden bg-white hover:border-blue-200 group"
                  onClick={() => navigate(`/specializations/${specialty.id}`)}
                >
                  <CardContent className="p-6 flex flex-col items-center">
                    {/* Avatar */}
                    <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 mb-4 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      {specialty.avatar ? (
                        <img
                          src={specialty.avatar}
                          alt={specialty.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-blue-800 opacity-70">
                          {specialty.name.charAt(0)}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-semibold text-gray-800 text-center group-hover:text-blue-600 transition-colors">
                      {specialty.name}
                    </h3>
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
              Không tìm thấy chuyên khoa phù hợp
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm
                ? "Hãy thử thay đổi từ khóa tìm kiếm của bạn"
                : "Hiện không có chuyên khoa nào trong hệ thống"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xóa tìm kiếm
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ListSpecialization;
