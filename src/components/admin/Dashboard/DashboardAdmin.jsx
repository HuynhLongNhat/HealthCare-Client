// import React, { useState } from 'react';
// import {
//   Users, User, UserCog, Calendar, Clock, CheckCircle, XCircle, DollarSign,
//   Building, Stethoscope, BookOpen, Star, BarChart2, PieChart, TrendingUp, FileText
// } from 'lucide-react';
// import {
//   Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// // Mock data
// const mockData = {
//   userStats: {
//     total: 5624,
//     doctors: 213,
//     patients: 5312,
//     admins: 18,
//     newThisMonth: 124,
//     growthRate: 5.2
//   },
//   appointmentStats: {
//     total: 3891,
//     pending: 312,
//     approved: 2987,
//     rejected: 182,
//     cancelled: 410,
//     todayAppointments: 78
//   },
//   paymentStats: {
//     totalAmount: 289650,
//     thisMonth: 24750,
//     pending: 8920,
//     completed: 15830,
//     averagePerAppointment: 650
//   },
//   facilityStats: {
//     total: 86,
//     hospitals: 36,
//     clinics: 42,
//     labs: 8,
//     topRated: "Trung tâm Y khoa ABC"
//   },
//   specialtyStats: {
//     total: 28,
//     mostPopular: "Nội Khoa",
//     leastPopular: "Y học Cổ truyền",
//     distribution: [
//       { name: "Nội Khoa", count: 42 },
//       { name: "Ngoại Khoa", count: 38 },
//       { name: "Nhi Khoa", count: 35 },
//       { name: "Da liễu", count: 30 },
//       { name: "Sản phụ khoa", count: 27 }
//     ]
//   },
//   healthGuideStats: {
//     total: 156,
//     mostViewed: "Phòng ngừa COVID-19",
//     newThisMonth: 14,
//     categories: [
//       { name: "Dinh dưỡng", count: 45 },
//       { name: "Phòng ngừa dịch bệnh", count: 38 },
//       { name: "Sức khỏe tâm thần", count: 32 },
//       { name: "Tập luyện", count: 26 },
//       { name: "Chăm sóc người già", count: 15 }
//     ]
//   },
//   doctorRatings: {
//     averageRating: 4.3,
//     fiveStar: 142,
//     fourStar: 48,
//     threeStar: 18,
//     twoStar: 4,
//     oneStar: 1,
//     topRatedDoctor: "TS. BS. Nguyễn Văn A - 4.9/5",
//     totalReviews: 2874
//   },
//   recentAppointments: [
//     { id: 1, patient: "Nguyễn Văn X", doctor: "BS. Trần Thị Y", specialty: "Nội Khoa", date: "19/05/2025", status: "Đã phê duyệt" },
//     { id: 2, patient: "Phạm Thị Z", doctor: "BS. Lê Văn B", specialty: "Nhi Khoa", date: "19/05/2025", status: "Chờ phê duyệt" },
//     { id: 3, patient: "Hoàng Văn C", doctor: "BS. Phạm Thị D", specialty: "Da liễu", date: "20/05/2025", status: "Đã phê duyệt" },
//     { id: 4, patient: "Trần Thị E", doctor: "BS. Vũ Văn F", specialty: "Tim mạch", date: "20/05/2025", status: "Đã hủy" },
//     { id: 5, patient: "Lê Văn G", doctor: "BS. Nguyễn Thị H", specialty: "Thần kinh", date: "21/05/2025", status: "Từ chối" },
//   ]
// };

// const DashboardAdmin = () => {
//   const [timeRange, setTimeRange] = useState("week");

//   return (
//     <div className="flex flex-col p-6 space-y-6 bg-gray-50 min-h-screen mt-20">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold tracking-tight">Dashboard Admin</h1>
//         <div className="flex items-center space-x-4">
//           <Select defaultValue={timeRange} onValueChange={setTimeRange}>
//             <SelectTrigger className="w-[180px]">
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
//           <Button variant="outline">Làm mới</Button>
//           <Button>Xuất báo cáo</Button>
//         </div>
//       </div>

