/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuth } from "@/utils/getAuth";

// Demo data
const mockAppointments = [
  {
    id: 1,
    patientName: "Nguyễn Văn A",
    patientAge: 32,
    patientGender: "Nam",
    date: "2025-05-10T09:30:00",
    reason: "Đau đầu, sốt nhẹ",
    status: "confirmed",
    phone: "0912345678",
    email: "nguyenvana@example.com",
  },
  {
    id: 2,
    patientName: "Trần Thị B",
    patientAge: 45,
    patientGender: "Nữ",
    date: "2025-05-12T14:00:00",
    reason: "Khám định kỳ",
    status: "pending",
    phone: "0923456789",
    email: "tranthib@example.com",
  },
  {
    id: 3,
    patientName: "Lê Văn C",
    patientAge: 28,
    patientGender: "Nam",
    date: "2025-05-09T10:15:00",
    reason: "Đau lưng kéo dài",
    status: "completed",
    phone: "0934567890",
    email: "levanc@example.com",
  },
  {
    id: 4,
    patientName: "Phạm Thị D",
    patientAge: 56,
    patientGender: "Nữ",
    date: "2025-05-15T11:00:00",
    reason: "Mệt mỏi, khó ngủ",
    status: "cancelled",
    phone: "0945678901",
    email: "phamthid@example.com",
  },
];

