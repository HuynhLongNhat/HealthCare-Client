import { useState, useEffect } from "react";
import { Loader, Trash, Eye, Plus, MoreHorizontal } from "lucide-react";
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

import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Pagination from "@/components/Pagination";
import { deleteSpecializations, getAllSpecializations } from "@/api/doctor.api";
import DeleteModal from "@/components/DeleteModal";
import SpecializationStatistic from "./SpecializationStatistic";

const SpecializationList = () => {
  const navigate = useNavigate();
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      let res = await getAllSpecializations();
      if (res && res.EC === 0) {
        setSpecializations(res.DT);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const filteredData = specializations.filter((spec) => {
    return (
      spec.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  const endIndex = currentPage * itemsPerPage;
  const startIndex = endIndex - itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleDeleteSpecialization = (spec) => {
    setDataToDelete(spec);
    setShowDeleteModal(true);
  };

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

   const handleDelete = () =>{
      return deleteSpecializations(dataToDelete.id)
    }
  return (
    <div className="p-4 mt-20">
      <SpecializationStatistic/>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Danh sách chuyên khoa
            </h1>
            <p className="text-gray-600 dark:text-gray-300 my-2">
              Quản lý thông tin các chuyên khoa y tế
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
              onClick={() => navigate("/doctor/specializations/create")}
            >
              <Plus className="mr-2" size={16} />
              Thêm chuyên khoa
            </Button>
          </div>



          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">ID</TableHead>
                  <TableHead className="text-left">Tên chuyên khoa</TableHead>
                  <TableHead className="text-center">Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((spec) => (
                  <TableRow key={spec.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell className="text-center font-semibold">{spec.id}</TableCell>
                    <TableCell className="text-left">{spec.name}</TableCell>
                    <TableCell className="text-center">
                      {spec.createdAt ? moment(spec.createdAt).format('DD/MM/YYYY') : ''}
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
                              onClick={() => navigate(`/doctor/specializations/${spec.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                              <span>Xem</span>
                            </Button>
                            <Button
                              variant="ghost"
                              className="flex items-center justify-start gap-2 px-2 py-1 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-blue-950"
                              onClick={() => handleDeleteSpecialization(spec)}
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
            itemName="Chuyên khoa"
          />
        </CardContent>
      </Card>

      {dataToDelete && (
        <DeleteModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          data={dataToDelete}
          handleDelete={handleDelete}
          fetch={fetchSpecializations}
        />
      )}
    </div>
  );
};

export default SpecializationList;