//       {/* Overview Cards */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{mockData.userStats.total.toLocaleString()}</div>
//             <p className="text-xs text-muted-foreground">
//               +{mockData.userStats.newThisMonth} người dùng mới tháng này
//             </p>
//             <div className="mt-3">
//               <Progress value={mockData.userStats.growthRate * 10} className="h-2" />
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Lịch hẹn hôm nay</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{mockData.appointmentStats.todayAppointments}</div>
//             <p className="text-xs text-muted-foreground">
//               {Math.round(mockData.appointmentStats.todayAppointments / mockData.appointmentStats.total * 100)}% tổng lịch hẹn
//             </p>
//             <div className="mt-3">
//               <Progress value={mockData.appointmentStats.todayAppointments / mockData.appointmentStats.total * 100} className="h-2" />
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{mockData.paymentStats.totalAmount.toLocaleString()} VNĐ</div>
//             <p className="text-xs text-muted-foreground">
//               {mockData.paymentStats.thisMonth.toLocaleString()} VNĐ tháng này
//             </p>
//             <div className="mt-3">
//               <Progress value={mockData.paymentStats.thisMonth / mockData.paymentStats.totalAmount * 100} className="h-2" />
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Đánh giá bác sĩ</CardTitle>
//             <Star className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{mockData.doctorRatings.averageRating}/5</div>
//             <p className="text-xs text-muted-foreground">
//               {mockData.doctorRatings.totalReviews.toLocaleString()} đánh giá
//             </p>
//             <div className="mt-3">
//               <Progress value={mockData.doctorRatings.averageRating / 5 * 100} className="h-2" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Main Content */}
//       <Tabs defaultValue="users" className="space-y-6">
//         <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-7 gap-2">
//           <TabsTrigger value="users">Người dùng</TabsTrigger>
//           <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
//           <TabsTrigger value="payments">Thanh toán</TabsTrigger>
//           <TabsTrigger value="facilities">Cơ sở y tế</TabsTrigger>
//           <TabsTrigger value="specialties">Chuyên khoa</TabsTrigger>
//           <TabsTrigger value="guides">Cẩm nang</TabsTrigger>
//           <TabsTrigger value="ratings">Đánh giá</TabsTrigger>
//         </TabsList>

//         {/* Users Tab */}
//         <TabsContent value="users" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-3">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Phân bố người dùng</CardTitle>
//                 <CardDescription>Thống kê theo loại tài khoản</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="relative h-52 w-full">
//                   {/* Simulated donut chart with CSS */}
//                   <div className="flex flex-col items-center justify-center h-full w-full">
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="relative w-40 h-40 rounded-full border-8 border-transparent"
//                            style={{background: 'conic-gradient(#4338ca 0% 5%, #0ea5e9 5% 10%, #f97316 10% 100%)'}}>
//                         <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
//                           <div className="text-center">
//                             <span className="text-2xl font-bold">{mockData.userStats.total}</span>
//                             <p className="text-xs">Tổng người dùng</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4 mt-4">
//                   <div className="flex flex-col items-center">
//                     <UserCog className="h-5 w-5 text-indigo-700 mb-1" />
//                     <span className="text-sm font-medium">{mockData.userStats.admins}</span>
//                     <span className="text-xs text-gray-500">Admin</span>
//                   </div>
//                   <div className="flex flex-col items-center">
//                     <User className="h-5 w-5 text-blue-500 mb-1" />
//                     <span className="text-sm font-medium">{mockData.userStats.doctors}</span>
//                     <span className="text-xs text-gray-500">Bác sĩ</span>
//                   </div>
//                   <div className="flex flex-col items-center">
//                     <Users className="h-5 w-5 text-orange-500 mb-1" />
//                     <span className="text-sm font-medium">{mockData.userStats.patients}</span>
//                     <span className="text-xs text-gray-500">Bệnh nhân</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="md:col-span-2">
//               <CardHeader>
//                 <CardTitle>Xu hướng đăng ký người dùng</CardTitle>
//                 <CardDescription>Biểu đồ tăng trưởng theo {timeRange === 'day' ? 'giờ' : timeRange === 'week' ? 'ngày' : timeRange === 'month' ? 'tuần' : timeRange === 'quarter' ? 'tháng' : 'quý'}</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-[300px] w-full relative">
//                   {/* Simulated line chart with CSS */}
//                   <div className="absolute bottom-0 left-0 right-0 h-[200px] border-b border-l">
//                     <div className="relative h-full w-full">
//                       {/* Line chart path simulation */}
//                       <div className="absolute inset-0 flex items-end">
//                         <div className="w-full h-[70%] bg-gradient-to-t from-blue-100 to-transparent relative">
//                           <div className="absolute bottom-0 left-0 right-0 border-t-2 border-blue-500"
//                                style={{
//                                  height: '1px',
//                                  background: 'linear-gradient(90deg, transparent 0%, blue 50%, transparent 100%)'
//                                }}>
//                           </div>
//                         </div>
//                       </div>
                      
