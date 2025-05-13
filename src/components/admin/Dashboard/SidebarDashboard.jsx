import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronDown,
  Briefcase,
  Activity,
  Building,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuthToken from "@/utils/userAuthToken";

const SidebarDashBoard = () => {
  const [expanded, setExpanded] = useState(true);
  const [doctorMenuOpen, setDoctorMenuOpen] = useState(false);
  const auth = useAuthToken();
  console.log("auth" , auth)

  const menuAdmin = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Users", path: "/admin/users" },
    {
      icon: Stethoscope,
      label: "Bác sĩ",
      subItems: [
        { icon: Building, label: "Cơ sở y tế", path: "/doctor/clinics" },
        { icon: Activity, label: "Chuyên khoa", path: "/doctor/specializations" },
        { icon: Briefcase, label: "Bác sĩ", path: `/doctor` },
      ],
    },
    { icon: Calendar, label: "Lịch hẹn", path: "/admin/appointment" },
  ];

  const menuDoctor = [
    {
      icon: Stethoscope,
      label: "Bác sĩ",
      subItems: [
        { icon: Building, label: "Cơ sở y tế", path: "/doctor/clinics" },
        { icon: Briefcase, label: "Bác sĩ", path: `/doctor/${auth?.userId
}` },
      ],
    },
    { icon: Calendar, label: "Lịch hẹn", path: "/admin/appointment" },
  ];

  // 👇 chọn menu dựa theo role
  const menuItems = auth?.role === 1 ? menuAdmin : menuDoctor;

  return (
    <div
      className={`relative min-h-screen ${
        expanded ? "w-72" : "w-20"
      } bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white transition-all duration-300 ease-in-out`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="absolute -right-3 top-8 z-10 rounded-full bg-blue-800 p-1.5 text-white hover:bg-blue-700 focus:outline-none shadow-lg"
      >
        {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {/* Header */}
      <div className="flex h-20 items-center justify-center border-b border-blue-700/50 bg-blue-900/50 backdrop-blur-sm">
        {expanded ? (
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        ) : (
          <h1 className="text-xl font-bold">AD</h1>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="mt-8 px-4">
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.subItems ? (
              <div className="mb-2">
                <button
                  onClick={() => setDoctorMenuOpen(!doctorMenuOpen)}
                  className={`w-full flex items-center justify-between rounded-lg p-3 text-gray-200 transition-colors hover:bg-blue-700/50 hover:text-white ${
                    doctorMenuOpen ? "bg-blue-700/30" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {expanded && <span className="ml-3">{item.label}</span>}
                  </div>
                  {expanded && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        doctorMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
                {doctorMenuOpen && expanded && (
                  <div className="ml-4 mt-2 space-y-2">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.path}
                        className="flex items-center rounded-lg p-3 text-gray-300 transition-colors hover:bg-blue-700/50 hover:text-white pl-4"
                      >
                        <subItem.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="ml-3">{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path}
                className="mb-2 flex items-center rounded-lg p-3 text-gray-300 transition-colors hover:bg-blue-700/50 hover:text-white"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {expanded && <span className="ml-3">{item.label}</span>}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Footer/Logout */}
      <div className="absolute bottom-0 w-full border-t border-blue-700/50 p-4">
        <Link
          to="/logout"
          className="flex items-center rounded-lg p-3 text-gray-300 transition-colors hover:bg-blue-700/50 hover:text-white"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {expanded && <span className="ml-3">Đăng xuất</span>}
        </Link>
      </div>
    </div>
  );
};

export default SidebarDashBoard;
