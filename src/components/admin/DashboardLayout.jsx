import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import SidebarDashBoard from "./Dashboard/SidebarDashboard";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header cố định */}
      <header className="flex-shrink-0">
        <Header />
      </header>

      {/* Nội dung chính: flex container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex-shrink-0">
          <SidebarDashBoard />
        </aside>

        {/* Main content cuộn */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
