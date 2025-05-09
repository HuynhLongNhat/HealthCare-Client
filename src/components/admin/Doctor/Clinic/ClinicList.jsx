import { useState, useEffect } from "react";
import { Loader, Trash, Eye, Plus, MoreHorizontal, Home } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Pagination from "@/components/Pagination";
import { deleteClinic, getAllClinics, getAllClinicsByDoctorId } from "@/api/doctor.api";
import DeleteModal from "@/components/DeleteModal";
import { getAuth } from "@/utils/getAuth";

const ClinicList = () => {
  const auth = getAuth()
  const {doctorId}  = useParams()
  const navigate = useNavigate();
  const [clinics , setClinics] = useState()
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);
  useEffect(() => {
    if (Number(auth.role) === 1) {
      fetchAllClinics(); 
    } else if (auth.role === 2) {
      fetchAllClinicsByDoctorId(); 
    }
  }, [auth.role]);
  const fetchAllClinics = async () => {
    try {
      let res = await getAllClinics();
      console.log("res", res)
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
        const filteredClinics = res.DT.filter(clinic => Number(clinic.doctor_id) === Number(doctorId));
       console.log("Filtered clinics:", filteredClinics);
        setClinics(filteredClinics); 
      }
    } catch (error) {
      console.log("Error fetching clinics:", error);
    } finally {
      setLoading(false);  
    }
  }
  
  const filteredData = clinics?.filter((clinic) => {
    const clinicName = clinic.name?.toLowerCase() || '';
    const doctorName = clinic.doctor.userData?.full_name?.toLowerCase() || '';
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
  
  const handleDelete = () =>{
    return deleteClinic(dataToDelete.id)
  }
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
    <div className="container mx-auto p-6 mt-20 bg-white shadow-md rounded-lg mb-3">
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
          <li
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/clinics")}
          >
            Danh sách cơ sở y tế
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-500">Cơ sở của tôi</li>
        </ol>
      </nav>
      <Card className="mt-5">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Danh sách cơ sở y tế
            </h1>
            <p className="text-gray-600 dark:text-gray-300 my-2">
              Quản lý thông tin các cơ sở y tế
            </p>
          </div>

        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-between items-center space-x-4">
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-md p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
              onClick={() => navigate(`/doctor/${doctorId}/clinics/create`)}
            >
              <Plus className="mr-2" size={16} />
              Thêm cơ sở y tế
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">ID</TableHead>
                  <TableHead className="text-left">Tên cơ sở y tế</TableHead>
                  <TableHead className="text-left">Bác sĩ</TableHead>
                  <TableHead className="text-center">Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((clinic) => (
                  <TableRow key={clinic.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell className="text-center font-semibold">{clinic?.id}</TableCell>
                    <TableCell className="text-left">{clinic.name}</TableCell>
                    <TableCell className="text-left">{clinic?.doctor?.DT.userData?.full_name
                    }</TableCell>

                    <TableCell className="text-center">
                      {clinic.createdAt ? moment(clinic.createdAt).format('DD/MM/YYYY') : ''}
                    </TableCell>
                    <TableCell className="text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => e.stopPropagation()}
                            className="hover:bg-gray-100 dark:hover:bg-blue-950"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          sideOffset={8}
                          className="w-36 rounded-md p-2 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 transition-all"
                        >
                          <div className="flex flex-col space-y-1">
                            <Button
                              variant="ghost"
                              className="flex items-center justify-start gap-2 px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-blue-950"
                              onClick={() => navigate(`/clinics/${clinic.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                              <span>Xem</span>
                            </Button>
                            <Button
                              variant="ghost"
                              className="flex items-center justify-start gap-2 px-2 py-1 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-blue-950"
                              onClick={() => openDeleteModal(clinic)}
                            >
                              <Trash className="h-4 w-4" />
                              <span>Xóa</span>
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showingFrom={startIndex + 1}
            showingTo={Math.min(endIndex, filteredData.length)}
            totalItems={filteredData.length}
            itemName="Cơ sở y tế"
          />
        </CardContent>
      </Card>
{dataToDelete && 
        <DeleteModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          data={dataToDelete}
          handleDelete={handleDelete}
          fetch={fetchAllClinics}
        
        />
}
    </div>
  );
};

export default ClinicList;