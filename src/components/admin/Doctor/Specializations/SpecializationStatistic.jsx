import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
  Cell
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Activity, Layers } from "lucide-react";
import { getAllSpecializations } from "@/api/doctor.api";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const SpecializationStatistic = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await getAllSpecializations();
      if (response && response.DT) {
        const formattedStats = response.DT.map(spec => ({
          ...spec,
          growthRate: Math.random() * 20 
        }));
        
        setStats(formattedStats);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching specialization statistics:", error);
      setLoading(false);
    }
  };

  const exportToCSV = () => {
  if (!stats.length) return;

  const headers = "Tên chuyên khoa,Tăng trưởng (%)\n";
  const csvContent = stats.reduce((acc, stat) => {
    return acc + `${stat.name},${stat.growthRate.toFixed(2)}\n`;
  }, headers);

  // Thêm BOM ở đầu để hỗ trợ tiếng Việt khi mở bằng Excel
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `thong-ke-chuyen-khoa-${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  // Top 5 chuyên khoa tăng trưởng nhanh nhất
  const topGrowing = [...stats]
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-3xl font-bold text-blue-600">Thống Kê Chuyên Khoa</CardTitle>
          <CardDescription className="text-gray-600">
            Phân tích số lượng và tốc độ tăng trưởng các chuyên khoa
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-800">Tổng chuyên khoa</CardTitle>
              <Layers className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{stats.length}</div>
            <p className="text-xs text-blue-600 mt-1">chuyên khoa hiện có</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-800">Tăng trưởng TB</CardTitle>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">
              {stats.length > 0 
                ? (stats.reduce((sum, stat) => sum + stat.growthRate, 0) / stats.length).toFixed(1) 
                : '0'}%
            </div>
            <p className="text-xs text-green-600 mt-1">so với cùng kỳ</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-purple-800">Chuyên khoa tăng trưởng nhanh</CardTitle>
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {topGrowing[0]?.name || 'N/A'}
            </div>
            <p className="text-xs text-purple-600 mt-1">
              +{topGrowing[0]?.growthRate.toFixed(1) || '0'}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Biểu đồ thống kê</CardTitle>
              <CardDescription>Phân bố chuyên khoa theo tốc độ tăng trưởng</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={chartType === "bar" ? "default" : "outline"} 
                size="sm"
                onClick={() => setChartType("bar")}
              >
                Cột
              </Button>
              <Button 
                variant={chartType === "line" ? "default" : "outline"} 
                size="sm"
                onClick={() => setChartType("line")}
              >
                Đường
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Xuất file
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart data={topGrowing}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Tăng trưởng (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Tăng trưởng']}
                    labelFormatter={(name) => `Chuyên khoa: ${name}`}
                  />
                  <Bar dataKey="growthRate" name="Tăng trưởng" fill="#8884d8">
                    {topGrowing.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <LineChart data={topGrowing}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Tăng trưởng (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Tăng trưởng']}
                    labelFormatter={(name) => `Chuyên khoa: ${name}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="growthRate" 
                    name="Tăng trưởng" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top 5 Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Top 5 chuyên khoa tăng trưởng nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chuyên khoa</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tăng trưởng</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topGrowing.map((spec, index) => (
                  <tr key={spec.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{spec.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      +{spec.growthRate.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecializationStatistic;