// import React, { useState, useEffect } from 'react';
// import {
//   Calendar, Clock, Users, Star, CheckCircle, XCircle, DollarSign,
//   VideoIcon, Edit, Trash, FileText, User, Plus, Filter, Search,
//   RefreshCw, Download, Book, ChevronUp, ChevronDown, ArrowUpRight, MessageSquare
// } from 'lucide-react';
// import {
//   Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { motion, AnimatePresence } from "framer-motion";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Label } from "@/components/ui/label";

// import {
//   getDoctorById, getDoctorSchedulesByClinic,
//   getDoctorRatingsByDoctorId, addSchedule,
//   getAllClinicsByDoctorId, createNewHealthHandbook,
//   getAllHealthHandBookByDoctorId, createMeetingByDoctor
// } from "../services/doctorService";

// import {
//   getAllMyBooking, approvalAppointment,
//   rejectAppointment
// } from "../services/appointmentService";

// import {
//   getAllMyPayment
// } from "../services/paymentService";

// // Mock data for initial state
// const mockData = {
//   appointments: {
//     total: 236,
//     pending: 32,
//     completed: 187,
//     cancelled: 17,
//     todayAppointments: 8
//   },
//   earnings: {
//     total: 45600000,
//     thisMonth: 3800000,
//     lastMonth: 3200000,
//     growth: 18.75
//   },
//   ratings: {
//     average: 4.7,
//     total: 167,
//     fiveStars: 122,
//     fourStars: 34,
//     threeStars: 9,
//     twoStars: 2,
//     oneStar: 0
//   },
//   patients: {
//     total: 178,
//     new: 12,
//     returning: 166
//   }
// };

// const DashboardDoctor = () => {
//   const [timeRange, setTimeRange] = useState("week");
//   const [loading, setLoading] = useState(true);
//   const [doctor, setDoctor] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [schedules, setSchedules] = useState([]);
//   const [ratings, setRatings] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [clinics, setClinics] = useState([]);
//   const [healthHandbooks, setHealthHandbooks] = useState([]);
//   const [stats, setStats] = useState({
//     appointments: mockData.appointments,
//     earnings: mockData.earnings,
//     ratings: mockData.ratings,
//     patients: mockData.patients
//   });
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [selectedClinic, setSelectedClinic] = useState(null);
//   const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
//   const [isHandbookDialogOpen, setIsHandbookDialogOpen] = useState(false);

//   useEffect(() => {
//     fetchDoctorData();
//   }, []);

//   const fetchDoctorData = async () => {
//     setLoading(true);
//     // Simulate a doctor ID
//     const doctorId = "current-doctor-id";

//     try {
//       // Fetch all required data
//       const [doctorData, appointmentsData, ratingsData, paymentsData, clinicsData, handbooksData] = await Promise.all([
//         getDoctorById(doctorId),
//         getAllMyBooking(doctorId),
//         getDoctorRatingsByDoctorId(doctorId),
//         getAllMyPayment(doctorId),
//         getAllClinicsByDoctorId(doctorId),
//         getAllHealthHandBookByDoctorId(doctorId)
//       ]);

//       // Set initial data
//       setDoctor(doctorData.data);
//       setAppointments(appointmentsData.data);
//       setRatings(ratingsData.data);
//       setPayments(paymentsData.data);
//       setClinics(clinicsData.data);
//       setHealthHandbooks(handbooksData.data);

//       // If we have clinics, select the first one and fetch schedules
//       if (clinicsData.data && clinicsData.data.length > 0) {
//         setSelectedClinic(clinicsData.data[0]);
//         const schedulesData = await getDoctorSchedulesByClinic(doctorId, clinicsData.data[0].id, timeRange);
//         setSchedules(schedulesData.data);
//       }

//       // Process appointments data
//       const appointmentStats = {
//         total: appointmentsData.data.length,
//         pending: appointmentsData.data.filter(appointment => appointment.status === "pending").length,
//         completed: appointmentsData.data.filter(appointment => appointment.status === "approved").length,
//         cancelled: appointmentsData.data.filter(appointment =>
//           appointment.status === "rejected" || appointment.status === "cancelled"
//         ).length,
//         todayAppointments: appointmentsData.data.filter(appointment => {
//           const today = new Date().toISOString().split('T')[0];
//           return appointment.appointmentDate === today;
//         }).length
//       };

//       // Process payment data
//       const earningsStats = {
//         total: paymentsData.data.reduce((sum, payment) => sum + payment.amount, 0),
//         thisMonth: paymentsData.data.filter(payment => {
//           const thisMonth = new Date().getMonth();
//           const paymentMonth = new Date(payment.createdAt).getMonth();
//           return paymentMonth === thisMonth;
//         }).reduce((sum, payment) => sum + payment.amount, 0),
//         lastMonth: paymentsData.data.filter(payment => {
//           const lastMonth = new Date().getMonth() - 1;
//           const paymentMonth = new Date(payment.createdAt).getMonth();
//           return paymentMonth === lastMonth;
//         }).reduce((sum, payment) => sum + payment.amount, 0)
//       };
      
//       earningsStats.growth = earningsStats.lastMonth ?
//         ((earningsStats.thisMonth - earningsStats.lastMonth) / earningsStats.lastMonth * 100) : 0;

//       // Process ratings data
//       const ratingsStats = {
//         average: ratingsData.data.length ?
//           ratingsData.data.reduce((sum, rating) => sum + rating.rating, 0) / ratingsData.data.length : 0,
//         total: ratingsData.data.length,
//         fiveStars: ratingsData.data.filter(rating => rating.rating === 5).length,
//         fourStars: ratingsData.data.filter(rating => rating.rating === 4).length,
//         threeStars: ratingsData.data.filter(rating => rating.rating === 3).length,
//         twoStars: ratingsData.data.filter(rating => rating.rating === 2).length,
//         oneStar: ratingsData.data.filter(rating => rating.rating === 1).length
//       };

//       // Process patient data
//       const uniquePatients = [...new Set(appointmentsData.data.map(a => a.patientId))];
//       const patientsStats = {
//         total: uniquePatients.length,
//         new: uniquePatients.filter(patientId => {
//           const patientAppointments = appointmentsData.data.filter(a => a.patientId === patientId);
//           const firstAppointmentDate = new Date(patientAppointments.sort((a, b) =>
//             new Date(a.createdAt) - new Date(b.createdAt)
//           )[0].createdAt);
//           const oneMonthAgo = new Date();
//           oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
//           return firstAppointmentDate > oneMonthAgo;
//         }).length
//       };
//       patientsStats.returning = patientsStats.total - patientsStats.new;

//       // Update stats
//       setStats({
//         appointments: appointmentStats,
//         earnings: earningsStats,
//         ratings: ratingsStats,
//         patients: patientsStats
//       });

//     } catch (error) {
//       console.error("Error fetching doctor data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshData = async () => {
//     setIsRefreshing(true);
//     await fetchDoctorData();
//     setTimeout(() => setIsRefreshing(false), 800);
//   };

//   const handleClinicChange = async (clinicId) => {
//     const clinic = clinics.find(c => c.id === clinicId);
//     setSelectedClinic(clinic);
    
//     try {
//       const schedulesData = await getDoctorSchedulesByClinic(doctor.id, clinicId, timeRange);
//       setSchedules(schedulesData.data);
//     } catch (error) {
//       console.error("Error fetching schedules:", error);
//     }
//   };

//   const handleTimeRangeChange = async (range) => {
//     setTimeRange(range);
    
//     if (selectedClinic) {
//       try {
//         const schedulesData = await getDoctorSchedulesByClinic(doctor.id, selectedClinic.id, range);
//         setSchedules(schedulesData.data);
//       } catch (error) {
//         console.error("Error fetching schedules:", error);
//       }
//     }
//   };

//   const handleCreateSchedule = async (scheduleData) => {
//     try {
//       await addSchedule(doctor.id, selectedClinic.id, scheduleData);
//       const schedulesData = await getDoctorSchedulesByClinic(doctor.id, selectedClinic.id, timeRange);
//       setSchedules(schedulesData.data);
//       setIsScheduleDialogOpen(false);
//     } catch (error) {
//       console.error("Error creating schedule:", error);
//     }
//   };

//   const handleCreateHandbook = async (handbookData) => {
//     try {
//       await createNewHealthHandbook(handbookData);
//       const handbooksData = await getAllHealthHandBookByDoctorId(doctor.id);
//       setHealthHandbooks(handbooksData.data);
//       setIsHandbookDialogOpen(false);
//     } catch (error) {
//       console.error("Error creating handbook:", error);
//     }
//   };

//   const handleApproveAppointment = async (appointmentId) => {
//     try {
//       await approvalAppointment(appointmentId);
//       refreshData();
//     } catch (error) {
//       console.error("Error approving appointment:", error);
//     }
//   };

//   const handleRejectAppointment = async (appointmentId, reason) => {
//     try {
//       await rejectAppointment(appointmentId, { reason });
//       refreshData();
//     } catch (error) {
//       console.error("Error rejecting appointment:", error);
//     }
//   };

//   const handleCreateMeeting = async (appointmentId) => {
//     try {
//       await createMeetingByDoctor(doctor.id, { appointmentId });
//       refreshData();
//     } catch (error) {
//       console.error("Error creating meeting:", error);
//     }
//   };