//                       {/* Data point simulations */}
//                       <div className="absolute bottom-[45%] left-[10%] w-2 h-2 bg-blue-600 rounded-full"></div>
//                       <div className="absolute bottom-[50%] left-[25%] w-2 h-2 bg-blue-600 rounded-full"></div>
//                       <div className="absolute bottom-[65%] left-[40%] w-2 h-2 bg-blue-600 rounded-full"></div>
//                       <div className="absolute bottom-[55%] left-[55%] w-2 h-2 bg-blue-600 rounded-full"></div>
//                       <div className="absolute bottom-[70%] left-[70%] w-2 h-2 bg-blue-600 rounded-full"></div>
//                       <div className="absolute bottom-[80%] left-[85%] w-2 h-2 bg-blue-600 rounded-full"></div>
//                     </div>
//                   </div>
                  
//                   {/* X-axis labels */}
//                   <div className="absolute bottom-[-25px] left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
//                     {timeRange === 'week' && (
//                       <>
//                         <span>Thứ 2</span>
//                         <span>Thứ 3</span>
//                         <span>Thứ 4</span>
//                         <span>Thứ 5</span>
//                         <span>Thứ 6</span>
//                         <span>Thứ 7</span>
//                         <span>CN</span>
//                       </>
//                     )}
//                     {timeRange === 'month' && (
//                       <>
//                         <span>Tuần 1</span>
//                         <span>Tuần 2</span>
//                         <span>Tuần 3</span>
//                         <span>Tuần 4</span>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter className="text-xs text-muted-foreground">
//                 Cập nhật lần cuối: Hôm nay, 15:30
//               </CardFooter>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Appointments Tab */}
//         <TabsContent value="appointments" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Thống kê lịch hẹn</CardTitle>
//                 <CardDescription>Phân bố theo trạng thái</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <Clock className="h-4 w-4 text-amber-500 mr-2" />
//                       <span className="text-sm">Chờ phê duyệt</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <span className="text-sm font-medium">{mockData.appointmentStats.pending}</span>
//                       <span className="text-xs text-muted-foreground">({Math.round(mockData.appointmentStats.pending / mockData.appointmentStats.total * 100)}%)</span>
//                     </div>
//                   </div>
//                   <Progress value={mockData.appointmentStats.pending / mockData.appointmentStats.total * 100} className="h-2 bg-gray-200" indicatorClassName="bg-amber-500" />
                  
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                       <span className="text-sm">Đã phê duyệt</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <span className="text-sm font-medium">{mockData.appointmentStats.approved}</span>
//                       <span className="text-xs text-muted-foreground">({Math.round(mockData.appointmentStats.approved / mockData.appointmentStats.total * 100)}%)</span>
//                     </div>
//                   </div>
//                   <Progress value={mockData.appointmentStats.approved / mockData.appointmentStats.total * 100} className="h-2 bg-gray-200" indicatorClassName="bg-green-500" />
                  
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <XCircle className="h-4 w-4 text-red-500 mr-2" />
//                       <span className="text-sm">Từ chối</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <span className="text-sm font-medium">{mockData.appointmentStats.rejected}</span>
//                       <span className="text-xs text-muted-foreground">({Math.round(mockData.appointmentStats.rejected / mockData.appointmentStats.total * 100)}%)</span>
//                     </div>
//                   </div>
//                   <Progress value={mockData.appointmentStats.rejected / mockData.appointmentStats.total * 100} className="h-2 bg-gray-200" indicatorClassName="bg-red-500" />
                  
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <XCircle className="h-4 w-4 text-gray-500 mr-2" />
//                       <span className="text-sm">Đã hủy</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <span className="text-sm font-medium">{mockData.appointmentStats.cancelled}</span>
//                       <span className="text-xs text-muted-foreground">({Math.round(mockData.appointmentStats.cancelled / mockData.appointmentStats.total * 100)}%)</span>
//                     </div>
//                   </div>
//                   <Progress value={mockData.appointmentStats.cancelled / mockData.appointmentStats.total * 100} className="h-2 bg-gray-200" indicatorClassName="bg-gray-500" />
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Lịch hẹn gần đây</CardTitle>
//                 <CardDescription>Cập nhật liên tục</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {mockData.recentAppointments.map((appointment) => (
//                     <div key={appointment.id} className="flex items-center justify-between border-b pb-3">
//                       <div className="space-y-1">
//                         <div className="flex items-center space-x-2">
//                           <p className="text-sm font-medium">{appointment.patient}</p>
//                           <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{appointment.specialty}</span>
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                           Bác sĩ: {appointment.doctor}
//                         </p>
//                         <p className="text-xs text-muted-foreground">
//                           Ngày: {appointment.date}
//                         </p>
//                       </div>
//                       <span className={`text-xs px-2 py-1 rounded-full ${
//                         appointment.status === 'Đã phê duyệt' ? 'bg-green-100 text-green-700' :
//                         appointment.status === 'Chờ phê duyệt' ? 'bg-amber-100 text-amber-700' :
//                         appointment.status === 'Từ chối' ? 'bg-red-100 text-red-700' :
//                         'bg-gray-100 text-gray-700'
//                       }`}>
//                         {appointment.status}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button variant="ghost" className="w-full">Xem tất cả lịch hẹn</Button>
//               </CardFooter>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Other tabs would follow similar patterns */}
//         <TabsContent value="payments" className="space-y-6">
//           <div className="grid gap-6 md:grid-cols-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Thống kê thanh toán</CardTitle>
//                 <CardDescription>Tổng quan về doanh thu</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   <div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-muted-foreground">Tổng doanh thu</span>
//                       <span className="text-lg font-bold">{mockData.paymentStats.totalAmount.toLocaleString()} VNĐ</span>
//                     </div>
//                     <Progress value={100} className="h-2 mt-2" />
//                   </div>
                  
