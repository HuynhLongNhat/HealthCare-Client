
import  { useState, useEffect } from 'react';
import { 
  Users, Calendar, Clock, CheckCircle, DollarSign, 
   Stethoscope, 
  Download, RefreshCw, Search,
} from 'lucide-react';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion,  } from "framer-motion";
import { getAllUsers, } from "../../../api/auth.api";
import { getAllDoctors, getAllSpecializations } from "../../../api/doctor.api";
import { getAllMyBooking } from "../../../api/appointment.api";
import useAuthToken from '@/utils/userAuthToken';
import { getAllMyPayment } from '@/api/payment.api';
import UserStatistics from "../User/UserStatistics";
import DoctorStatistic from "../Doctor/Doctor/DoctorStatistic";
import AppointmentStatistic from "../Doctor/Appointment/AppointmentStatistic";
import PaymentStatistics from "../../client/Payment/PaymentStatistics ";
import ClinicStatistics from "../Doctor/Clinic/ClinicStatistics";
import SpecializationStatistic from "../Doctor/Specializations/SpecializationStatistic";
 
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
        getAllMyBooking(auth.userId), 
        getAllMyPayment(auth.userId), 
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
  <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-5 gap-2">
    <TabsTrigger value="users">Người dùng</TabsTrigger>
    <TabsTrigger value="appointments">Lịch hẹn</TabsTrigger>
    <TabsTrigger value="payments">Thanh toán</TabsTrigger>
    <TabsTrigger value="facilities">Cơ sở y tế</TabsTrigger>
    <TabsTrigger value="specialties">Chuyên khoa</TabsTrigger>
  </TabsList>

        {/* Users Tab */}
       <TabsContent value="users" className="space-y-6">
    <UserStatistics users={users} />
    <DoctorStatistic />
  </TabsContent>

  {/* Appointments Tab */}
  <TabsContent value="appointments" className="space-y-6">
    <AppointmentStatistic appointments={appointments} />
  </TabsContent>

  {/* Payments Tab */}
  <TabsContent value="payments" className="space-y-6">
    <PaymentStatistics userId={auth?.userId} />
  </TabsContent>

  {/* Facilities Tab */}
  <TabsContent value="facilities" className="space-y-6">
    <ClinicStatistics clinics={specializations} />
  </TabsContent>

  {/* Specialties Tab */}
  <TabsContent value="specialties" className="space-y-6">
    <SpecializationStatistic />
  </TabsContent>
        {/* Other tabs follow the same pattern */}
      </Tabs>
    </motion.div>
  );
};

export default DashboardAdmin;