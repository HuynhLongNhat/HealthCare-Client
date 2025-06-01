import  { useState, useEffect } from "react";
import { Search, Clock, User, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllHealthHandBook } from "@/api/doctor.api";
import AuthorSection from "./AuthorSection";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import LatestArticlesSection from "./LatestArticlesSection";
import OutStandingHealthHandBook from "./OutStandingHealthHandBook";

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
          <li className="text-gray-500">Cẩm nang sức khỏe</li>
        </ol>
      </nav>
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-blue-600">
            Cẩm nang sức khỏe
          </h1>

          <div className="flex items-center space-x-4">
            {/* Ô tìm kiếm */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm..."
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
      <div className="container  py-12 ">
     <OutStandingHealthHandBook/>
        {/* Latest Articles Section */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-x-3">
              <Clock className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-blue-600">
                Bài viết mới nhất
              </h2>
            </div>
            <div className="text-sm text-gray-500">
              Tìm thấy {filteredHandbooks.length} kết quả
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="h-96 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          ) : filteredHandbooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Không tìm thấy bài viết phù hợp
              </p>
            </div>
          ) : (
            <LatestArticlesSection handbooks={filteredHandbooks} />
          )}
        </section>

        {/* Featured Articles Section */}

        {/* Authors Section */}
        <section >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <User className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-blue-600">
                Tác giả nội dung
              </h2>
            </div>
          </div>
          <AuthorSection handbooks={handbooks} />
        </section>
      </div>
    </div>
  );
};

export default ListHealthHandBook;