//                   <div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-muted-foreground">Doanh thu tháng này</span>
//                       <span className="text-lg font-bold">{mockData.paymentStats.thisMonth.toLocaleString()} VNĐ</span>
//                     </div>
//                     <Progress value={mockData.paymentStats.thisMonth / mockData.paymentStats.totalAmount * 100} className="h-2 mt-2" />
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-4 pt-4 border-t">
//                     <div className="space-y-2">
//                       <p className="text-sm text-muted-foreground">Đã thanh toán</p>
//                       <p className="text-xl font-bold text-green-600">{mockData.paymentStats.completed.toLocaleString()} VNĐ</p>
//                       <p className="text-xs text-muted-foreground">
//                         {Math.round(mockData.paymentStats.completed / mockData.paymentStats.thisMonth * 100)}% doanh thu tháng này
//                       </p>
//                     </div>
                    
//                     <div className="space-y-2">
//                       <p className="text-sm text-muted-foreground">Chờ thanh toán</p>
//                       <p className="text-xl font-bold text-amber-600">{mockData.paymentStats.pending.toLocaleString()} VNĐ</p>
//                       <p className="text-xs text-muted-foreground">
//                         {Math.round(mockData.paymentStats.pending / mockData.paymentStats.thisMonth * 100)}% doanh thu tháng này
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Thống kê thanh toán theo thời gian</CardTitle>
//                 <CardDescription>Biểu đồ doanh thu trong {timeRange === 'week' ? '7 ngày qua' : timeRange === 'month' ? '30 ngày qua' : '12 tháng qua'}</CardDescription>
//               </CardHeader>
//               <CardContent className="h-[300px] relative">
//                 {/* Simulated bar chart */}
//                 <div className="absolute bottom-0 left-0 right-0 h-[220px] border-b border-l">
//                   <div className="flex justify-between items-end h-full px-2">
//                     <div className="w-8 bg-blue-500 h-[30%] rounded-t"></div>
//                     <div className="w-8 bg-blue-500 h-[40%] rounded-t"></div>
//                     <div className="w-8 bg-blue-500 h-[60%] rounded-t"></div>
//                     <div className="w-8 bg-blue-500 h-[70%] rounded-t"></div>
//                     <div className="w-8 bg-blue-500 h-[55%] rounded-t"></div>
//                     <div className="w-8 bg-blue-500 h-[85%] rounded-t"></div>
//                     <div className="w-8 bg-blue-500 h-[65%] rounded-t"></div>
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
//                 Trung bình mỗi lịch hẹn: {mockData.paymentStats.averagePerAppointment.toLocaleString()} VNĐ
//               </CardFooter>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* Continue with other tabs... */}
//       </Tabs>
//     </div>
//   );
// };

