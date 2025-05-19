import  { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllSpecializations } from "@/api/doctor.api";
import { Link, useNavigate } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";

const ListSpecialization = () => {
  const [specializations, setSpecializations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    fetchSpecializations();
  }, []);
  const filteredData = specializations.filter((spec) => {
    return (
      spec.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const fetchSpecializations = async () => {
    try {
      let res = await getAllSpecializations();
      if (res && res.EC === 0) {
        setSpecializations(res.DT);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-6 mt-20 bg-white shadow-md rounded-lg">

      <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
        <ol className="list-reset flex">
          <li>
            <Link to="/" className="text-blue-600 hover:underline">
              <Home size={18} />
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-500">Danh sách chuyên khoa</li>
        </ol>
      </nav>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-blue-600">Chuyên khoa</h1>

          <div className="flex items-center space-x-4">
          
            {/* Ô tìm kiếm */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm chuyên khoa..."
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
        Tìm thấy {filteredData.length} chuyên khoa
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {filteredData.map((specialty) => (
          <Card
            key={specialty.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent className="p-4 flex flex-col items-center" onClick={() => navigate(`/specializations/${specialty.id}`)}>
              <div className="w-16 h-16 rounded-full bg-gray-100 mb-3 flex items-center justify-center">
                {specialty.avatar ? (
                  <img
                    src={specialty.avatar}
                    alt={specialty.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-xl">
                    {specialty.name.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="font-medium text-center">{specialty.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListSpecialization;
