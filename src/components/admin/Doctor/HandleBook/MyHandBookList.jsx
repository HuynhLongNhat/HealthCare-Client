import { useState, useEffect } from "react";
import {
  Trash,
  Eye,
  Plus,
  MoreHorizontal,
  Home,
  ChevronRight,
} from "lucide-react";
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
import Pagination from "@/components/Pagination";
import {
  deleteHeathHandBook,
  getAllHealthHandBookByDoctorId,
} from "@/api/doctor.api";
import DeleteModal from "@/components/DeleteModal";

const MyHandBookList = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [error] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);
  const [myHandBooks, setMyHandBooks] = useState();

  useEffect(() => {
    fetchAllMyHandbook();
  }, []);

  const fetchAllMyHandbook = async () => {
    const res = await getAllHealthHandBookByDoctorId(doctorId);
    if (res.EC === 0) {
      setMyHandBooks(res.DT);
    }
  };

  const filteredData = myHandBooks?.filter((handbook) => {
    const handbookName = handbook.handbook.title?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return handbookName.includes(search);
  });
  const endIndex = currentPage * itemsPerPage;
  const startIndex = endIndex - itemsPerPage;
  const currentData = filteredData?.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const openDeleteModal = (handbook) => {
    setDataToDelete(handbook);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    return deleteHeathHandBook(dataToDelete.handbook.id);
  };

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6 mt-20 bg-white shadow-md rounded-lg mb-3">
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
            <span className="text-gray-700 font-medium">Bài viết của tôi</span>
          </li>
        </ol>
      </nav>

      <Card className="mt-5">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Danh sách bài viết
            </h1>
            <p className="text-gray-600 dark:text-gray-300 my-2">
              Quản lý thông tin các bài viết của tôi
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
              onClick={() => navigate(`/doctor/${doctorId}/handbooks/create`)}
            >
              <Plus className="mr-2" size={16} />
              Thêm bài viết
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">ID</TableHead>
                  <TableHead className="text-left">Tên bài viết</TableHead>
                  <TableHead className="text-left">Tác giả</TableHead>
                  <TableHead className="text-center">Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData?.map((handbook) => (
                  <TableRow
                    key={handbook.handbook?.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <TableCell className="text-center font-semibold">
                      {handbook?.handbook.id}
                    </TableCell>
                    <TableCell
                      className="text-left cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/cam-nang-suc-khoe/${handbook?.handbook.slug}`
                        )
                      }
                    >
                      {handbook?.handbook?.title}
                    </TableCell>
                    <TableCell className="text-left">
                      {handbook?.userData?.full_name}
                    </TableCell>

                    <TableCell className="text-center">
                      {handbook.handbook.createdAt
                        ? moment(handbook.handbook.createdAt).format(
                            "DD/MM/YYYY"
                          )
                        : ""}
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
                              className="flex items-center justify-start gap-2 px-2 py-1 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-blue-950"
                              onClick={() => openDeleteModal(handbook)}
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
            showingTo={Math.min(endIndex, filteredData?.length)}
            totalItems={filteredData?.length}
            itemName="Bài viết của tôi"
          />
        </CardContent>
      </Card>
      {dataToDelete && (
        <DeleteModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          data={dataToDelete}
          handleDelete={handleDelete}
          fetch={fetchAllMyHandbook}
        />
      )}
    </div>
  );
};

export default MyHandBookList;