//   // Filter appointments based on search query
//   const filteredAppointments = appointments.filter(appointment =>
//     appointment.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     appointment.patientEmail?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="flex flex-col p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen"
//     >
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <motion.div
//           initial={{ x: -20, opacity: 0 }}
//           animate={{ x: 0, opacity: 1 }}
//           transition={{ delay: 0.1 }}
//         >
//           <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
//             Xin chào, {doctor?.name || "Bác sĩ"}
//           </h1>
//           <p className="text-gray-500 mt-1">
//             {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
//           </p>
//         </motion.div>
//         <div className="flex flex-wrap items-center gap-3">
//           <div className="relative">
//             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
//             <Input
//               placeholder="Tìm kiếm..."
//               className="pl-9 w-[180px] md:w-[260px]"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           <Select defaultValue={timeRange} onValueChange={handleTimeRangeChange}>
//             <SelectTrigger className="w-[150px]">
//               <SelectValue placeholder="Chọn thời gian" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="day">Hôm nay</SelectItem>
//               <SelectItem value="week">Tuần này</SelectItem>
//               <SelectItem value="month">Tháng này</SelectItem>
//               <SelectItem value="quarter">Quý này</SelectItem>
//               <SelectItem value="year">Năm nay</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={refreshData}
//             className={isRefreshing ? "animate-spin" : ""}
//           >
//             <RefreshCw className="h-4 w-4" />
//           </Button>
//           <Button>
//             <Download className="mr-2 h-4 w-4" /> Xuất báo cáo
//           </Button>
//         </div>
//       </div>

//       {loading ? (
//         <div className="grid gap-6 md:grid-cols-4">
//           {[1, 2, 3, 4].map(i => (
//             <Card key={i} className="animate-pulse">
//               <CardHeader className="pb-2">
//                 <div className="h-5 w-24 bg-gray-200 rounded"></div>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
//                 <div className="h-4 w-36 bg-gray-200 rounded mb-3"></div>
//                 <div className="h-2 bg-gray-200 rounded"></div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <motion.div
//           initial={{ y: 20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.2 }}
//           className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
//         >
//           <Card className="overflow-hidden">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
//               <CardTitle className="text-sm font-medium">Lịch hẹn hôm nay</CardTitle>
//               <Calendar className="h-4 w-4 text-blue-600" />
//             </CardHeader>
//             <CardContent className="pt-6">
//               <motion.div
//                 initial={{ scale: 0.8 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 15 }}
//                 className="text-2xl font-bold"
//               >
//                 {stats.appointments.todayAppointments}
//               </motion.div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Từ tổng số {stats.appointments.total} lịch hẹn
//               </p>
//               <div className="mt-3">
//                 <Progress value={stats.appointments.todayAppointments / stats.appointments.total * 100} className="h-2" />
//               </div>
//               <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
//                 <div className="bg-amber-50 rounded p-1 text-center">
//                   <p className="font-semibold text-amber-600">{stats.appointments.pending}</p>
//                   <p className="text-gray-500">Chờ duyệt</p>
//                 </div>
//                 <div className="bg-green-50 rounded p-1 text-center">
//                   <p className="font-semibold text-green-600">{stats.appointments.completed}</p>
//                   <p className="text-gray-500">Hoàn thành</p>
//                 </div>
//                 <div className="bg-gray-50 rounded p-1 text-center">
//                   <p className="font-semibold text-gray-600">{stats.appointments.cancelled}</p>
//                   <p className="text-gray-500">Đã hủy</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="overflow-hidden">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-green-100">
//               <CardTitle className="text-sm font-medium">Thu nhập tháng này</CardTitle>
//               <DollarSign className="h-4 w-4 text-green-600" />
//             </CardHeader>
//             <CardContent className="pt-6">
//               <motion.div
//                 initial={{ scale: 0.8 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 15 }}
//                 className="text-2xl font-bold"
//               >
//                 {stats.earnings.thisMonth.toLocaleString()} VNĐ
//               </motion.div>
//               <div className="flex items-center text-xs text-muted-foreground mt-1">
//                 <div className={`mr-2 px-1.5 py-0.5 rounded ${stats.earnings.growth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
//                   {stats.earnings.growth >= 0 ? <ChevronUp className="inline h-3 w-3" /> : <ChevronDown className="inline h-3 w-3" />}
//                   {Math.abs(stats.earnings.growth).toFixed(1)}%
//                 </div>
//                 <span>so với tháng trước</span>
//               </div>
//               <div className="mt-3">
//                 <Progress value={stats.earnings.thisMonth / (stats.earnings.total * 0.2) * 100} className="h-2" />
//               </div>
//               <div className="flex justify-between mt-3 text-xs">
//                 <div>
//                   <p className="text-gray-500">Tổng thu nhập</p>
//                   <p className="font-semibold">{stats.earnings.total.toLocaleString()} VNĐ</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-gray-500">Bình quân/Lịch hẹn</p>
//                   <p className="font-semibold">{Math.round(stats.earnings.total / stats.appointments.total).toLocaleString()} VNĐ</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="overflow-hidden">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-amber-100">
//               <CardTitle className="text-sm font-medium">Đánh giá</CardTitle>
//               <Star className="h-4 w-4 text-amber-600" />
//             </CardHeader>
//             <CardContent className="pt-6">
//               <div className="flex items-end gap-2">
//                 <motion.div
//                   initial={{ scale: 0.8 }}
//                   animate={{ scale: 1 }}
//                   transition={{ type: "spring", stiffness: 300, damping: 15 }}
//                   className="text-2xl font-bold"
//                 >
//                   {stats.ratings.average.toFixed(1)}
//                 </motion.div>
//                 <div className="flex items-center text-amber-500 mb-1">
//                   {[1, 2, 3, 4, 5].map(star => (
//                     <Star key={star} className={`h-3 w-3 ${star <= Math.round(stats.ratings.average) ? 'fill-amber-500' : ''}`} />
//                   ))}
//                 </div>
//                 <span className="text-xs text-muted-foreground mb-1">({stats.ratings.total})</span>
//               </div>
//               <div className="mt-3 space-y-2">
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs w-8">5 sao</span>
//                   <Progress value={stats.ratings.fiveStars / stats.ratings.total * 100} className="h-1.5" />
//                   <span className="text-xs">{stats.ratings.fiveStars}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs w-8">4 sao</span>
//                   <Progress value={stats.ratings.fourStars / stats.ratings.total * 100} className="h-1.5" />
//                   <span className="text-xs">{stats.ratings.fourStars}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs w-8">3 sao</span>
//                   <Progress value={stats.ratings.threeStars / stats.ratings.total * 100} className="h-1.5" />
//                   <span className="text-xs">{stats.ratings.threeStars}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs w-8">2 sao</span>
//                   <Progress value={stats.ratings.twoStars / stats.ratings.total * 100} className="h-1.5" />
//                   <span className="text-xs">{stats.ratings.twoStars}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs w-8">1 sao</span>
//                   <Progress value={stats.ratings.oneStar / stats.ratings.total * 100} className="h-1.5" />
//                   <span className="text-xs">{stats.ratings.oneStar}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card className="overflow-hidden">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-purple-100">
//               <CardTitle className="text-sm font-medium">Bệnh nhân</CardTitle>
//               <Users className="h-4 w-4 text-purple-600" />
//             </CardHeader>
//             <CardContent className="pt-6">
//               <motion.div
//                 initial={{ scale: 0.8 }}
//                 animate={{ scale: 1 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 15 }}
//                 className="text-2xl font-bold"
//               >
//                 {stats.patients.total}
//               </motion.div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 {stats.patients.new} bệnh nhân mới trong tháng này
//               </p>
//               <div className="mt-3">
//                 <Progress value={stats.patients.new / stats.patients.total * 100} className="h-2" />
//               </div>
//               <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
//                 <div className="bg-purple-50 rounded p-1 text-center">
//                   <p className="font-semibold text-purple-600">{stats.patients.new}</p>
//                   <p className="text-gray-500">Mới</p>
//                 </div>
//                 <div className="bg-blue-50 rounded p-1 text-center">
//                   <p className="font-semibold text-blue-600">{stats.patients.returning}</p>
//                   <p className="text-gray-500">Quay lại</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>
//       )}

