import { getOutStandinglHealthHandBook } from "@/api/doctor.api";
import { Calendar, TrendingUp, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const OutStandingHealthHandBook = () => {
  const navigate = useNavigate();
  const [handbooks, setHandbooks] = useState();
  useEffect(() => {
    fetchOutStatingHealthHandBook();
  }, []);
  const fetchOutStatingHealthHandBook = async () => {
    const res = await getOutStandinglHealthHandBook();
    if (res.EC === 0) {
      setHandbooks(res.DT);
    }
  };
  return (
    <section className="mb-16">
      <div className="flex items-center mb-8">
        <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-blue-600">Bài viết nổi bật</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Featured Article */}
        {handbooks?.length > 0 && (
          <Card
            className="lg:col-span-8 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:translate-y-[-5px]"
            onClick={() =>
              navigate(`/cam-nang-suc-khoe/${handbooks[0].handbook.slug}`)
            }
          >
            <div className="h-80 overflow-hidden relative">
              <img
                src={
                  handbooks[0].handbook.image ||
                  "https://placehold.co/800x400/e2f4ff/0084d6?text=Featured+Article"
                }
                alt={handbooks[0].handbook.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {handbooks[0].handbook.title}
                </h3>             
                <div className="flex justify-between w-full text-white/80">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={handbooks[0].doctor.DT.userData.profile_picture}
                      />
                      <AvatarFallback className="bg-blue-500 text-white">
                        {handbooks[0].doctor.DT.userData.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{handbooks[0].doctor.DT.userData.full_name}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    <span>
                      {moment(handbooks[0].handbook.createdAt).format(
                        "DD/MM/YYYY"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Secondary Featured Articles */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {handbooks?.slice(1).map((handbook) => (
            <Card
              key={handbook.handbook.id}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 flex cursor-pointer hover:translate-y-[-3px]"
              onClick={() =>
                navigate(`/cam-nang-suc-khoe/${handbook.handbook.slug}`)
              }
            >
              <div className="w-1/3 overflow-hidden">
                <img
                  src={
                    handbook.handbook.image ||
                    "https://placehold.co/200x200/e2f4ff/0084d6?text=Article"
                  }
                  alt={handbook.handbook.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="w-2/3 p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                  {handbook.handbook.title}
                </h3>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar size={12} className="mr-1" />
                  <span>
                    {" "}
                    {moment(handbooks[0].handbook.createdAt).format(
                      "DD/MM/YYYY"
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutStandingHealthHandBook;
