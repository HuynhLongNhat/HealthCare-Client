import { useState, useEffect, useMemo } from "react";
import {
  BadgeCheck,
  CheckCircle,
  CircleSlash,
  Clock1,
  Loader,
  Search,
  X,
  Calendar,
  Filter,
  User,
  Stethoscope,
  CalendarClock,
  Clock,
  AlertCircle,
  MapPin,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Pagination from "@/components/Pagination";
import { getAllMyBooking } from "@/api/appointment.api";
import useAuthToken from "@/utils/userAuthToken";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import AppointmentStatistic from "./AppointmentStatistic";

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

const AppointmentList = () => {
  const auth = useAuthToken();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [appointments, setAppointments] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState(
    Object.keys(statusConfig).map(Number)
  );
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    fetchAllAppointments();
  }, [auth?.userId]);

  const fetchAllAppointments = async () => {
    setLoading(true);
    try {
      const res = await getAllMyBooking(auth?.userId);
      if (res.EC === 0) {
        setAppointments(res.DT);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterByDate = (appointments, filterType) => {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    switch (filterType) {
      case "today":
        return appointments.filter((apt) => {
          const aptDate = new Date(apt.appointment.booking_time);
          return aptDate >= today && aptDate < tomorrow;
        });

      case "this_week": {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        return appointments.filter((apt) => {
          const aptDate = new Date(apt.appointment.booking_time);
          return aptDate >= startOfWeek && aptDate < endOfWeek;
        });
      }

      case "this_month": {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        return appointments.filter((apt) => {
          const aptDate = new Date(apt.appointment.booking_time);
          return aptDate >= startOfMonth && aptDate < startOfNextMonth;
        });
      }

      case "this_year": {
        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const startOfNextYear = new Date(today.getFullYear() + 1, 0, 1);
        return appointments.filter((apt) => {
          const aptDate = new Date(apt.appointment.booking_time);
          return aptDate >= startOfYear && aptDate < startOfNextYear;
        });
      }

      case "newest":
        return [...appointments].sort((a, b) => 
          new Date(b.appointment.booking_time) - new Date(a.appointment.booking_time)
        );

      case "oldest":
        return [...appointments].sort((a, b) => 
          new Date(a.appointment.booking_time) - new Date(b.appointment.booking_time)
        );

      default:
        return appointments;
    }
  };

  const filteredData = useMemo(() => {
    let result = appointments.filter(booking => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        booking.doctorData?.userData?.full_name.toLowerCase().includes(lowerSearch) ||
        booking.patientData?.full_name.toLowerCase().includes(lowerSearch) ||
        booking.clinicData?.name.toLowerCase().includes(lowerSearch) ||
        booking.appointment.id.toString().includes(searchTerm);

      const matchesStatus = selectedStatuses.includes(
        booking.appointment.status_id
      );

      return matchesSearch && matchesStatus;
    });

    return filterByDate(result, dateFilter);
  }, [appointments, searchTerm, selectedStatuses, dateFilter]);

  const statusCounts = useMemo(() => {
    const counts = {};
    appointments.forEach((booking) => {
      const statusId = booking.appointment.status_id;
      counts[statusId] = (counts[statusId] || 0) + 1;
    });
    return counts;
  }, [appointments]);

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
    setCurrentPage(1);
  };

  const endIndex = currentPage * itemsPerPage;
  const startIndex = endIndex - itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getStatusBadge = (statusId) => {
    const status = statusConfig[statusId] || statusConfig[1];
    return (
      <Badge variant={status.variant} className="flex items-center gap-1">
        {status.icon}
        {status.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 mt-10">
      <AppointmentStatistic appointments={appointments} />
      <Card className="shadow-lg mt-10">
        <CardHeader className="  rounded-t-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className=" text-2xl font-bold">
                Quản lý lịch khám bệnh
              </CardTitle>
              <CardDescription className="">
                Tổng hợp và quản lý tất cả lịch khám bệnh trong hệ thống
              </CardDescription>
            </div>
           
          </div>
        </CardHeader>
     
        <CardContent className="p-6">
          {/* Filter Section */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên, ID, phòng khám..."
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
                    <DropdownMenuLabel className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Lọc trạng thái
                    </DropdownMenuLabel>
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
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[180px]">
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

            {/* Active filters display */}
            {(selectedStatuses.length > 0 && selectedStatuses.length < Object.keys(statusConfig).length || 
             searchTerm || dateFilter !== "all") && (
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Đang lọc:</span>
                
                {/* Status filters */}
                {selectedStatuses.length > 0 && selectedStatuses.length < Object.keys(statusConfig).length && 
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
                  ))
                }
                
                {/* Date filter */}
                {dateFilter !== "all" && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 pl-2 pr-1.5 py-1"
                  >
                    <Calendar className="h-3 w-3" />
                    {dateFilter === "newest" ? "Mới nhất" : 
                     dateFilter === "oldest" ? "Cũ nhất" :
                     dateFilter === "today" ? "Hôm nay" :
                     dateFilter === "this_week" ? "Tuần này" :
                     dateFilter === "this_month" ? "Tháng này" :
                     dateFilter === "this_year" ? "Năm này" : ""}
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
                    {searchTerm.length > 15 ? `${searchTerm.substring(0, 15)}...` : searchTerm}
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
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-1 h-auto"
                >
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Tổng lịch hẹn</p>
                  <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    {appointments.length}
                  </h3>
                </div>
                <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-full">
                  <CalendarClock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border border-green-100 dark:border-green-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400">Đã xác nhận</p>
                  <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {statusCounts[2] || 0}
                  </h3>
                </div>
                <div className="bg-green-100 dark:bg-green-800 p-3 rounded-full">
                  <BadgeCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-100 dark:border-yellow-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Chờ xác nhận</p>
                  <h3 className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                    {statusCounts[1] || 0}
                  </h3>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-800 p-3 rounded-full">
                  <Clock1 className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg border border-red-100 dark:border-red-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400">Đã hủy/từ chối</p>
                  <h3 className="text-2xl font-bold text-red-800 dark:text-red-200">
                    {(statusCounts[3] || 0) + (statusCounts[4] || 0)}
                  </h3>
                </div>
                <div className="bg-red-100 dark:bg-red-800 p-3 rounded-full">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị {Math.min(startIndex + 1, filteredData.length)}-{Math.min(endIndex, filteredData.length)} trên tổng số {filteredData.length} kết quả
              {searchTerm && (
                <span> cho tìm kiếm "{searchTerm}"</span>
              )}
            </p>
            
            {filteredData.length === 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetAllFilters}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>

          {/* Appointment Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableHead className="w-[80px] text-center">ID</TableHead>
                  <TableHead className="text-left">Bác sĩ</TableHead>
                  <TableHead className="text-left">Bệnh nhân</TableHead>
                  <TableHead className="text-left">Phòng khám</TableHead>
                  <TableHead className="text-center">Thời gian</TableHead>
                  <TableHead className="text-center w-[120px]">Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length > 0 ? (
                  currentData.map((booking) => (
                    <TableRow
                      key={booking.appointment.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <TableCell className="text-center font-medium">
                        #{booking.appointment.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                            <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium">{booking.doctorData.userData.full_name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {booking.doctorData.doctor.specialization.name}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                            <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium">{booking.patientData.full_name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {booking.patientData.phone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                            <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">{booking.clinicData.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {booking.clinicData.address}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center">
                          <p className="font-medium">
                            {moment(booking.scheduleData?.schedule?.date || booking.appointment.booking_time).format("DD/MM/YYYY")}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {booking.scheduleData?.schedule?.time_start} - {booking.scheduleData?.schedule?.time_end}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(booking.appointment.status_id)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/${auth.userId}/appointment/${booking.appointment.id}`)}
                        >
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="h-10 w-10 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Không tìm thấy lịch khám nào phù hợp
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                        </p>
                        <Button variant="outline" onClick={resetAllFilters}>
                          Xóa bộ lọc
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showingFrom={Math.min(startIndex + 1, filteredData.length)}
                showingTo={Math.min(endIndex, filteredData.length)}
                totalItems={filteredData.length}
                itemName="lịch khám"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentList;