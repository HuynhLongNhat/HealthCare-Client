/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  CalendarDays,
  UserCheck,
  UserCog,
  Activity,
  TrendingUp,
} from "lucide-react";
import {
  format,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  isAfter,
} from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

const UserStatistics = ({users}) => {
  const [timeRange, setTimeRange] = useState("day");



  // Count users by role
  const roleStats = useMemo(() => {
    const stats = [
      { name: "ADMIN", count: 0, color: "#4f46e5" },
      { name: "DOCTOR", count: 0, color: "#0ea5e9" },
      { name: "PATIENT", count: 0, color: "#10b981" },
    ];

    users.forEach((user) => {
      const roleName = user.role?.role || "N/A";
      const roleIndex = stats.findIndex((s) => s.name === roleName);
      if (roleIndex !== -1) {
        stats[roleIndex].count++;
      }
    });

    return stats;
  }, [users]);

  // Get new users by time range
  const getNewUsersByTimeRange = () => {
    const today = new Date();
    let compareDate;

    switch (timeRange) {
      case "day":
        compareDate = subDays(today, 1);
        break;
      case "week":
        compareDate = subWeeks(today, 1);
        break;
      case "month":
        compareDate = subMonths(today, 1);
        break;
      case "year":
        compareDate = subYears(today, 1);
        break;
      default:
        compareDate = subDays(today, 1);
    }

    return users.filter((user) => {
      const createdDate = new Date(user.createdAt);
      return isAfter(createdDate, compareDate);
    });
  };

  const newUsers = useMemo(() => getNewUsersByTimeRange(), [users, timeRange]);

  // Prepare data for growth chart
  const growthData = useMemo(() => {
    if (users.length === 0) return [];

    const data = [];
    const now = new Date();
    let periods;
    let dateFormat;
    let intervalFn;

    switch (timeRange) {
      case "day":
        periods = 24;
        dateFormat = "HH:00";
        intervalFn = (i) => {
          const d = new Date(now);
          d.setHours(i, 0, 0, 0);
          return d;
        };
        break;
      case "week":
        periods = 7;
        dateFormat = "EEE";
        intervalFn = (i) => subDays(now, 6 - i).setHours(0, 0, 0, 0);
        break;
      case "month":
        periods = 30;
        dateFormat = "dd/MM";
        intervalFn = (i) => subDays(now, 29 - i).setHours(0, 0, 0, 0);
        break;
      case "year":
        periods = 12;
        dateFormat = "MMM";
        intervalFn = (i) => {
          const d = new Date(now);
          d.setMonth(d.getMonth() - 11 + i);
          d.setDate(1);
          return d.setHours(0, 0, 0, 0);
        };
        break;
      default:
        periods = 24;
        dateFormat = "HH:00";
        intervalFn = (i) => subDays(now, 1).setHours(i, 0, 0, 0);
    }

    for (let i = 0; i < periods; i++) {
      const intervalStart = new Date(intervalFn(i));

      let intervalEnd;
      if (timeRange === "year") {
        intervalEnd = new Date(intervalStart);
        intervalEnd.setMonth(intervalEnd.getMonth() + 1);
      } else if (timeRange === "month" || timeRange === "week") {
        intervalEnd = new Date(intervalStart);
        intervalEnd.setDate(intervalEnd.getDate() + 1);
      } else {
        intervalEnd = new Date(intervalStart);
        intervalEnd.setHours(intervalEnd.getHours() + 1);
      }

      const count = users.filter((user) => {
        const createdDate = new Date(user.createdAt);
        return createdDate >= intervalStart && createdDate < intervalEnd;
      }).length;

      data.push({
        name: format(intervalStart, dateFormat, { locale: vi }),
        users: count,
      });
    }

    return data;
  }, [users, timeRange]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-40">
//         <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
//       </div>
//     );
//   }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-indigo-900 shadow-sm hover:shadow transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Tổng người dùng
                </p>
                <h3 className="text-3xl font-bold mt-2 text-blue-700 dark:text-blue-300">
                  {users.length}
                </h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-purple-900 shadow-sm hover:shadow transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Admin
                </p>
                <h3 className="text-3xl font-bold mt-2 text-indigo-700 dark:text-indigo-300">
                  {roleStats.find((r) => r.name === "ADMIN")?.count || 0}
                </h3>
              </div>
              <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center">
                <UserCog className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-blue-900 shadow-sm hover:shadow transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bác sĩ
                </p>
                <h3 className="text-3xl font-bold mt-2 text-cyan-700 dark:text-cyan-300">
                  {roleStats.find((r) => r.name === "DOCTOR")?.count || 0}
                </h3>
              </div>
              <div className="h-12 w-12 bg-cyan-100 dark:bg-cyan-800 rounded-full flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-cyan-600 dark:text-cyan-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-teal-900 shadow-sm hover:shadow transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bệnh nhân
                </p>
                <h3 className="text-3xl font-bold mt-2 text-emerald-700 dark:text-emerald-300">
                  {roleStats.find((r) => r.name === "PATIENT")?.count || 0}
                </h3>
              </div>
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-800 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">
              Tăng trưởng người dùng
            </CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription>
                Biểu đồ người dùng mới theo thời gian
              </CardDescription>
              <Tabs
                defaultValue="day"
                value={timeRange}
                onValueChange={setTimeRange}
                className="w-fit"
              >
                <TabsList className="grid w-full grid-cols-4 h-8">
                  <TabsTrigger value="day" className="text-xs px-2">
                    Ngày
                  </TabsTrigger>
                  <TabsTrigger value="week" className="text-xs px-2">
                    Tuần
                  </TabsTrigger>
                  <TabsTrigger value="month" className="text-xs px-2">
                    Tháng
                  </TabsTrigger>
                  <TabsTrigger value="year" className="text-xs px-2">
                    Năm
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={growthData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [`${value} người dùng`, "Số lượng"]}
                    labelFormatter={(label) => `Thời gian: ${label}`}
                  />
                  <Bar
                    dataKey="users"
                    fill="#4f46e5"
                    radius={[4, 4, 0, 0]}
                    barSize={
                      timeRange === "year"
                        ? 20
                        : timeRange === "month"
                        ? 8
                        : timeRange === "week"
                        ? 30
                        : 12
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold">
              Phân bố người dùng
            </CardTitle>
            <CardDescription>Theo vai trò trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={30}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {roleStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                  <Tooltip
                    formatter={(value) => [`${value} người dùng`, "Số lượng"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <span>Người dùng mới</span>
          </CardTitle>
          <div className="flex items-center justify-between">
            <CardDescription className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {timeRange === "day" && "24 giờ qua"}
              {timeRange === "week" && "Tuần này"}
              {timeRange === "month" && "Tháng này"}
              {timeRange === "year" && "Năm nay"}
            </CardDescription>
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 py-1 px-3 rounded-full text-sm font-medium">
              {newUsers.length} người dùng
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {newUsers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {newUsers.slice(0, 6).map((user) => (
                <Card
                  key={user.id}
                  className="bg-gray-50 dark:bg-gray-800 border-0 shadow-none hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                        {user.full_name
                          ? user.full_name.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {user.full_name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Badge
                        variant={
                          user.role?.role === "ADMIN"
                            ? "admin"
                            : user.role?.role === "DOCTOR"
                            ? "doctor"
                            : user.role?.role === "PATIENT"
                            ? "patient"
                            : "light"
                        }
                      >
                        {user.role?.role || "N/A"}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Đăng ký:{" "}
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-gray-300 dark:text-gray-600" />
              </div>
              <p>Không có người dùng mới trong thời gian này</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatistics;
