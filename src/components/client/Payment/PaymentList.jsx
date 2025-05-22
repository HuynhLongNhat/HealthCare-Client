import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Home,
  Search,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { getAllMyPayment } from "@/api/payment.api";
import { formatMoney } from "@/utils/helpers";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/Pagination";
import useAuthToken from "@/utils/userAuthToken";
import PaymentStatistics from "./PaymentStatistics ";

const PaymentList = () => {
  const auth = useAuthToken();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [myPayments, setMyPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  useEffect(() => {
    fetchAllMyPayment();
  }, [userId]);

  const fetchAllMyPayment = async () => {
    try {
      setIsLoading(true);
      const res = await getAllMyPayment(userId);
      if (res.EC === 0) {
        setMyPayments(res.DT);
      } else {
        setError(res.EM);
      }
    } catch (err) {
      setError("Failed to fetch payment data");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPayments = myPayments
  .filter((payment) => {
    const paymentDate = new Date(payment.paymentData?.payment_date);
    const paymentDateOnly = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), paymentDate.getDate());

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());

    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYearStart = new Date(now.getFullYear(), 0, 1);

    switch (dateFilter) {
      case "today":
        return paymentDateOnly.getTime() === today.getTime();
      case "yesterday":
        return paymentDateOnly.getTime() === yesterday.getTime();
      case "week":
        return paymentDate >= thisWeekStart;
      case "month":
        return paymentDate >= thisMonthStart;
      case "year":
        return paymentDate >= thisYearStart;
      default:
        return true; // 'all', 'newest', 'oldest' => không lọc ngày
    }
  })
  .sort((a, b) => {
    const dateA = new Date(a.paymentData?.payment_date);
    const dateB = new Date(b.paymentData?.payment_date);

    if (dateFilter === "oldest") return dateA - dateB;
    return dateB - dateA; // mặc định newest và các loại filter như today/week/month...
  });



  const handlePaymentClick = (paymentId) => {
    navigate(`/${userId}/lich-su-thanh-toan/${paymentId}`);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("all");
  };

  const endIndex = currentPage * dataPerPage;
  const startIndex = endIndex - dataPerPage;
  const currentData = filteredPayments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredPayments.length / dataPerPage);

  return (
    <div className="container mx-auto p-4 md:p-6 mt-16 bg-white rounded-lg">
      {auth?.role !== 1 && (
        <nav className="text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <Link
                to="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <Home size={16} className="mr-1" />
                Trang chủ
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-1 text-gray-400">/</span>
                <span className="ml-1 text-gray-500">Lịch sử thanh toán</span>
              </div>
            </li>
          </ol>
        </nav>
      )}
      {auth && auth.role !== 3 && (
        <PaymentStatistics userId={userId} />
        
    )}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-blue-700">
            Lịch sử thanh toán
          </h1>
        </div>

        {/* Filters */}
        <Card className=" border-0 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm thanh toán..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status filter */}
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Lọc theo trạng thái" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="success">Thành công</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                  <SelectItem value="pending">Đang chờ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date filter */}

            {/* Date filter */}
            <div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Lọc theo ngày" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ngày</SelectItem>
                  <SelectItem value="newest">Mới nhất trước</SelectItem>
                  <SelectItem value="oldest">Cũ nhất trước</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="yesterday">Hôm qua</SelectItem>
                  <SelectItem value="week">Tuần này</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="year">Năm này</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset button */}
            <div className="flex items-center justify-start md:justify-end">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full md:w-auto"
              >
                Đặt lại bộ lọc
              </Button>
            </div>
          </div>
        </Card>

        {/* Payment Table */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-semibold text-gray-700">
                  Mã thanh toán
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Người thanh toán
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Nội dung
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Ngày thanh toán
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">
                  Giá tiền
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Trạng thái
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[180px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px] ml-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                // Error state
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center space-y-2 text-red-500">
                      <XCircle className="h-8 w-8" />
                      <p>{error}</p>
                      <Button variant="outline" onClick={fetchAllMyPayment}>
                        Thử lại
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentData.length > 0 ? (
                // Data state
                currentData.map((payment) => (
                  <TableRow
                    key={payment.paymentData.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handlePaymentClick(payment.paymentData.id)}
                  >
                    <TableCell className="font-medium text-blue-600">
                      #HD-{payment.paymentData.id}
                    </TableCell>
                    <TableCell>
                      {payment.appointmentData?.patientData?.full_name || "N/A"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {payment.paymentData.transfer_content}
                    </TableCell>
                    <TableCell>
                      {payment.paymentData.payment_date
                        ? format(
                            parseISO(payment.paymentData.payment_date),
                            "dd/MM/yyyy HH:mm"
                          )
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatMoney(payment.paymentData.amount)}
                    </TableCell>
                    <TableCell>
                      {payment.paymentData.status?.status_name ===
                        "SUCCESS" && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Thành công
                        </Badge>
                      )}
                      {payment.paymentData.status?.status_name === "CANCELLED" && (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                          <XCircle className="h-3 w-3 mr-1" />
                         Hủy bỏ
                        </Badge>
                      )}
                      {payment.paymentData.status?.status_name ===
                        "PENDING" && (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          <Clock className="h-3 w-3 mr-1" />
                          Đang chờ
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Empty state
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Search className="h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">
                        Không tìm thấy thanh toán nào
                      </p>
                      <Button
                        variant="ghost"
                        onClick={resetFilters}
                        className="text-blue-600"
                      >
                        Xóa bộ lọc
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {filteredPayments.length > 0 && (
            <div className="mt-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showingFrom={startIndex + 1}
                showingTo={Math.min(endIndex, filteredPayments.length)}
                totalItems={filteredPayments.length}
                itemName="Đơn thanh toán"
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PaymentList;