//       {/* Main Content */}
//       <Tabs defaultValue="appointments" className="space-y-6">
//         <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-5 gap-2">
//           <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
//           <TabsTrigger value="schedules">Lịch làm việc</TabsTrigger>
//           <TabsTrigger value="patients">Bệnh nhân</TabsTrigger>
//           <TabsTrigger value="handbooks">Cẩm nang</TabsTrigger>
//           <TabsTrigger value="earnings">Thu nhập</TabsTrigger>
//         </TabsList>

//         {/* Appointments Tab */}
//         <TabsContent value="appointments" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Quản lý lịch hẹn</CardTitle>
//               <CardDescription>Danh sách lịch hẹn của bạn</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex gap-3 mb-4 flex-wrap">
//                 <Button variant="outline" size="sm" className="gap-1">
//                   <Filter className="h-3.5 w-3.5" />
//                   Lọc
//                 </Button>
//                 <Badge variant="outline" className="rounded-full px-3 py-1">
//                   Tất cả lịch hẹn
//                 </Badge>
//                 <Badge variant="secondary" className="rounded-full px-3 py-1">
//                   Hôm nay ({appointments.filter(a => {
//                     const today = new Date().toISOString().split('T')[0];
//                     return a.appointmentDate === today;
//                   }).length})
//                 </Badge>
//                 <Badge variant="secondary" className="rounded-full px-3 py-1">
//                   Chờ xác nhận ({appointments.filter(a => a.status === "pending").length})
//                 </Badge>
//                 <Badge variant="secondary" className="rounded-full px-3 py-1">
//                   Đã xác nhận ({appointments.filter(a => a.status === "approved").length})
//                 </Badge>
//               </div>

