import { useState, useEffect } from "react";
import {
  Search,
  Clock,
  User,
  Home,
  ChevronRight,
  File,
  Book,
  BookOpen,
  Notebook,
  BookOpenText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAllHealthHandBook } from "@/api/doctor.api";
import AuthorSection from "./AuthorSection";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import LatestArticlesSection from "./LatestArticlesSection";
import OutStandingHealthHandBook from "./OutStandingHealthHandBook";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";

const ListHealthHandBook = () => {
  const [handbooks, setHandbooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllHealthHandBooks();
  }, []);

  const fetchAllHealthHandBooks = async () => {
    setLoading(true);
    try {
      const res = await getAllHealthHandBook();
      if (res.EC === 0) {
        setHandbooks(res.DT);
      }
    } catch (error) {
      console.error("Failed to fetch health handbooks", error);
    }
    setLoading(false);
  };

  const filteredHandbooks = handbooks.filter((handbook) =>
    handbook.handbook.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                Cẩm nang sức khỏe
              </span>
            </li>
          </ol>
        </nav>

        {/* Header section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-600 flex items-center">
                <BookOpenText className="mr-3 text-blue-600" size={28} />
                Cẩm nang sức khỏe
              </h1>
              <p className="text-gray-600 mt-2">
                Kiến thức y tế và lời khuyên từ các chuyên gia hàng đầu
              </p>
            </div>

            {/* Search bar */}
            <div className="w-full md:w-96">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm bài viết..."
                  className="pl-10 border-gray-300  bg-white focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <Separator className="bg-gray-200" />
        </div>

        {/* Outstanding Articles */}
        <div className="mb-16">
          <OutStandingHealthHandBook />
        </div>

        {/* Latest Articles Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-x-3">
              <Clock className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Bài viết mới nhất
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 px-3 py-1">
                {filteredHandbooks.length} bài viết
              </Badge>
              {searchTerm && (
                <span className="text-sm text-gray-500">
                  Tìm kiếm: "{searchTerm}"
                </span>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-96 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          ) : filteredHandbooks.length === 0 ? (
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
                Không tìm thấy bài viết phù hợp
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm
                  ? "Hãy thử thay đổi từ khóa tìm kiếm của bạn"
                  : "Hiện không có bài viết nào trong hệ thống"}
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
          ) : (
            <LatestArticlesSection handbooks={filteredHandbooks} />
          )}
        </section>

        {/* Authors Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-x-3">
              <User className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Đội ngũ chuyên gia
              </h2>
            </div>
          </div>
          <AuthorSection handbooks={handbooks} />
        </section>
      </motion.div>
    </div>
  );
};

export default ListHealthHandBook;
