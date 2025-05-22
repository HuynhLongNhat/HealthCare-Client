

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  BarChart3, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Wallet
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatMoney } from "@/utils/helpers";
import { getAllMyPayment } from "@/api/payment.api";

const PaymentStatistics = ({ userId }) => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [statistics, setStatistics] = useState({
    totalAmount: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    cancelledPayments: 0,
    comparisonRate: 0,
    monthlyData: [],
    recentTransactions: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getAllMyPayment(userId);
        if (res.EC === 0) {
          setPayments(res.DT);
          calculateStatistics(res.DT);
        }
      } catch (error) {
        console.error("Failed to fetch payment data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const calculateStatistics = (data) => {
    // Calculate basic statistics
    let totalAmount = 0;
    let successfulPayments = 0;
    let pendingPayments = 0;
    let cancelledPayments = 0;
    
    // For monthly data
    const monthlyAmounts = {};
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Process each payment
    data.forEach(payment => {
      const paymentAmount = Number(payment?.paymentData?.amount) || 0;
      totalAmount += paymentAmount;
      
      // Count by status
      switch(payment.paymentData?.status?.status_name) {
        case "SUCCESS":
          successfulPayments++;
          break;
        case "PENDING":
          pendingPayments++;
          break;
        case "CANCELLED":
          cancelledPayments++;
          break;
        default:
          break;
      }
      
      // Process for monthly data
      if (payment.paymentData?.payment_date) {
        const paymentDate = new Date(payment.paymentData.payment_date);
        const paymentMonth = paymentDate.getMonth();
        const paymentYear = paymentDate.getFullYear();
        
        // Create a key for the month-year combination
        const monthKey = `${paymentYear}-${paymentMonth}`;
        
        if (!monthlyAmounts[monthKey]) {
          monthlyAmounts[monthKey] = 0;
        }
        
        monthlyAmounts[monthKey] += paymentAmount;
      }
    });
    
    // Calculate month-over-month comparison rate
    const thisMonthKey = `${currentYear}-${currentMonth}`;
    const lastMonthKey = `${currentMonth === 0 ? currentYear - 1 : currentYear}-${currentMonth === 0 ? 11 : currentMonth - 1}`;
    
    const thisMonthAmount = monthlyAmounts[thisMonthKey] || 0;
    const lastMonthAmount = monthlyAmounts[lastMonthKey] || 0;
    
    let comparisonRate = 0;
    if (lastMonthAmount > 0) {
      comparisonRate = ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100;
    } else if (thisMonthAmount > 0) {
      comparisonRate = 100; // If last month was 0 and this month has payments, that's a 100% increase
    }
    
    // Prepare monthly data for chart (last 6 months)
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      const key = `${year}-${monthIndex}`;
      
      const monthNames = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", 
                          "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
      
      monthlyData.push({
        name: monthNames[monthIndex],
        value: monthlyAmounts[key] || 0
      });
    }
    
    // Get recent transactions (latest 3)
    const recentTransactions = [...data]
      .sort((a, b) => new Date(b.paymentData?.payment_date) - new Date(a.paymentData?.payment_date))
      .slice(0, 3);
    
    setStatistics({
      totalAmount,
      successfulPayments,
      pendingPayments,
      cancelledPayments,
      comparisonRate,
      monthlyData,
      recentTransactions
    });
  };
  
  // Calculate the max value for the chart scaling
  const maxChartValue = Math.max(...statistics.monthlyData.map(item => item.value), 1);

  return (
    <div className="mb-8 animate-fadeIn">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-700 flex items-center">
            <Wallet className="mr-2 h-5 w-5" />
            Thống kê thanh toán
          </h2>
          <TabsList className="bg-gray-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Theo tháng
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue Card */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-200">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <CardTitle className="text-white font-medium flex items-center justify-between">
                  <span>Tổng doanh thu</span>
                  <DollarSign className="h-5 w-5" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {isLoading ? (
                  <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{formatMoney(statistics.totalAmount)}</span>
                    <div className="flex items-center mt-2 text-sm">
                      {statistics.comparisonRate > 0 ? (
                        <div className="flex items-center text-green-600">
                          <ArrowUp className="h-4 w-4 mr-1" />
                          <span>{Math.abs(statistics.comparisonRate).toFixed(1)}% so với tháng trước</span>
                        </div>
                      ) : statistics.comparisonRate < 0 ? (
                        <div className="flex items-center text-red-600">
                          <ArrowDown className="h-4 w-4 mr-1" />
                          <span>{Math.abs(statistics.comparisonRate).toFixed(1)}% so với tháng trước</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Không có thay đổi so với tháng trước</span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Successful Payments Card */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-200">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                <CardTitle className="text-white font-medium flex items-center justify-between">
                  <span>Thanh toán thành công</span>
                  <CheckCircle2 className="h-5 w-5" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {isLoading ? (
                  <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{statistics.successfulPayments}</span>
                    <Badge className="bg-green-100 text-green-800">
                      {Math.round((statistics.successfulPayments / (statistics.successfulPayments + statistics.pendingPayments + statistics.cancelledPayments || 1)) * 100)}%
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pending Payments Card */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-200">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4">
                <CardTitle className="text-white font-medium flex items-center justify-between">
                  <span>Đang xử lý</span>
                  <Clock className="h-5 w-5" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {isLoading ? (
                  <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{statistics.pendingPayments}</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {Math.round((statistics.pendingPayments / (statistics.successfulPayments + statistics.pendingPayments + statistics.cancelledPayments || 1)) * 100)}%
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cancelled Payments Card */}
            <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-200">
              <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 p-4">
                <CardTitle className="text-white font-medium flex items-center justify-between">
                  <span>Đã hủy</span>
                  <XCircle className="h-5 w-5" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {isLoading ? (
                  <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{statistics.cancelledPayments}</span>
                    <Badge className="bg-red-100 text-red-800">
                      {Math.round((statistics.cancelledPayments / (statistics.successfulPayments + statistics.pendingPayments + statistics.cancelledPayments || 1)) * 100)}%
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="hover:shadow-md transition-shadow duration-300 border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-800">Giao dịch gần đây</CardTitle>
              <CardDescription>3 giao dịch mới nhất</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="h-16 w-full bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : statistics.recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {statistics.recentTransactions.map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center">
                        <div className="mr-3">
                          {transaction.paymentData?.status?.status_name === "SUCCESS" && (
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            </div>
                          )}
                          {transaction.paymentData?.status?.status_name === "PENDING" && (
                            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                              <Clock className="h-5 w-5 text-yellow-600" />
                            </div>
                          )}
                          {transaction.paymentData?.status?.status_name === "CANCELLED" && (
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <XCircle className="h-5 w-5 text-red-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-1 max-w-xs">
                            {transaction.paymentData?.transfer_content || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.paymentData?.payment_date
                              ? format(new Date(transaction.paymentData.payment_date), "dd/MM/yyyy HH:mm")
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatMoney(transaction.paymentData?.amount || 0)}</p>
                        <Badge className={`
                          ${transaction.paymentData?.status?.status_name === "SUCCESS" ? "bg-green-100 text-green-800" : ""}
                          ${transaction.paymentData?.status?.status_name === "PENDING" ? "bg-yellow-100 text-yellow-800" : ""}
                          ${transaction.paymentData?.status?.status_name === "CANCELLED" ? "bg-red-100 text-red-800" : ""}
                        `}>
                          {transaction.paymentData?.status?.status_name === "SUCCESS" && "Thành công"}
                          {transaction.paymentData?.status?.status_name === "PENDING" && "Đang chờ"}
                          {transaction.paymentData?.status?.status_name === "CANCELLED" && "Đã hủy"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>Không có giao dịch nào gần đây</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-0">
          <Card className="hover:shadow-md transition-shadow duration-300 border border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-800">Thống kê theo tháng</CardTitle>
              <CardDescription>Doanh thu 6 tháng gần nhất</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-64 w-full bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <div className="mt-4">
                  <div className="grid grid-cols-6 gap-2 h-64">
                    {statistics.monthlyData.map((month, index) => {
                      const percentage = (month.value / maxChartValue) * 100 || 0;
                      return (
                        <div key={index} className="flex flex-col items-center justify-end h-full">
                          <div className="relative w-full group">
                            <div 
                              className="absolute bottom-0 w-full bg-blue-100 group-hover:bg-blue-200 transition-all duration-300 rounded-t-md"
                              style={{ 
                                height: `${percentage}%`,
                                minHeight: month.value > 0 ? '10%' : '0%'
                              }}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-gray-800 text-white text-xs py-1 px-2 rounded">
                                {formatMoney(month.value)}
                              </div>
                            </div>
                            <div 
                              className="absolute bottom-0 w-full bg-blue-500 group-hover:bg-blue-600 transition-all duration-300 rounded-t-md animate-expandUp"
                              style={{ 
                                height: `${percentage}%`,
                                minHeight: month.value > 0 ? '10%' : '0%',
                                animationDelay: `${index * 100}ms`
                              }}
                            ></div>
                          </div>
                          <div className="mt-2 text-xs text-gray-600 text-center">{month.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Status Distribution */}
            <Card className="hover:shadow-md transition-shadow duration-300 border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-800">Phân bổ trạng thái</CardTitle>
                <CardDescription>Tỷ lệ các trạng thái thanh toán</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((_, index) => (
                      <div key={index} className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm">Thành công</span>
                        </div>
                        <span className="text-sm">{statistics.successfulPayments} giao dịch</span>
                      </div>
                      <Progress 
                        value={Math.round((statistics.successfulPayments / (statistics.successfulPayments + statistics.pendingPayments + statistics.cancelledPayments || 1)) * 100)} 
                        className="h-2 bg-gray-100" 
                        indicatorClassName="bg-green-500" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                          <span className="text-sm">Đang chờ</span>
                        </div>
                        <span className="text-sm">{statistics.pendingPayments} giao dịch</span>
                      </div>
                      <Progress 
                        value={Math.round((statistics.pendingPayments / (statistics.successfulPayments + statistics.pendingPayments + statistics.cancelledPayments || 1)) * 100)} 
                        className="h-2 bg-gray-100" 
                        indicatorClassName="bg-yellow-500" 
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                          <span className="text-sm">Đã hủy</span>
                        </div>
                        <span className="text-sm">{statistics.cancelledPayments} giao dịch</span>
                      </div>
                      <Progress 
                        value={Math.round((statistics.cancelledPayments / (statistics.successfulPayments + statistics.pendingPayments + statistics.cancelledPayments || 1)) * 100)} 
                        className="h-2 bg-gray-100" 
                        indicatorClassName="bg-red-500" 
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="hover:shadow-md transition-shadow duration-300 border border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-800">Tóm tắt</CardTitle>
                <CardDescription>Số liệu tổng hợp</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((_, index) => (
                      <div key={index} className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col p-4 bg-blue-50 rounded-lg">
                      <span className="text-sm text-blue-700">Tổng giao dịch</span>
                      <span className="text-2xl font-bold text-blue-800">
                        {statistics.successfulPayments + statistics.pendingPayments + statistics.cancelledPayments}
                      </span>
                    </div>
                    
                    <div className="flex flex-col p-4 bg-green-50 rounded-lg">
                      <span className="text-sm text-green-700">Tỷ lệ thành công</span>
                      <span className="text-2xl font-bold text-green-800">
                        {Math.round((statistics.successfulPayments / (statistics.successfulPayments + statistics.pendingPayments + statistics.cancelledPayments || 1)) * 100)}%
                      </span>
                    </div>
                    
                    <div className="flex flex-col p-4 bg-yellow-50 rounded-lg">
                      <span className="text-sm text-yellow-700">Đang xử lý</span>
                      <span className="text-2xl font-bold text-yellow-800">
                        {Math.round((statistics.pendingPayments / (statistics.successfulPayments + statistics.pendingPayments + statistics.cancelledPayments || 1)) * 100)}%
                      </span>
                    </div>
                    
                    <div className="flex flex-col p-4 bg-red-50 rounded-lg">
                      <span className="text-sm text-red-700">Đã hủy</span>
                      <span className="text-2xl font-bold text-red-800">
                        {Math.round((statistics.cancelledPayments / (statistics.successfulPayments + statistics.pendingPayments + statistics.cancelledPayments || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <style jsx>{`
        @keyframes expandUp {
          from {
            height: 0%;
          }
          to {
            height: var(--height);
          }
        }
        
        .animate-expandUp {
          animation: expandUp 1s ease-out forwards;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentStatistics;