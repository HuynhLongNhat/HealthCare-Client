import { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Home,
  Clock1,
  BadgeCheck,
  CheckCircle,
  X,
  Search,
  CircleSlash,
  Filter,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getAllMyBooking } from "@/api/appointment.api";
import { Badge } from "../ui/badge";
import Pagination from "../Pagination";
import { Input } from "../ui/input";
import AppointmentCard from "../admin/Doctor/Appointment/AppointmentCard";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import useAuthToken from "@/utils/userAuthToken";

const statusConfig = {
  1: {
    text: "Chờ xác nhận",
    variant: "warning",
    icon: <Clock1 className="h-4 w-4 mr-1 text-yellow-500" />,
  },
  2: {
    text: "Đã xác nhận",
    variant: "success",
    icon: <BadgeCheck className="h-4 w-4 mr-1 text-green-600" />,
  },
  3: {
    text: "Đã hủy",
    variant: "destructive",
    icon: <X className="h-4 w-4 mr-1 text-red-500" />,
  },
  4: {
    text: "Đã từ chối",
    variant: "destructive",
    icon: <CircleSlash className="h-4 w-4 mr-1 text-gray-500" />,
  },
  5: {
    text: "Đã thanh toán",
    variant: "success",
    icon: <CheckCircle className="h-4 w-4 mr-1 text-blue-600" />,
  },
};