const AppointmentManager = ({ doctorId }) => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const auth = getAuth();

  // Simulating the form data for new appointments
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "Nam",
    date: "",
    time: "",
    reason: "",
    status: "pending",
    phone: "",
    email: "",
  });

  useEffect(() => {
    // Filter appointments based on search term and status
    let filtered = [...appointments];
    
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.phone.includes(searchTerm) ||
          apt.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }
    
    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateAppointment = () => {
    // Combine date and time into a single ISO string
    const dateTime = `${formData.date}T${formData.time}:00`;
    
    const newAppointment = {
      id: appointments.length + 1,
      patientName: formData.patientName,
      patientAge: parseInt(formData.patientAge),
      patientGender: formData.patientGender,
      date: dateTime,
      reason: formData.reason,
      status: formData.status,
      phone: formData.phone,
      email: formData.email,
    };
    
    setAppointments([...appointments, newAppointment]);
    resetForm();
    setIsCreateOpen(false);
  };

  const handleUpdateAppointment = () => {
    // Combine date and time if they're provided separately
    let dateTime = currentAppointment.date;
    if (formData.date && formData.time) {
      dateTime = `${formData.date}T${formData.time}:00`;
    }
    
    const updatedAppointment = {
      ...currentAppointment,
      patientName: formData.patientName,
      patientAge: parseInt(formData.patientAge),
      patientGender: formData.patientGender,
      date: dateTime,
      reason: formData.reason,
      status: formData.status,
      phone: formData.phone,
      email: formData.email,
    };
    
    setAppointments(
      appointments.map((apt) =>
        apt.id === currentAppointment.id ? updatedAppointment : apt
      )
    );
    
    setIsEditOpen(false);
  };

  const handleDeleteAppointment = () => {
    setAppointments(
      appointments.filter((apt) => apt.id !== currentAppointment.id)
    );
    setIsDeleteOpen(false);
  };

  const openEditDialog = (appointment) => {
    setCurrentAppointment(appointment);
    
    // Parse ISO date to get separate date and time
    const date = appointment.date.split("T")[0];
    const time = appointment.date.split("T")[1].substring(0, 5);
    
    setFormData({
      patientName: appointment.patientName,
      patientAge: appointment.patientAge.toString(),
      patientGender: appointment.patientGender,
      date: date,
      time: time,
      reason: appointment.reason,
      status: appointment.status,
      phone: appointment.phone,
      email: appointment.email,
    });
    
    setIsEditOpen(true);
  };

  const openViewDialog = (appointment) => {
    setCurrentAppointment(appointment);
    setIsViewOpen(true);
  };

  const openDeleteDialog = (appointment) => {
    setCurrentAppointment(appointment);
    setIsDeleteOpen(true);
  };

  const resetForm = () => {
    setFormData({
      patientName: "",
      patientAge: "",
      patientGender: "Nam",
      date: "",
      time: "",
      reason: "",
      status: "pending",
      phone: "",
      email: "",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã xác nhận
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Chờ xác nhận
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Hoàn thành
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Đã hủy
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            Không xác định
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Quản lý lịch hẹn</h2>
        
        {auth?.role !== 3 && (
          <Button 
            onClick={() => setIsCreateOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm lịch hẹn mới
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Lọc trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="pending">Chờ xác nhận</SelectItem>
              <SelectItem value="confirmed">Đã xác nhận</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Sắp tới</TabsTrigger>
          <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {filteredAppointments.filter(apt => 
            apt.status === "pending" || apt.status === "confirmed"
          ).length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Không có lịch hẹn sắp tới</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAppointments
                .filter(apt => apt.status === "pending" || apt.status === "confirmed")
                .map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                    onView={openViewDialog}
                    getStatusBadge={getStatusBadge}
                    isDoctor={auth?.role !== 3}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          {filteredAppointments.filter(apt => apt.status === "completed").length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Không có lịch hẹn đã hoàn thành</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAppointments
                .filter(apt => apt.status === "completed")
                .map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                    onView={openViewDialog}
                    getStatusBadge={getStatusBadge}
                    isDoctor={auth?.role !== 3}
                  />
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4 mt-4">
          {filteredAppointments.filter(apt => apt.status === "cancelled").length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Không có lịch hẹn đã hủy</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAppointments
                .filter(apt => apt.status === "cancelled")
                .map((appointment) => (
                  <AppointmentCard 
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                    onView={openViewDialog}
                    getStatusBadge={getStatusBadge}
                    isDoctor={auth?.role !== 3}
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Appointment Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm lịch hẹn mới</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Tên bệnh nhân</Label>
                <Input
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="patientAge">Tuổi</Label>
                <Input
                  id="patientAge"
                  name="patientAge"
                  type="number"
                  value={formData.patientAge}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientGender">Giới tính</Label>
                <Select 
                  value={formData.patientGender} 
                  onValueChange={(value) => handleSelectChange("patientGender", value)}
                >
                  <SelectTrigger id="patientGender">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Trạng thái</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Ngày</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="time">Giờ</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="reason">Lý do khám</Label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Hủy</Button>
            <Button onClick={handleCreateAppointment}>Tạo lịch hẹn</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa lịch hẹn</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Tên bệnh nhân</Label>
                <Input
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="patientAge">Tuổi</Label>
                <Input
                  id="patientAge"
                  name="patientAge"
                  type="number"
                  value={formData.patientAge}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientGender">Giới tính</Label>
                <Select 
                  value={formData.patientGender} 
                  onValueChange={(value) => handleSelectChange("patientGender", value)}
                >
                  <SelectTrigger id="patientGender">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Trạng thái</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ xác nhận</SelectItem>
                    <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Ngày</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="time">Giờ</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="reason">Lý do khám</Label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
            <Button onClick={handleUpdateAppointment}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Appointment Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
          </DialogHeader>
          {currentAppointment && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{currentAppointment.patientName}</h3>
                {getStatusBadge(currentAppointment.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Tuổi</p>
                  <p>{currentAppointment.patientAge}</p>
                </div>
                <div>
                  <p className="text-gray-500">Giới tính</p>
                  <p>{currentAppointment.patientGender}</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Thời gian khám</p>
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                  {format(parseISO(currentAppointment.date), "EEEE, dd/MM/yyyy", { locale: vi })}
                </p>
                <p className="flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  {format(parseISO(currentAppointment.date), "HH:mm", { locale: vi })}
                </p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Lý do khám</p>
                <p className="mt-1">{currentAppointment.reason}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Số điện thoại</p>
                  <p>{currentAppointment.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p>{currentAppointment.email}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa lịch hẹn</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn có chắc chắn muốn xóa lịch hẹn này không? Thao tác này không thể hoàn tác.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={handleDeleteAppointment}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Appointment Card Component
const AppointmentCard = ({ appointment, onEdit, onDelete, onView, getStatusBadge, isDoctor }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 bg-gray-50 flex flex-row justify-between items-center space-y-0">
        <CardTitle className="text-base font-medium">
          {appointment.patientName}
        </CardTitle>
        {getStatusBadge(appointment.status)}
      </CardHeader>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
          <span>
            {format(parseISO(appointment.date), "EEEE, dd/MM/yyyy", { locale: vi })}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-blue-600" />
          <span>{format(parseISO(appointment.date), "HH:mm", { locale: vi })}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{appointment.reason}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => onView(appointment)}>
          Chi tiết
        </Button>
        
        {isDoctor && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Thao tác
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(appointment)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600" 
                onClick={() => onDelete(appointment)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardFooter>
    </Card>
  );
};

export default AppointmentManager;