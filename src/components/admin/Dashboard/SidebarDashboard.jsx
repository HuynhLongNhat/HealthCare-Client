import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Briefcase,
  Activity,
  Building,
  Settings,
  Menu,
  CreditCard,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useAuthToken from "@/utils/userAuthToken";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SidebarDashBoard = () => {
  const [expanded, setExpanded] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const auth = useAuthToken();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setExpanded(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuAdmin = [
    // { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Users", path: "/admin/users" },
    {
      icon: Stethoscope,
      label: "Bác sĩ",
      id: "doctor",
      subItems: [
        { icon: Building, label: "Cơ sở y tế", path: "/doctor/clinics" },
        {
          icon: Activity,
          label: "Chuyên khoa",
          path: "/doctor/specializations",
        },
        { icon: Briefcase, label: "Bác sĩ", path: `/doctor` },
        {
          icon: Calendar,
          label: "Lịch khám bệnh",
          path: `/doctor/appointments`,
        },
      ],
    },
    { icon: CreditCard, label: "Lịch sử thanh toán", path: "/admin/payment-history" },

  ];

  const menuDoctor = [
    {
      icon: Stethoscope,
      label: "Bác sĩ",
      id: "doctor",
      subItems: [
        { icon: Building, label: "Cơ sở y tế", path: "/doctor/clinics" },
        { icon: Briefcase, label: "Bác sĩ", path: `/doctor/${auth?.userId}` },
      ],
    },
    { icon: Calendar, label: "Lịch hẹn", path: "/admin/appointment" },
    { icon: Settings, label: "Cài đặt", path: "/settings" },
  ];

  const menuItems = auth?.role === 1 ? menuAdmin : menuDoctor;

  const toggleSubMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const isActive = (path) => location.pathname === path;

  const isSubMenuActive = (subItems) =>
    subItems.some((item) => location.pathname === item.path);

  return (
    <div
      className={`relative h-full flex flex-col ${
        expanded ? "w-72" : "w-20"
      } bg-white mt-16 text-gray-800 transition-all duration-300 ease-in-out shadow-md overflow-hidden z-10 ${
        isMobile ? "absolute" : "sticky top-0"
      }`}
    >
      {!isMobile && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="absolute -right-3 top-8 z-20 rounded-full bg-white p-1.5 text-gray-800 hover:bg-gray-100 focus:outline-none shadow-lg transition-all duration-200 hover:scale-105"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      )}

      {/* Header */}
      <div className="flex h-20 items-center justify-center border-b bg-white shrink-0">
        <div className="flex items-center space-x-3">
          {isMobile && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="h-5 w-5 text-gray-800" />
            </button>
          )}
          {expanded || isMobile ? (
            <h1 className="text-xl font-bold text-indigo-600">
              Admin dashboard
            </h1>
          ) : (
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-lg font-bold text-indigo-600">AD</span>
            </div>
          )}
        </div>
      </div>

      {/* User Profile Section */}
      {expanded && (
        <div className="px-4 shrink-0">
          <div className="flex items-center space-x-3 py-6">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center shadow-md">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={auth?.profile_picture} />
                <AvatarFallback className=" bg-blue-800 text-white">
                  {auth?.full_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {auth?.full_name || "User"}
              </p>
              <p className="text-xs text-gray-500">
                {auth?.role === 1 ? "Administrator" : "Doctor"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main container - takes remaining height with flex-1 */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navigation Menu (Scrollable) */}
        <div className="flex-1 overflow-y-auto scrollbar-container px-4">
          <nav className="space-y-1 py-2">
            {menuItems.map((item, index) => (
              <div key={index} className="mb-1.5">
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => toggleSubMenu(item.id)}
                      className={`w-full flex items-center justify-between rounded-lg p-3 transition-colors duration-200 ${
                        activeMenu === item.id || isSubMenuActive(item.subItems)
                          ? "bg-indigo-100 text-gray-800 shadow-inner"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={`h-5 w-5 ${
                            activeMenu === item.id ||
                            isSubMenuActive(item.subItems)
                              ? "text-indigo-600"
                              : "text-gray-500"
                          }`}
                        />
                        {expanded && (
                          <span className="ml-3 font-medium">{item.label}</span>
                        )}
                      </div>
                      {expanded && (
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            activeMenu === item.id
                              ? "rotate-180 text-indigo-600"
                              : "text-gray-500"
                          }`}
                        />
                      )}
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        activeMenu === item.id && expanded
                          ? "max-h-60 opacity-100 mt-1"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="ml-3 pl-3 border-l border-indigo-100 py-1 max-h-48 submenu-container">
                        {item.subItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            className={`flex items-center rounded-md py-2 px-3 text-sm transition-colors ${
                              isActive(subItem.path)
                                ? "bg-indigo-50 text-indigo-600 font-medium"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <subItem.icon
                              className={`h-4 w-4 ${
                                isActive(subItem.path)
                                  ? "text-indigo-600"
                                  : "text-gray-500"
                              }`}
                            />
                            <span className="ml-3">{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center rounded-lg p-3 transition-colors duration-200 ${
                      isActive(item.path)
                        ? "bg-indigo-100 text-gray-800 shadow-inner"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 ${
                        isActive(item.path)
                          ? "text-indigo-600"
                          : "text-gray-500"
                      }`}
                    />
                    {expanded && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        /* Custom scrollbar for main menu */
        .scrollbar-container::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 8px;
        }

        .scrollbar-container::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .scrollbar-container::-webkit-scrollbar-thumb:hover {
          background: #818cf8;
        }

        /* Custom scrollbar for submenu */
        .submenu-container {
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: thin;
          scrollbar-color: #c7d2fe #f1f1f1;
        }

        .submenu-container::-webkit-scrollbar {
          width: 4px;
        }

        .submenu-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 8px;
        }

        .submenu-container::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 8px;
        }

        .submenu-container::-webkit-scrollbar-thumb:hover {
          background: #818cf8;
        }
      `}</style>
    </div>
  );
};

export default SidebarDashBoard;