//               <div className="rounded-md border">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Bệnh nhân</TableHead>
//                       <TableHead>Ngày/Giờ</TableHead>
//                       <TableHead>Lý do khám</TableHead>
//                       <TableHead>Trạng thái</TableHead>
//                       <TableHead className="text-right">Thao tác</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {loading ? (
//                       <TableRow>
//                         <TableCell colSpan={5} className="text-center py-10">
//                           <div className="flex justify-center">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                           </div>
//                           <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
//                         </TableCell>
//                       </TableRow>
//                     ) : filteredAppointments.length === 0 ? (
//                       <TableRow>
//                         <TableCell colSpan={5} className="text-center py-10">
//                           <p className="text-gray-500">Không tìm thấy lịch hẹn nào</p>
//                         </TableCell>
//                       </TableRow>
//                     ) : (
//                       filteredAppointments.slice(0, 5).map((appointment, index) => (
//                         <TableRow key={appointment.id || index}>
//                           <TableCell>
//                             <div className="flex items-center gap-3">
//                               <Avatar className="h-8 w-8">
//                                 <AvatarImage src={appointment.patientAvatar} />
//                                 <AvatarFallback>{appointment.patientName?.[0] || "P"}</AvatarFallback>
//                               </Avatar>
//                               <div>
//                                 <p className="text-sm font-medium">{appointment.patientName || `Nguyễn Văn A${index + 1}`}</p>
//                                 <p className="text-xs text-gray-500">{appointment.patientEmail || `patient${index + 1}@example.com`}</p>
//                               </div>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex flex-col">
//                               <span className="text-sm">{appointment.appointmentDate || "19/05/2025"}</span>
//                               <span className="text-xs text-gray-500">{appointment.appointmentTime || "09:30"}</span>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <p className="text-sm">{appointment.reason || "Khám tổng quát"}</p>
//                           </TableCell>
//                           <TableCell>
//                             <Badge
//                               className={
//                                 appointment.status === "approved" ? "bg-green-100 text-green-700" :
//                                 appointment.status === "pending" ? "bg-amber-100 text-amber-700" :
//                                 appointment.status === "rejected" ? "bg-red-100 text-red-700" :
//                                 "bg-gray-100 text-gray-700"
//                               }
//                             >
//                               {appointment.status === "approved" ? "Đã phê duyệt" :
//                                appointment.status === "pending" ? "Chờ phê duyệt" :
//                                appointment.status === "rejected" ? "Từ chối" : "Đã hủy"}
//                             </Badge>
//                           </TableCell>
//                           <TableCell className="text-right">
//                             <div className="flex justify-end gap-2">
//                               {appointment.status === "pending" && (
//                                 <>
//                                   <Button size="sm" variant="default" className="h-8" onClick={() => handleApproveAppointment(appointment.id)}>
//                                     Duyệt
//                                   </Button>
//                                   <Dialog>
//                                     <DialogTrigger asChild>
//                                       <Button size="sm" variant="outline" className="h-8">
//                                         Từ chối
//                                       </Button>
//                                     </DialogTrigger>
//                                     <DialogContent>
//                                       <DialogHeader>
//                                         <DialogTitle>Từ chối lịch hẹn</DialogTitle>
//                                         <DialogDescription>
//                                           Vui lòng cung cấp lý do từ chối lịch hẹn này.
//                                         </DialogDescription>
//                                       </DialogHeader>
//                                       <div className="py-4">
//                                         <Textarea placeholder="Lý do từ chối..." className="min-h-[100px]" />
//                                       </div>
//                                       <DialogFooter>
//                                         <Button variant="outline">Hủy</Button>
//                                         <Button variant="destructive" onClick={() => handleRejectAppointment(appointment.id, "Bác sĩ không thể thực hiện lịch hẹn vào thời gian này")}>
//                                           Xác nhận từ chối
//                                         </Button>
//                                       </DialogFooter>
//                                     </DialogContent>
//                                   </Dialog>
//                                 </>
//                               )}
//                               {appointment.status === "approved" && (
//                                 <Button size="sm" variant="default" className="h-8 bg-blue-600 hover:bg-blue-700" onClick={() => handleCreateMeeting(appointment.id)}>
//                                   <VideoIcon className="mr-1 h-3.5 w-3.5" />
//                                   Tạo cuộc hẹn
//                                 </Button>
//                               )}
//                               <Button size="sm" variant="ghost" className="h-8">
//                                 Chi tiết
//                               </Button>
//                             </div>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
              
//               <div className="mt-4 flex justify-end">
//                 <Button variant="outline" size="sm">Xem tất cả lịch hẹn</Button>
//               </div>
//             </CardContent>
//           </Card>

