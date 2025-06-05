import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Calendar, Clock, Home, Edit, Eye, Badge, ChevronRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getAllHealthHandBookByDoctorId,
  getDetailHealthHandBook,
} from "@/api/doctor.api";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";
import { Card, CardContent } from "../ui/card";
import useAuthToken from "@/utils/userAuthToken";
const HealthHandbookDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [handbook, setHandbook] = useState();
  const [myHandBooks, setMyHandBooks] = useState();
  const auth = useAuthToken()
  useEffect(() => {
    fetchDetailHealthHandBook();
  }, [slug]);
  const fetchDetailHealthHandBook = async () => {
    const res = await getDetailHealthHandBook(slug);
    console.log(res);
    if (res.EC === 0) {
      setHandbook(res.DT);
    }
  };
  useEffect(() => {
    fetchAllMyHandbook();
  }, [handbook?.author_id]);

  const fetchAllMyHandbook = async () => {
    const res = await getAllHealthHandBookByDoctorId(handbook?.author_id);

    if (res.EC === 0) {
      setMyHandBooks(res.DT);
    }
  };
  if (!handbook) {
    return (
      <div className="container mx-auto max-w-2xl py-24 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75h.008v.008H9.75V9.75zm4.5 0h.008v.008h-.008V9.75zm.75 5.25a3.75 3.75 0 11-7.5 0m7.5 0H6.75a3.75 3.75 0 017.5 0zM21 12A9 9 0 113 12a9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-3xl font-bold text-gray-800">
            Bài viết không tồn tại
          </h2>
          <p className="text-gray-500">
            Cẩm nang bạn đang tìm có thể đã bị xóa hoặc chưa được đăng.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-6 mt-20 bg-white shadow-md rounded-lg">
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
          <li className="flex items-center cursor-pointer" onClick={() => navigate("/cam-nang-suc-khoe")}>
            <span className="text-blue-700 hover:text-blue-800 font-medium">Cẩm nang sức khỏe</span>
          </li>
          <li className="flex items-center">
            <ChevronRight
              size={16}
              className="text-gray-400 mx-1"
              aria-hidden="true"
            />
          </li>
          <li className="flex items-center">
            <span className="text-gray-700 font-medium">{handbook?.title}</span>
          </li>
        </ol>
      </nav>
        <div className="rounded-md relative w-full h-[40vh] md:h-[50vh] overflow-hidden bg-gradient-to-b from-blue-900/70 to-blue-900/90 flex items-center">
          {auth &&  auth.userId === handbook.userData.id &&
            (
              <button
                className="absolute z-50 top-2 right-2 p-2 rounded-full bg-white/70 hover:bg-white transition-colors shadow"
                onClick={() => navigate(`/cam-nang-suc-khoe/${slug}/cap-nhat`)}
              >
                <Edit className="h-5 w-5 text-blue-600" />
              </button>
            )}
          <div className="absolute inset-0 z-0">
            <img
              src={handbook?.image}
              alt={handbook?.title}
              className="w-full h-full object-cover opacity-40"
            />
          </div>

          <div className="container mx-auto px-4  z-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
              {handbook?.title}
            </h1>

            <div className="flex flex-wrap  items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center text-sm text-white gap-4">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate(`/doctor/${handbook?.userData?.id}`)}
                >
                  <Avatar className="h-12 w-12 mr-2">
                    <AvatarImage src={handbook?.userData?.profile_picture} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {handbook?.userData?.full_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                    <span>{handbook?.doctor?.position}</span>
                  <span>{handbook?.userData?.full_name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    Xuất bản: {moment(handbook?.createdAt).format("DD/MM/YYYY")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    Cập nhật: {moment(handbook?.updatedAt).format("DD/MM/YYYY")}
                  </span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>Lượt xem : {handbook?.view_count}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{"8 phút đọc"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto ">
          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
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
                        className="ml-4 list-disc text-gray-800 leading-relaxed mb-1"
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
                  {String(handbook?.content || "")}
                </ReactMarkdown>
              </div>
            </div>
          </div>
          {/* Related Articles */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Bài viết liên quan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {myHandBooks
                .filter((item) => item.handbook.id !== handbook?.id)
                .slice(0, 3)
                .map((handbook) => (
                  <Card
                    key={handbook.handbook.id}
                    className="hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
                    onClick={() =>
                      navigate(`/cam-nang-suc-khoe/${handbook.handbook.slug}`)
                    }
                  >
                    <div className="h-40 overflow-hidden">
                      <Avatar className="w-full h-full rounded-none">
                        <AvatarImage
                          src={handbook.handbook.image}
                          className="w-full h-full object-cover rounded-none"
                        />
                        <AvatarFallback className="w-full h-full flex items-center justify-center bg-gray-300 text-white text-5xl font-semibold rounded-none">
                          {handbook.handbook.title.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
                        {handbook.handbook.title}
                      </h3>
                      <div className="flex items-center text-gray-500 text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {moment(handbook?.createdAt).format("DD/MM/YYYY")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default HealthHandbookDetail;
