import { useState, useEffect } from "react";
import { Loader, Trash, Eye, Plus, MoreHorizontal, Home, Search, Building2, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";
import Pagination from "@/components/Pagination";
import { deleteClinic, getAllClinics } from "@/api/doctor.api";
import DeleteModal from "@/components/DeleteModal";
import useAuthToken from "@/utils/userAuthToken";
import ClinicStatistics from "./ClinicStatistics";

const ClinicList = () => {

  const auth = useAuthToken();
const { doctorId } = useParams();
const navigate = useNavigate();
const [clinics, setClinics] = useState();
const [loading, setLoading] = useState(true);
const [error] = useState(null);
const [searchTerm, setSearchTerm] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [dataToDelete, setDataToDelete] = useState(null);
useEffect(() => {
if (Number(auth?.role) === 1) {
fetchAllClinics();
} else if (auth?.role === 2) {
fetchAllClinicsByDoctorId();
}
}, [auth?.role]);
const fetchAllClinics = async () => {
try {
let res = await getAllClinics();
if (res && res.EC === 0) {
setClinics(res.DT);
}
} catch (error) {
console.log("Error fetching clinics:", error);
} finally {
setLoading(false);
}
};
const fetchAllClinicsByDoctorId = async () => {
try {
let res = await getAllClinics();
  if (res && res.EC === 0) {
    const filteredClinics = res.DT.filter(
      (clinic) => Number(clinic.doctor_id) === Number(doctorId)
    );
    setClinics(filteredClinics);
  }
} catch (error) {
  console.log("Error fetching clinics:", error);
} finally {
  setLoading(false);
}
};

const filteredData = clinics?.filter((clinic) => {
const clinicName = clinic.name?.toLowerCase() || "";
const doctorName = clinic.doctor.userData?.full_name?.toLowerCase() || "";
const search = searchTerm.toLowerCase();
return clinicName.includes(search) || doctorName.includes(search);
});
const endIndex = currentPage * itemsPerPage;
const startIndex = endIndex - itemsPerPage;
const currentData = filteredData?.slice(startIndex, endIndex);

const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

const openDeleteModal = (clinic) => {
setDataToDelete(clinic);
setShowDeleteModal(true);
};

const handleDelete = () => {
return deleteClinic(dataToDelete.id);
};
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader className="animate-spin text-blue-500 mx-auto mb-4" size={40} />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-500 p-6 bg-red-50 rounded-lg">
          <p className="text-xl font-semibold">Đã xảy ra lỗi</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={fadeIn}
      className="container mx-auto p-6 mt-16 mb-3"
    >
      {auth.role !== 1 && (  
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
            <span className="text-gray-700 font-medium">Cơ sở của tôi</span>
          </li>
        </ol>
      </nav>
      )}

      <Card className="bg-white shadow-lg rounded-xl border-0">

        <CardHeader className="border-b border-gray-100 p-6">
                    <ClinicStatistics clinics={clinics}/>
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Cơ sở y tế
              </h1>
              <p className="text-gray-500 mt-1">
                Quản lý và theo dõi thông tin các cơ sở y tế
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên cơ sở hoặc bác sĩ..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 py-2 w-full"
              />
            </div>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto transition-colors duration-200"
              onClick={() => navigate(`/doctor/${doctorId}/clinics/create`)}
            >
              <Plus className="mr-2" size={16} />
              Thêm cơ sở y tế
            </Button>
          </div>

          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-[80px] text-center font-semibold">ID</TableHead>
                  <TableHead className="text-left font-semibold">Tên cơ sở y tế</TableHead>
                  <TableHead className="text-left font-semibold">Bác sĩ</TableHead>
                  <TableHead className="text-center font-semibold">Ngày tạo</TableHead>
                  <TableHead className="text-right font-semibold">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((clinic) => (
                  <TableRow
                    key={clinic.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <TableCell className="text-center font-medium text-gray-600">
                      #{clinic?.id}
                    </TableCell>
                    <TableCell className="text-left font-medium">
                      {clinic.name}
                    </TableCell>
                    <TableCell className="text-left text-gray-600">
                      {clinic?.doctor?.DT.userData?.full_name}
                    </TableCell>
                    <TableCell className="text-center text-gray-600">
                      {clinic.createdAt
                        ? moment(clinic.createdAt).format("DD/MM/YYYY")
                        : ""}
                    </TableCell>
                    <TableCell className="text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-gray-100 rounded-full"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          className="w-48 p-2 rounded-lg shadow-lg border border-gray-100"
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-gray-700 hover:text-blue-600 hover:bg-blue-50 mb-1"
                            onClick={() => navigate(`/clinics/${clinic.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            <span>Xem chi tiết</span>
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => openDeleteModal(clinic)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            <span>Xóa cơ sở</span>
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showingFrom={startIndex + 1}
              showingTo={Math.min(endIndex, filteredData.length)}
              totalItems={filteredData.length}
              itemName="Cơ sở y tế"
            />
          </div>
        </CardContent>
      </Card>

      {dataToDelete && (
        <DeleteModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          data={dataToDelete}
          handleDelete={handleDelete}
          fetch={auth?.role === 1 ? fetchAllClinics : fetchAllClinicsByDoctorId}
        />
      )}
    </motion.div>
  );
};

export default ClinicList;