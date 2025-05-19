import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  X,
  BadgeCheck,
  Clock1,
  CircleSlash,
  Stethoscope,
  TimerOff,
  CalendarCheck,
  Ban,
  Calendar,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuthToken from "@/utils/userAuthToken";
import { getAllMyBooking } from "@/api/appointment.api";
import { useParams } from "react-router-dom";
import AppointmentCard from "./AppointmentCard";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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

const AppointmentManager = () => {
  const { userId } = useParams();
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState(
    Object.keys(statusConfig).map(Number)
  );
  const auth = useAuthToken();

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await getAllMyBooking(userId);
      if (res.EC === 0) {
        setAppointments(res.DT);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
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
      const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

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
      return [...appointments].sort((a, b) => 
        new Date(b.appointment.booking_time) - new Date(a.appointment.booking_time)
      );

    case "oldest":
      // Đổi thứ tự cũ -> mới
      return [...appointments].sort((a, b) => 
        new Date(a.appointment.booking_time) - new Date(b.appointment.booking_time)
      );

    default:
      return appointments;
  }
};

  // Count appointments by status
  const statusCounts = useMemo(() => {
    const counts = {};
    appointments.forEach((booking) => {
      const statusId = booking.appointment.status_id;
      counts[statusId] = (counts[statusId] || 0) + 1;
    });
    return counts;
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    // Lọc theo search term
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.doctorData?.userData?.full_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          apt.patientData?.full_name?.includes(searchTerm) ||
          apt.patientData?.phone?.includes(searchTerm) ||
          apt.patientData?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo status
    if (selectedStatuses.length > 0 && selectedStatuses.length < Object.keys(statusConfig).length) {
      filtered = filtered.filter(
        (apt) => selectedStatuses.includes(apt.appointment.status_id)
      );
    }

    // Lọc theo ngày
    filtered = filterByDate(filtered, dateFilter);

    return filtered;
  }, [appointments, searchTerm, selectedStatuses, dateFilter]);

  const toggleStatusFilter = (statusId) => {
    setSelectedStatuses((prev) =>
      prev.includes(statusId)
        ? prev.filter((id) => id !== statusId)
        : [...prev, statusId]
    );
  };

  const selectAllStatuses = () => {
    setSelectedStatuses(Object.keys(statusConfig).map(Number))
  };

  const clearAllStatuses = () => {
    setSelectedStatuses([]);
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

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 mt-20 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6  mt-5 bg-white shadow-md rounded-lg">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center ml-2 gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-blue-600">
            Quản lý lịch khám bệnh
          </h2>
        </div>

        {/* Filter section */}
        <div className="bg-gray-50 p-2 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
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
          {selectedStatuses.length > 0 && selectedStatuses.length < Object.keys(statusConfig).length && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-sm text-gray-500">Đang lọc:</span>
              {selectedStatuses.map((statusId) => (
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
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAllStatuses}
                className="text-xs text-gray-500 hover:text-gray-700 p-1 h-auto"
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}
        </div>

        {/* Results count and summary */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            Tìm thấy {filteredAppointments.length} lịch khám
            {searchTerm && (
              <span> cho tìm kiếm "{searchTerm}"</span>
            )}
          </p>
          
          {filteredAppointments.length === 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchTerm("");
                selectAllStatuses();
                setDateFilter("all");
              }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>

        {/* Tabs navigation */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="1">Chờ xác nhận</TabsTrigger>
            <TabsTrigger value="2">Đã xác nhận</TabsTrigger>
            <TabsTrigger value="3">Đã hủy</TabsTrigger>
            <TabsTrigger value="4">Từ chối</TabsTrigger>
            <TabsTrigger value="5">Hoàn thành</TabsTrigger>
          </TabsList>

          {/* Tabs content */}
          {Object.entries({
            all: filteredAppointments,
            1: filteredAppointments.filter(apt => apt.appointment.status_id === 1),
            2: filteredAppointments.filter(apt => apt.appointment.status_id === 2),
            3: filteredAppointments.filter(apt => apt.appointment.status_id === 3),
            4: filteredAppointments.filter(apt => apt.appointment.status_id === 4),
            5: filteredAppointments.filter(apt => apt.appointment.status_id === 5),
          }).map(([tabValue, tabAppointments]) => (
            <TabsContent key={tabValue} value={tabValue} className="space-y-4 mt-4">
              {tabAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className={`p-4 rounded-full mb-4 ${
                    tabValue === "1" ? "bg-yellow-100 text-yellow-600" :
                    tabValue === "2" ? "bg-green-100 text-green-600" :
                    tabValue === "3" ? "bg-red-100 text-red-600" :
                    tabValue === "4" ? "bg-rose-100 text-rose-600" :
                    tabValue === "5" ? "bg-emerald-100 text-emerald-600" :
                    "bg-blue-100 text-blue-600"
                  }`}>
                    {tabValue === "1" ? <TimerOff className="h-8 w-8" /> :
                     tabValue === "2" ? <CalendarCheck className="h-8 w-8" /> :
                     tabValue === "3" ? <Ban className="h-8 w-8" /> :
                     tabValue === "4" ? <XCircle className="h-8 w-8" /> :
                     tabValue === "5" ? <CheckCircle className="h-8 w-8" /> :
                     <Stethoscope className="h-8 w-8" />}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {tabValue === "1" ? "Không có lịch hẹn đang chờ xác nhận" :
                     tabValue === "2" ? "Không có lịch hẹn đã xác nhận" :
                     tabValue === "3" ? "Không có lịch hẹn đã hủy" :
                     tabValue === "4" ? "Không có lịch hẹn đã từ chối" :
                     tabValue === "5" ? "Không có lịch hẹn đã thanh toán" :
                     "Không có lịch hẹn nào"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {tabValue === "1" ? "Bệnh nhân chưa đặt lịch hẹn mới" :
                     tabValue === "2" ? "Bạn chưa xác nhận lịch hẹn nào của bệnh nhân" :
                     tabValue === "3" ? "Chưa có bệnh nhân nào đã hủy lịch hẹn" :
                     tabValue === "4" ? "Bạn chưa từ chối lịch hẹn nào của bệnh nhân" :
                     tabValue === "5" ? "Chưa có lịch khám nào đã thanh toán" :
                     "Hiện tại bạn chưa có bệnh nhân nào đặt lịch. Vui lòng kiểm tra lại sau."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tabAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.appointment.id}
                      appointment={appointment}
                      getStatusBadge={getStatusBadge}
                      isDoctor={auth?.role !== 3}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default AppointmentManager;