//           <div className="grid gap-6 md:grid-cols-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Lịch hẹn hôm nay</CardTitle>
//                 <CardDescription>
//                   {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   {appointments.filter(appointment => {
//                     const today = new Date().toISOString().split('T')[0];
//                     return appointment.appointmentDate === today;
//                   }).length === 0 ? (
//                     <div className="text-center py-8">
//                       <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                       <p className="text-gray-500">Không có lịch hẹn nào hôm nay</p>
//                     </div>
//                   ) : (
//                     appointments.filter(appointment => {
//                       const today = new Date().toISOString().split('T')[0];
//                       return appointment.appointmentDate === today;
//                     }).slice(0, 4).map((appointment, index) => (
//                       <motion.div
//                         key={appointment.id || index}
//                         initial={{ x: -20, opacity: 0 }}
//                         animate={{ x: 0, opacity: 1 }}
//                         transition={{ delay: index * 0.1 }}
//                         className="flex gap-4 p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow"
//                       >
//                         <div className="flex-shrink-0">
//                           <Avatar className="h-10 w-10">
//                             <AvatarImage src={appointment.patientAvatar} />
//                             <AvatarFallback>{appointment.patientName?.[0] || "P"}</AvatarFallback>
//                           </Avatar>
//                         </div>
//                         <div className="flex-grow">
//                           <div className="flex justify-between items-start">
//                             <div>
//                               <p className="font-medium text-sm">{appointment.patientName || `Nguyễn Văn A${index + 1}`}</p>
//                               <p className="text-gray-500 text-xs">{appointment.patientEmail || `patient${index + 1}@example.com`}</p>
//                             </div>
//                             <Badge
//                               className={
//                                 appointment.status === "approved" ? "bg-green-100 text-green-700" :
//                                 appointment.status === "pending" ? "bg-amber-100 text-amber-700" :
//                                 "bg-gray-100 text-gray-700"
//                               }
//                             >
//                               {appointment.status === "approved" ? "Đã phê duyệt" :
//                               appointment.status === "pending" ? "Chờ phê duyệt" : "Đã hủy"}
//                             </Badge>
//                           </div>
//                           <div className="mt-2 flex items-center text-xs text-gray-500">
//                             <Clock className="h-3 w-3 mr-1" />
//                             <span>{appointment.appointmentTime || "09:30"}</span>
//                             <span className="mx-2">•</span>
//                             <span>{appointment.reason || "Khám tổng quát"}</span>
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))
//                   )}
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button variant="ghost" className="w-full">Xem tất cả lịch hẹn hôm nay</Button>
//               </CardFooter>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Phân tích lịch hẹn</CardTitle>
//                 <CardDescription>
//                   Thống kê theo {timeRange === 'day' ? 'giờ' : timeRange === 'week' ? 'ngày' : timeRange === 'month' ? 'tuần' : 'tháng'}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="h-[300px] relative">
//                 {/* Animated bar chart */}
//                 <div className="absolute bottom-0 left-0 right-0 h-[220px] border-b border-l">
//                   <div className="flex justify-between items-end h-full px-2">
//                     {[40, 65, 35, 85, 55, 45, 70].map((height, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ height: 0 }}
//                         animate={{ height: `${height}%` }}
//                         transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
//                         className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t shadow-lg"
//                       />
//                     ))}
//                   </div>
//                 </div>
                
//                 {/* X-axis labels */}
//                 <div className="absolute bottom-[-25px] left-0 right-0 flex justify-between px-6 text-xs text-gray-500">
//                   {timeRange === 'week' && (
//                     <>
//                       <span>T2</span>
//                       <span>T3</span>
//                       <span>T4</span>
//                       <span>T5</span>
//                       <span>T6</span>
//                       <span>T7</span>
//                       <span>CN</span>
//                     </>
//                   )}
//                 </div>
//               </CardContent>
//               <CardFooter className="text-xs text-muted-foreground">
//                 <div className="flex justify-between w-full">
//                   <span>Tổng số lịch hẹn: {stats.appointments.total}</span>
//                   <span>Tỷ lệ hoàn thành: {Math.round(stats.appointments.completed / stats.appointments.total * 100)}%</span>
//                 </div>
//               </CardFooter>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Schedules Tab */}
//         <TabsContent value="schedules" className="space-y-6">
//           <Card>
//             <CardHeader className="flex flex-row items-start justify-between">
//               <div>
//                 <CardTitle>Quản lý lịch làm việc</CardTitle>
//                 <CardDescription>Thiết lập lịch làm việc của bạn</CardDescription>
//               </div>
//               <div className="space-x-2">
//                 <Select value={selectedClinic?.id} onValueChange={handleClinicChange}>
//                   <SelectTrigger className="w-[250px]">
//                     <SelectValue placeholder="Chọn cơ sở làm việc" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {clinics.map(clinic => (
//                       <SelectItem key={clinic.id} value={clinic.id}>{clinic.name}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
//                   <DialogTrigger asChild>
//                     <Button>
//                       <Plus className="mr-2 h-4 w-4" /> Thêm lịch làm việc
//                     </Button>
//                   </DialogTrigger>
//                   <DialogContent>
//                     <DialogHeader>
//                       <DialogTitle>Tạo lịch làm việc mới</DialogTitle>
//                       <DialogDescription>
//                         Thiết lập thời gian làm việc của bạn tại {selectedClinic?.name || "phòng khám"}
//                       </DialogDescription>
//                     </DialogHeader>
//                     <div className="grid gap-4 py-4">
//                       <div className="grid grid-cols-4 items-center gap-4">
//                         <Label htmlFor="date" className="text-right">Ngày</Label>
//                         <Input id="date" type="date" className="col-span-3" />
//                       </div>
//                       <div className="grid grid-cols-4 items-center gap-4">
//                         <Label htmlFor="startTime" className="text-right">Giờ bắt đầu</Label>
//                         <Input id="startTime" type="time" className="col-span-3" />
//                       </div>
//                       <div className="grid grid-cols-4 items-center gap-4">
//                         <Label htmlFor="endTime" className="text-right">Giờ kết thúc</Label>
//                         <Input id="endTime" type="time" className="col-span-3" />
//                       </div>
//                       <div className="grid grid-cols-4 items-center gap-4">
//                         <Label htmlFor="slotDuration" className="text-right">Thời gian mỗi ca</Label>
//                         <Select defaultValue="30">
//                           <SelectTrigger className="col-span-3">
//                             <SelectValue placeholder="Chọn thời gian" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="15">15 phút</SelectItem>
//                             <SelectItem value="30">30 phút</SelectItem>
//                             <SelectItem value="45">45 phút</SelectItem>
//                             <SelectItem value="60">60 phút</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>
//                     <DialogFooter>
//                       <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>Hủy</Button>
//                       <Button onClick={() => handleCreateSchedule({
//                         date: document.getElementById('date').value,
//                         startTime: document.getElementById('startTime').value,
//                         endTime: document.getElementById('endTime').value,
//                         slotDuration: document.querySelector('[data-value]')?.getAttribute('data-value') || "30"
//                       })}>
//                         Tạo lịch làm việc
//                       </Button>
//                     </DialogFooter>
//                   </DialogContent>
//                 </Dialog>
//               </div>
//             </CardHeader>
//             <CardContent>
//               {!selectedClinic ? (
//                 <div className="text-center py-12 border border-dashed rounded-lg">
//                   <Building className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                   <p className="text-lg text-gray-500 font-medium">Vui lòng chọn cơ sở làm việc</p>
//                   <p className="text-sm text-gray-400 mt-1">Để thiết lập và xem lịch làm việc của bạn</p>
//                 </div>
//               ) : loading ? (
//                 <div className="py-12 text-center">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="mt-4 text-gray-500">Đang tải lịch làm việc...</p>
//                 </div>
//               ) : schedules.length === 0 ? (
//                 <div className="text-center py-12 border border-dashed rounded-lg">
//                   <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                   <p className="text-lg text-gray-500 font-medium">Chưa có lịch làm việc</p>
//                   <p className="text-sm text-gray-400 mt-1">Thêm lịch làm việc mới tại {selectedClinic.name}</p>
//                   <Button className="mt-4" onClick={() => setIsScheduleDialogOpen(true)}>
//                     <Plus className="mr-2 h-4 w-4" /> Thêm lịch làm việc
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"].map((day, index) => {
//                     const daySchedules = schedules.filter(s => {
//                       const scheduleDate = new Date(s.date);
//                       return scheduleDate.getDay() === index + 1 || (index === 6 && scheduleDate.getDay() === 0);
//                     });
                    