const MyBooking = () => {
  const auth = useAuthToken();
  const { doctorId, userId } = useParams();
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [selectedStatuses, setSelectedStatuses] = useState(
    Object.keys(statusConfig).map(Number)
  ); // Mặc định chọn tất cả

  useEffect(() => {
    fetchAllMyBooking();
  }, [auth]);

  useEffect(() => {
    // Reset về trang 1 khi bộ lọc thay đổi
    setCurrentPage(1);
  }, [selectedStatuses, searchTerm, dateFilter]);

  const fetchAllMyBooking = async () => {
    setLoading(true);
    try {
      const id = auth?.role === 2 ? doctorId : auth?.role === 3 ? userId : null;
      if (!id) {
        console.warn("Không có ID phù hợp để fetch booking.");
        return;
      }

      const res = await getAllMyBooking(id);
      if (res.EC === 0) {
        setMyBookings(res.DT);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterByDate = (appointments, filterType) => {
    const now = new Date();

    // Mốc bắt đầu ngày hôm nay 00:00 và ngày mai 00:00
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfToday.getDate() + 1);

    switch (filterType) {
      case "today":
        return appointments.filter((apt) => {
          const aptDate = new Date(apt.appointment.booking_time);
          return aptDate >= startOfToday && aptDate < startOfTomorrow;
        });

      case "this_week": {
        // Mốc đầu tuần (Chủ nhật) và cuối tuần (Thứ bảy)
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7); // exclusive

        return appointments.filter((apt) => {
          const aptDate = new Date(apt.appointment.booking_time);
          return aptDate >= startOfWeek && aptDate < endOfWeek;
        });
      }

      case "this_month": {
        // Mốc đầu tháng và đầu tháng kế tiếp
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfNextMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          1
        );

        return appointments.filter((apt) => {
          const aptDate = new Date(apt.appointment.booking_time);
          return aptDate >= startOfMonth && aptDate < startOfNextMonth;
        });
      }

      case "this_year": {
        // Mốc đầu năm và đầu năm kế tiếp
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const startOfNextYear = new Date(now.getFullYear() + 1, 0, 1);

        return appointments.filter((apt) => {
          const aptDate = new Date(apt.appointment.booking_time);
          return aptDate >= startOfYear && aptDate < startOfNextYear;
        });
      }

      case "newest":
        // Đổi thứ tự mới -> cũ
        return [...appointments].sort(
          (a, b) =>
            new Date(b.appointment.booking_time) -
            new Date(a.appointment.booking_time)
        );

      case "oldest":
        // Đổi thứ tự cũ -> mới
        return [...appointments].sort(
          (a, b) =>
            new Date(a.appointment.booking_time) -
            new Date(b.appointment.booking_time)
        );

      default:
        return appointments;
    }
  };

  const toggleStatusFilter = (statusId) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  const selectAllStatuses = () => {
    setSelectedStatuses(Object.keys(statusConfig).map(Number));
  };

  const clearAllStatuses = () => {
    setSelectedStatuses([]);
  };

  const resetAllFilters = () => {
    setSearchTerm("");
    selectAllStatuses();
    setDateFilter("all");
  };

  const getStatusBadge = (statusId) => {
    const status = statusConfig[statusId] || statusConfig[1];
    return (
      <Badge
        className={`px-3 py-1.5 text-sm flex items-center gap-1.5
          ${
            status.variant === "success"
              ? "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800"
              : status.variant === "warning"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
              : "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
          }`}
      >
        {status.icon}
        {status.text}
      </Badge>
    );
  };

  // Sử dụng useMemo để cải thiện hiệu suất
  const filteredData = useMemo(() => {
    // 1. Lọc theo search term + status
    let result = myBookings.filter((booking) => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        booking.doctorData?.userData?.full_name
          .toLowerCase()
          .includes(lowerSearch) ||
        booking.patientData?.full_name.toLowerCase().includes(lowerSearch) ||
        booking.clinicData?.name.toLowerCase().includes(lowerSearch);

      const matchesStatus = selectedStatuses.includes(
        booking.appointment.status_id
      );

      return matchesSearch && matchesStatus;
    });

    // 2. Lọc và sắp xếp theo ngày
    return filterByDate(result, dateFilter);
  }, [myBookings, searchTerm, selectedStatuses, dateFilter]);

  // Count appointments by status - dùng useMemo để tránh tính toán lại mỗi khi render
  const statusCounts = useMemo(() => {
    const counts = {};
    myBookings.forEach((booking) => {
      const statusId = booking.appointment.status_id;
      counts[statusId] = (counts[statusId] || 0) + 1;
    });
    return counts;
  }, [myBookings]);

  // Pagination logic
  const endIndex = currentPage * itemsPerPage;
  const startIndex = endIndex - itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) {
    return (
      <div className="container mx-auto p-6 mt-20 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`container mx-auto p-6 bg-white shadow-md rounded-lg ${
        auth.role === 2 ? "" : "mt-20"
      }`}
    >
      {auth && auth.role === 3 && (
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
                Lịch khám của tôi
              </span>
            </li>
          </ol>
        </nav>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          Lịch khám của tôi 
        </h1>
      </div>

      {myBookings?.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Chưa có lịch khám nào được đặt
          </h3>
          {auth && auth?.role === 3 && (
            <>
              <p className="text-gray-500 mb-6">
                Bạn chưa có lịch khám bệnh nào. Hãy đặt lịch với bác sĩ ngay!
              </p>
              <Button variant="info" onClick={() => navigate("/doctors")}>
                <Calendar className="h-4 w-4 mr-2" />
                Đặt lịch khám ngay
              </Button>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Filter and search section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên bác sĩ hoặc phòng khám..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                {/* Status filter dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      Trạng thái
                      <Badge className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-800 hover:bg-blue-100">
                        {selectedStatuses.length}
                      </Badge>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <div className="px-2 py-1.5">
                      <div className="flex justify-between text-xs">
                        <button
                          onClick={selectAllStatuses}
                          className="text-blue-600 hover:underline"
                        >
                          Chọn tất cả
                        </button>
                        <button
                          onClick={clearAllStatuses}
                          className="text-gray-500 hover:underline"
                        >
                          Bỏ chọn tất cả
                        </button>
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    {Object.entries(statusConfig).map(([id, config]) => (
                      <DropdownMenuCheckboxItem
                        key={id}
                        checked={selectedStatuses.includes(Number(id))}
                        onCheckedChange={() => toggleStatusFilter(Number(id))}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          {config.icon}
                          <span className="ml-2">{config.text}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className="ml-1 px-1.5 py-0.5 bg-gray-100"
                        >
                          {statusCounts[Number(id)] || 0}
                        </Badge>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Date filter */}
                <div className="w-full md:w-48">
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Lọc theo ngày" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả ngày</SelectItem>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                      <SelectItem value="today">Hôm nay</SelectItem>
                      <SelectItem value="this_week">Tuần này</SelectItem>
                      <SelectItem value="this_month">Tháng này</SelectItem>
                      <SelectItem value="this_year">Năm này</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Active filters display */}
            {((selectedStatuses.length > 0 &&
              selectedStatuses.length < Object.keys(statusConfig).length) ||
              searchTerm ||
              dateFilter !== "all") && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">Đang lọc:</span>

                {/* Status filters */}
                {selectedStatuses.length > 0 &&
                  selectedStatuses.length < Object.keys(statusConfig).length &&
                  selectedStatuses.map((statusId) => (
                    <Badge
                      key={statusId}
                      variant="secondary"
                      className="flex items-center gap-1 pl-2 pr-1.5 py-1"
                    >
                      {statusConfig[statusId].icon}
                      {statusConfig[statusId].text}
                      <button
                        onClick={() => toggleStatusFilter(statusId)}
                        className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}

                {/* Date filter */}
                {dateFilter !== "all" && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 pl-2 pr-1.5 py-1"
                  >
                    <Calendar className="h-3 w-3" />
                    {dateFilter === "newest"
                      ? "Mới nhất"
                      : dateFilter === "oldest"
                      ? "Cũ nhất"
                      : dateFilter === "today"
                      ? "Hôm nay"
                      : dateFilter === "this_week"
                      ? "Tuần này"
                      : dateFilter === "this_month"
                      ? "Tháng này"
                      : dateFilter === "this_year"
                      ? "Năm này"
                      : ""}
                    <button
                      onClick={() => setDateFilter("all")}
                      className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {/* Search term */}
                {searchTerm && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 pl-2 pr-1.5 py-1"
                  >
                    <Search className="h-3 w-3" />
                    {searchTerm}
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetAllFilters}
                  className="text-xs text-gray-500 hover:text-gray-700 p-1 h-auto"
                >
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            )}
          </div>

          {/* Results count and summary */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">
              Tìm thấy {filteredData.length} lịch khám
              {searchTerm && <span> cho tìm kiếm "{searchTerm}"</span>}
            </p>

            {filteredData.length === 0 && (
              <Button variant="outline" size="sm" onClick={resetAllFilters}>
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {filteredData.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Không tìm thấy lịch khám nào
              </h3>
              <p className="text-gray-500 mb-4">
                Không có lịch khám nào phù hợp với bộ lọc hiện tại.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentData?.map((booking) => (
                <AppointmentCard
                  key={booking?.appointment?.id}
                  appointment={booking}
                  getStatusBadge={getStatusBadge}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showingFrom={startIndex + 1}
              showingTo={Math.min(endIndex, filteredData.length)}
              totalItems={filteredData.length}
              itemName="Lịch khám"
            />
          )}
        </>
      )}
    </div>
  );
};

export default MyBooking;