// export default DashboardAdmin;
import React, { useState, useEffect } from 'react';
import { 
  Users, User, UserCog, Calendar, Clock, CheckCircle, XCircle, DollarSign, 
  Building, Stethoscope, BookOpen, Star, BarChart2, PieChart, TrendingUp, FileText,
  Download, RefreshCw, Filter, Search, Plus, ArrowUpRight, Trash, Edit
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { getAllUsers, updateRoleUser, createNewUser, deleteUser } from "../../../api/auth.api";
import { getAllDoctors, getAllSpecializations, createRatingDoctor } from "../../../api/doctor.api";
import { getAllMyBooking } from "../../../api/appointment.api";
import useAuthToken from '@/utils/userAuthToken';
import { getAllMyPayment } from '@/api/payment.api';

const DashboardAdmin = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: { total: 0, doctors: 0, patients: 0, admins: 0 },
    appointments: { total: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0 },
    payments: { total: 0, completed: 0, pending: 0 },
    specializations: { total: 0, list: [] }
  });
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const auth = useAuthToken()
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all required data
      const [usersData, doctorsData, appointmentsData, paymentsData, specializationsData] = await Promise.all([
        getAllUsers(),
        getAllDoctors(),
        getAllMyBooking(auth.userId), // Admin can view all bookings
        getAllMyPayment(auth.userId), // Admin can view all payments
        getAllSpecializations(),
      ]);

      // Process users data
      const userStats = {
        total: usersData.data.length,
        doctors: usersData.data.filter(user => user.role === "doctor").length,
        patients: usersData.data.filter(user => user.role === "patient").length,
        admins: usersData.data.filter(user => user.role === "admin").length
      };

      // Process appointments data
      const appointmentStats = {
        total: appointmentsData.data.length,
        pending: appointmentsData.data.filter(appointment => appointment.status === "pending").length,
        approved: appointmentsData.data.filter(appointment => appointment.status === "approved").length,
        rejected: appointmentsData.data.filter(appointment => appointment.status === "rejected").length,
        cancelled: appointmentsData.data.filter(appointment => appointment.status === "cancelled").length,
        todayAppointments: appointmentsData.data.filter(appointment => {
          const today = new Date().toISOString().split('T')[0];
          return appointment.appointmentDate === today;
        }).length
      };

      // Process payments data
      const paymentStats = {
        total: paymentsData.data.reduce((sum, payment) => sum + payment.amount, 0),
        completed: paymentsData.data.filter(payment => payment.status === "completed")
                              .reduce((sum, payment) => sum + payment.amount, 0),
        pending: paymentsData.data.filter(payment => payment.status === "pending")
                              .reduce((sum, payment) => sum + payment.amount, 0),
        thisMonth: paymentsData.data.filter(payment => {
          const thisMonth = new Date().getMonth();
          const paymentMonth = new Date(payment.createdAt).getMonth();
          return paymentMonth === thisMonth;
        }).reduce((sum, payment) => sum + payment.amount, 0)
      };

      // Update state
      setStats({
        users: userStats,
        appointments: appointmentStats,
        payments: paymentStats,
        specializations: { 
          total: specializationsData.data.length,
          list: specializationsData.data
        }
      });

      setUsers(usersData.data);
      setDoctors(doctorsData.data);
      setAppointments(appointmentsData.data);
      setPayments(paymentsData.data);
      setSpecializations(specializationsData.data);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchDashboardData();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter appointments based on search query
  const filteredAppointments = appointments.filter(appointment => 
    appointment.patientName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    appointment.doctorName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      refreshData();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateRoleUser(userId, { role: newRole });
      refreshData();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col p-6 mt-20 space-y-6 bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700"
        >
        Thống kê
        </motion.h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Tìm kiếm..." 
              className="pl-9 w-[180px] md:w-[260px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Chọn thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon"
            onClick={refreshData}
            className={isRefreshing ? "animate-spin" : ""}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Xuất báo cáo
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 w-24 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-36 bg-gray-200 rounded mb-3"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent className="pt-6">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-2xl font-bold"
              >
                {stats.users.total.toLocaleString()}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">
                +124 người dùng mới tháng này
              </p>
              <div className="mt-3">
                <Progress value={75} className="h-2" />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-center">
                <div className="bg-indigo-50 rounded p-1">
                  <p className="font-semibold text-indigo-600">{stats.users.admins}</p>
                  <p className="text-gray-500">Admin</p>
                </div>
                <div className="bg-blue-50 rounded p-1">
                  <p className="font-semibold text-blue-600">{stats.users.doctors}</p>
                  <p className="text-gray-500">Bác sĩ</p>
                </div>
                <div className="bg-cyan-50 rounded p-1">
                  <p className="font-semibold text-cyan-600">{stats.users.patients}</p>
                  <p className="text-gray-500">Bệnh nhân</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-amber-50 to-amber-100">
              <CardTitle className="text-sm font-medium">Lịch hẹn hôm nay</CardTitle>
              <Calendar className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent className="pt-6">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-2xl font-bold"
              >
                {stats.appointments.todayAppointments}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(stats.appointments.todayAppointments / stats.appointments.total * 100)}% tổng lịch hẹn
              </p>
              <div className="mt-3">
                <Progress value={stats.appointments.todayAppointments / stats.appointments.total * 100} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="bg-green-100 p-1 rounded">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <p className="text-gray-600">{stats.appointments.approved} đã duyệt</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="bg-amber-100 p-1 rounded">
                    <Clock className="h-3 w-3 text-amber-600" />
                  </div>
                  <p className="text-gray-600">{stats.appointments.pending} chờ duyệt</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent className="pt-6">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-2xl font-bold"
              >
                {stats?.payments?.total?.toLocaleString()} VNĐ
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats?.payments?.thisMonth?.toLocaleString()} VNĐ tháng này
              </p>
              <div className="mt-3">
                <Progress value={stats.payments.thisMonth / stats.payments.total * 100} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="bg-green-100 p-1 rounded">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <p className="text-gray-600">{stats.payments.completed.toLocaleString()} đã TT</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="bg-amber-100 p-1 rounded">
                    <Clock className="h-3 w-3 text-amber-600" />
                  </div>
                  <p className="text-gray-600">{stats.payments.pending.toLocaleString()} chờ TT</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="text-sm font-medium">Chuyên khoa</CardTitle>
              <Stethoscope className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent className="pt-6">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-2xl font-bold"
              >
                {stats.specializations.total}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">
                Phân bố trong {stats.users.doctors} bác sĩ
              </p>
              <div className="mt-3">
                <Progress value={85} className="h-2" />
              </div>
              <div className="mt-3 text-xs">
                <p className="font-medium">Phổ biến nhất:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {stats.specializations.list.slice(0, 3).map(spec => (
                    <Badge key={spec.id} variant="secondary" className="text-xs">{spec.name}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-7 gap-2">
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
          <TabsTrigger value="payments">Thanh toán</TabsTrigger>
          <TabsTrigger value="facilities">Cơ sở y tế</TabsTrigger>
          <TabsTrigger value="specialties">Chuyên khoa</TabsTrigger>
          <TabsTrigger value="guides">Cẩm nang</TabsTrigger>
          <TabsTrigger value="ratings">Đánh giá</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
        

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Phân bố người dùng</CardTitle>
                <CardDescription>Thống kê theo loại tài khoản</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-52 w-full">
                  {/* Donut chart with animation */}
                  <motion.div 
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex flex-col items-center justify-center h-full w-full"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-40 h-40 rounded-full border-8 border-transparent" 
                           style={{
                             background: `conic-gradient(
                               #4338ca 0% ${stats.users.admins / stats.users.total * 100}%, 
                               #0ea5e9 ${stats.users.admins / stats.users.total * 100}% ${(stats.users.admins + stats.users.doctors) / stats.users.total * 100}%, 
                               #f97316 ${(stats.users.admins + stats.users.doctors) / stats.users.total * 100}% 100%)`
                           }}
                      >
                        <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
                          <div className="text-center">
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              className="text-2xl font-bold"
                            >
                              {stats.users.total}
                            </motion.span>
                            <p className="text-xs">Tổng người dùng</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center"
                  >
                    <UserCog className="h-5 w-5 text-indigo-700 mb-1" />
                    <span className="text-sm font-medium">{stats.users.admins}</span>
                    <span className="text-xs text-gray-500">Admin</span>
                  </motion.div>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col items-center"
                  >
                    <User className="h-5 w-5 text-blue-500 mb-1" />
                    <span className="text-sm font-medium">{stats.users.doctors}</span>
                    <span className="text-xs text-gray-500">Bác sĩ</span>
                  </motion.div>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center"
                  >
                    <Users className="h-5 w-5 text-orange-500 mb-1" />
                    <span className="text-sm font-medium">{stats.users.patients}</span>
                    <span className="text-xs text-gray-500">Bệnh nhân</span>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Xu hướng đăng ký người dùng</CardTitle>
                <CardDescription>
                  Biểu đồ tăng trưởng theo {timeRange === 'day' ? 'giờ' : timeRange === 'week' ? 'ngày' : timeRange === 'month' ? 'tuần' : timeRange === 'quarter' ? 'tháng' : 'quý'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full relative">
                  {/* Animated line chart */}
                  <div className="absolute bottom-0 left-0 right-0 h-[200px] border-b border-l">
                    <motion.div 
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="relative h-full w-full"
                    >
                      {/* Line chart path */}
                      <svg className="absolute inset-0 h-full w-full overflow-visible">
                        <motion.path
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                          d="M 0,150 L 40,120 L 80,100 L 120,70 L 160,90 L 200,60 L 240,40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeLinecap="round"
                          className="drop-shadow-md"
                        />
                      </svg>
                      
                      {/* Animated data points */}
                      {[
                        { bottom: "45%", left: "10%", delay: 0.6 },
                        { bottom: "50%", left: "25%", delay: 0.7 },
                        { bottom: "65%", left: "40%", delay: 0.8 },
                        { bottom: "55%", left: "55%", delay: 0.9 },
                        { bottom: "70%", left: "70%", delay: 1.0 },
                        { bottom: "80%", left: "85%", delay: 1.1 }
                      ].map((point, index) => (
                        <motion.div
                          key={index}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: point.delay, duration: 0.3 }}
                          className="absolute w-3 h-3 bg-blue-600 rounded-full shadow-lg"
                          style={{ bottom: point.bottom, left: point.left }}
                        />
                      ))}
                    </motion.div>
                  </div>
                  
                  {/* X-axis labels */}
                  <div className="absolute bottom-[-25px] left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
                    {timeRange === 'week' && (
                      <>
                        <span>Thứ 2</span>
                        <span>Thứ 3</span>
                        <span>Thứ 4</span>
                        <span>Thứ 5</span>
                        <span>Thứ 6</span>
                        <span>Thứ 7</span>
                        <span>CN</span>
                      </>
                    )}
                    {timeRange === 'month' && (
                      <>
                        <span>Tuần 1</span>
                        <span>Tuần 2</span>
                        <span>Tuần 3</span>
                        <span>Tuần 4</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Cập nhật lần cuối: Hôm nay, 15:30
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê lịch hẹn</CardTitle>
                <CardDescription>Phân bố theo trạng thái</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-amber-500 mr-2" />
                      <span className="text-sm">Chờ phê duyệt</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{stats.appointments.pending}</span>
                      <span className="text-xs text-muted-foreground">({Math.round(stats.appointments.pending / stats.appointments.total * 100)}%)</span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.1 }}
                  >
                    <Progress value={stats.appointments.pending / stats.appointments.total * 100} className="h-2 bg-gray-200" indicatorClassName="bg-amber-500" />
                  </motion.div>
                  
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Đã phê duyệt</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{stats.appointments.approved}</span>
                      <span className="text-xs text-muted-foreground">({Math.round(stats.appointments.approved / stats.appointments.total * 100)}%)</span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    <Progress value={stats.appointments.approved / stats.appointments.total * 100} className="h-2 bg-gray-200" indicatorClassName="bg-green-500" />
                  </motion.div>
                  
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      <span className="text-sm">Từ chối</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{stats.appointments.rejected}</span>
                      <span className="text-xs text-muted-foreground">({Math.round(stats.appointments.rejected / stats.appointments.total * 100)}%)</span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                  >
                    <Progress value={stats.appointments.rejected / stats.appointments.total * 100} className="h-2 bg-gray-200" indicatorClassName="bg-red-500" />
                  </motion.div>
                  
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm">Đã hủy</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{stats.appointments.cancelled}</span>
                      <span className="text-xs text-muted-foreground">({Math.round(stats.appointments.cancelled / stats.appointments.total * 100)}%)</span>
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                  >
                    <Progress value={stats.appointments.cancelled / stats.appointments.total * 100} className="h-2 bg-gray-200" indicatorClassName="bg-gray-500" />
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lịch hẹn gần đây</CardTitle>
                <CardDescription>Cập nhật liên tục</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {appointments.slice(0, 5).map((appointment, index) => (
                      <motion.div 
                        key={appointment.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center justify-between border-b pb-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">{appointment.patientName || "Nguyễn Văn X"}</p>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{appointment.specialization || "Nội Khoa"}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Bác sĩ: {appointment.doctorName || "BS. Trần Thị Y"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Ngày: {appointment.appointmentDate || "19/05/2025"}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          appointment.status === "approved" ? 'bg-green-100 text-green-700' :
                          appointment.status === "pending" ? 'bg-amber-100 text-amber-700' :
                          appointment.status === "rejected" ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {appointment.status === "approved" ? "Đã phê duyệt" : 
                           appointment.status === "pending" ? "Chờ phê duyệt" :
                           appointment.status === "rejected" ? "Từ chối" : "Đã hủy"}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full">Xem tất cả lịch hẹn</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Thống kê thanh toán</CardTitle>
                <CardDescription>Tổng quan về doanh thu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tổng doanh thu</span>
                      <span className="text-lg font-bold">{stats.payments.total.toLocaleString()} VNĐ</span>
                    </div>
                    <Progress value={100} className="h-2 mt-2" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Doanh thu tháng này</span>
                      <span className="text-lg font-bold">{stats?.payments?.thisMonth?.toLocaleString()} VNĐ</span>
                    </div>
                    <Progress value={stats.payments.thisMonth / stats.payments.total * 100} className="h-2 mt-2" />
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 gap-4 pt-4 border-t"
                  >
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Đã thanh toán</p>
                      <p className="text-xl font-bold text-green-600">{stats.payments.completed.toLocaleString()} VNĐ</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(stats.payments.completed / stats.payments.thisMonth * 100)}% doanh thu tháng này
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Chờ thanh toán</p>
                      <p className="text-xl font-bold text-amber-600">{stats.payments.pending.toLocaleString()} VNĐ</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(stats.payments.pending / stats.payments.thisMonth * 100)}% doanh thu tháng này
                      </p>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thống kê thanh toán theo thời gian</CardTitle>
                <CardDescription>
                  Biểu đồ doanh thu trong {timeRange === 'week' ? '7 ngày qua' : timeRange === 'month' ? '30 ngày qua' : '12 tháng qua'}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] relative">
                {/* Animated bar chart */}
                <div className="absolute bottom-0 left-0 right-0 h-[220px] border-b border-l">
                  <div className="flex justify-between items-end h-full px-2">
                    {[30, 40, 60, 70, 55, 85, 65].map((height, index) => (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                        className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t shadow-lg"
                      />
                    ))}
                  </div>
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-[-25px] left-0 right-0 flex justify-between px-6 text-xs text-gray-500">
                  {timeRange === 'week' && (
                    <>
                      <span>T2</span>
                      <span>T3</span>
                      <span>T4</span>
                      <span>T5</span>
                      <span>T6</span>
                      <span>T7</span>
                      <span>CN</span>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Trung bình mỗi lịch hẹn: 650.000 VNĐ
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lịch sử thanh toán</CardTitle>
              <CardDescription>Chi tiết các giao dịch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã thanh toán</TableHead>
                      <TableHead>Bệnh nhân</TableHead>
                      <TableHead>Bác sĩ</TableHead>
                      <TableHead>Dịch vụ</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          </div>
                          <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
                        </TableCell>
                      </TableRow>
                    ) : payments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10">
                          <p className="text-gray-500">Không có dữ liệu thanh toán</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      payments.slice(0, 5).map((payment, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{payment.paymentId || `PAY-${1000 + i}`}</TableCell>
                          <TableCell>{payment.patientName || "Nguyễn Văn A"}</TableCell>
                          <TableCell>{payment.doctorName || "BS. Lê Thị B"}</TableCell>
                          <TableCell>Khám bệnh</TableCell>
                          <TableCell className="font-medium">{payment.amount?.toLocaleString() || "300.000"} VNĐ</TableCell>
                          <TableCell>{new Date(payment.createdAt || Date.now()).toLocaleDateString("vi-VN")}</TableCell>
                          <TableCell>
                            <Badge className={
                              payment.status === "completed" ? "bg-green-100 text-green-700" : 
                              "bg-amber-100 text-amber-700"
                            }>
                              {payment.status === "completed" ? "Đã thanh toán" : "Chờ thanh toán"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost">Chi tiết</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">Xem tất cả giao dịch</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs follow the same pattern */}
      </Tabs>
    </motion.div>
  );
};

export default DashboardAdmin;