//                     return (
//                       <div key={day}>
//                         <h3 className="text-sm font-medium mb-2">{day}</h3>
//                         {daySchedules.length === 0 ? (
//                           <div className="bg-gray-50 rounded-lg p-4 text-center">
//                             <p className="text-gray-500 text-sm">Không có lịch làm việc</p>
//                           </div>
//                         ) : (
//                           <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
//                             {daySchedules.map((schedule, i) => (
//                               <motion.div
//                                 key={schedule.id || i}
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ delay: i * 0.1 }}
//                                 className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
//                               >
//                                 <div className="flex justify-between items-start">
//                                   <div>
//                                     <p className="font-medium">{new Date(schedule.date).toLocaleDateString('vi-VN')}</p>
//                                     <p className="text-sm text-gray-500">
//                                       {schedule.startTime} - {schedule.endTime}
//                                     </p>
//                                   </div>
//                                   <div className="flex gap-1">
//                                     <Button size="icon" variant="ghost">
//                                       <Edit className="h-4 w-4" />
//                                     </Button>
//                                     <Button size="icon" variant="ghost" className="text-red-500">
//                                       <Trash className="h-4 w-4" />
//                                     </Button>
//                                   </div>
//                                 </div>
//                                 <div className="mt-3 flex items-center justify-between">
//                                   <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
//                                     Thời gian mỗi ca: {schedule.slotDuration || 30} phút
//                                   </span>
//                                   <span className="text-xs text-gray-500">
//                                     {Math.floor((new Date(`2000-01-01T${schedule.endTime}:00`) - new Date(`2000-01-01T${schedule.startTime}:00`)) / (1000 * 60 * (schedule.slotDuration || 30)))} ca khám
//                                   </span>
//                                 </div>
//                               </motion.div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Patients Tab - Add similar structure */}
//         <TabsContent value="patients" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Quản lý bệnh nhân</CardTitle>
//               <CardDescription>Danh sách bệnh nhân của bạn</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {/* Patient management content */}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Handbooks Tab */}
//         <TabsContent value="handbooks" className="space-y-6">
//           <Card>
//             <CardHeader className="flex flex-row items-start justify-between">
//               <div>
//                 <CardTitle>Cẩm nang sức khỏe</CardTitle>
//                 <CardDescription>Quản lý bài viết cẩm nang sức khỏe của bạn</CardDescription>
//               </div>
//               <Dialog open={isHandbookDialogOpen} onOpenChange={setIsHandbookDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button>
//                     <Plus className="mr-2 h-4 w-4" /> Viết bài mới
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-3xl">
//                   <DialogHeader>
//                     <DialogTitle>Tạo cẩm nang sức khỏe mới</DialogTitle>
//                     <DialogDescription>
//                       Chia sẻ kiến thức và kinh nghiệm y khoa của bạn
//                     </DialogDescription>
//                   </DialogHeader>
//                   <div className="grid gap-4 py-4">
//                     <div className="grid items-center gap-2">
//                       <Label htmlFor="title">Tiêu đề bài viết</Label>
//                       <Input id="title" placeholder="Nhập tiêu đề bài viết" />
//                     </div>
//                     <div className="grid items-center gap-2">
//                       <Label htmlFor="description">Mô tả ngắn</Label>
//                       <Textarea id="description" placeholder="Nhập mô tả ngắn về bài viết" />
//                     </div>
//                     <div className="grid items-center gap-2">
//                       <Label htmlFor="category">Danh mục</Label>
//                       <Select>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Chọn danh mục" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="nutrition">Dinh dưỡng</SelectItem>
//                           <SelectItem value="disease">Phòng ngừa dịch bệnh</SelectItem>
//                           <SelectItem value="mental-health">Sức khỏe tâm thần</SelectItem>
//                           <SelectItem value="exercise">Tập luyện</SelectItem>
//                           <SelectItem value="elder-care">Chăm sóc người già</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="grid items-center gap-2">
//                       <Label htmlFor="content">Nội dung bài viết</Label>
//                       <Textarea id="content" placeholder="Nhập nội dung chi tiết..." className="min-h-[300px]" />
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button variant="outline" onClick={() => setIsHandbookDialogOpen(false)}>Hủy</Button>
//                     <Button onClick={() => handleCreateHandbook({
//                       title: document.getElementById('title').value,
//                       description: document.getElementById('description').value,
//                       category: document.querySelector('[data-value]')?.getAttribute('data-value') || "nutrition",
//                       content: document.getElementById('content').value
//                     })}>
//                       Đăng bài
//                     </Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>
//             </CardHeader>
//             <CardContent>
//               {loading ? (
//                 <div className="py-12 text-center">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                   <p className="mt-4 text-gray-500">Đang tải cẩm nang sức khỏe...</p>
//                 </div>
//               ) : healthHandbooks.length === 0 ? (
//                 <div className="text-center py-12 border border-dashed rounded-lg">
//                   <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
//                   <p className="text-lg text-gray-500 font-medium">Chưa có bài viết nào</p>
//                   <p className="text-sm text-gray-400 mt-1">Viết cẩm nang sức khỏe đầu tiên của bạn</p>
//                   <Button className="mt-4" onClick={() => setIsHandbookDialogOpen(true)}>
//                     <Plus className="mr-2 h-4 w-4" /> Viết bài mới
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="grid gap-6 md:grid-cols-2">
//                   {healthHandbooks.slice(0, 6).map((handbook, index) => (
//                     <motion.div
//                       key={handbook.id || index}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
//                     >
//                       <div className="p-4">
//                         <div className="flex justify-between items-start">
//                           <div>
//                             <Badge className="mb-2 bg-blue-100 text-blue-700 hover:bg-blue-100">
//                               {handbook.category || "Dinh dưỡng"}
//                             </Badge>
//                             <h3 className="font-semibold text-lg line-clamp-2">{handbook.title || `Cách phòng ngừa bệnh ${index + 1}`}</h3>
//                           </div>
//                           <div className="flex gap-1">
//                             <Button size="icon" variant="ghost">
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                             <Button size="icon" variant="ghost" className="text-red-500">
//                               <Trash className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </div>
//                         <p className="mt-2 text-gray-600 text-sm line-clamp-2">
//                           {handbook.description || "Mô tả ngắn về cách phòng ngừa và chăm sóc sức khỏe. Bài viết chia sẻ các kiến thức y khoa hữu ích."}
//                         </p>
//                         <div className="mt-4 flex justify-between items-center">
//                           <div className="flex items-center gap-1 text-xs text-gray-500">
//                             <Calendar className="h-3 w-3" />
//                             <span>{new Date(handbook.createdAt || Date.now()).toLocaleDateString("vi-VN")}</span>
//                           </div>
//                           <div className="flex items-center gap-1 text-xs text-gray-500">
//                             <Users className="h-3 w-3" />
//                             <span>{handbook.views || Math.floor(Math.random() * 1000)} lượt xem</span>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
//                         <span className={`text-xs px-2 py-0.5 rounded-full ${
//                           handbook.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
//                         }`}>
//                           {handbook.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
//                         </span>
//                         <Button size="sm" variant="ghost" className="h-8 gap-1 text-blue-600">
//                           Xem <ArrowUpRight className="h-3 w-3" />
//                         </Button>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
//               )}

//               <div className="mt-4 flex justify-end">
//                 <Button variant="outline" size="sm">Xem tất cả bài viết</Button>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Earnings Tab */}
//         <TabsContent value="earnings" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Thống kê thu nhập</CardTitle>
//               <CardDescription>Tổng quan về doanh thu của bạn</CardDescription>
//             </CardHeader>
//             <CardContent>
//               {/* Earnings content */}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </motion.div>
//   );
// };

// export default DashboardDoctor;

import React from 'react'

const DashboardDoctor = () => {
  return (
    <div>DashboardDoctor</div>
  )
}

export default DashboardDoctor