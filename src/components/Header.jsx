import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  User,
  Search,
  Menu,
  X,
  Calendar,
  Heart,
  Phone,
  Home,
  Stethoscope,
  Contact,
  Building2,
  Key,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ChangePasswordModal from "./ChangePassword";
import { getAuth } from "@/utils/getAuth";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);
  const auth = getAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg py-2" : "bg-white/80 backdrop-blur-md py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative w-10 h-10 mr-2 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Heart className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              HealthCare
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { to: "/", icon: Home, label: "Trang chủ" },
              { to: "/clinics", icon: Building2, label: "Cơ sở y tế" },
              { to: "/specializations", icon: Calendar, label: "Chuyên khoa" },
              { to: "/doctors", icon: User, label: "Bác sĩ" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="font-medium flex items-center text-gray-700 hover:text-blue-600 transition-colors"
              >
                <item.icon size={16} className="mr-1.5" />
                {item.label}
              </Link>
            ))}

            {auth ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center hover:text-blue-500 transition-colors text-gray-700"
                >
                  {auth.avatar ? (
                    <img
                      src={auth.avatar}
                      alt="avatar"
                      className="w-9 h-9 rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-teal-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {auth.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Đã đăng nhập với</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {auth.email}
                        </p>
                      </div>

                      {/* Menu items */}
                      {[
                        {
                          to: `/profile/${auth.userId}`,
                          icon: Contact,
                          label: "Thông tin cá nhân",
                        },
                        ...(auth?.role === 2
                          ? [
                              {
                                to: `/doctor/${auth.userId}`,
                                icon: Stethoscope,
                                label: "Hồ sơ bác sĩ",
                              },
                              {
                                to: `/doctor/${auth.userId}/clinics`,
                                icon: Building2,
                                label: "Cơ sở của tôi",
                              },
                            ]
                          : []),
                      ].map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <item.icon size={16} className="mr-2" />
                          {item.label}
                        </Link>
                      ))}

                      {auth?.role === 1 && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          Admin dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Key size={16} className="mr-2" />
                        Đổi mật khẩu
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} className="mr-2" />
                        Đăng xuất
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="py-2 px-4 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:opacity-90 transition-opacity font-medium"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="text-gray-800" size={24} />
            ) : (
              <Menu className="text-gray-800" size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white px-4 pt-2 pb-4 shadow-lg"
          >
            <nav className="space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700"
              >
                Trang chủ
              </Link>
              <Link
                to="/specializations"
                className="block px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700"
              >
                Chuyên khoa
              </Link>
              <Link
                to="/doctors"
                className="block px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700"
              >
                Bác sĩ
              </Link>
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-200">
              {auth ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                      {auth.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {auth.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/profile/${auth.userId}`}
                    className="block px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700"
                  >
                    Thông tin cá nhân
                  </Link>
                  {auth?.role === 1 && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700"
                    >
                      Admin dashboard
                    </Link>
                  )}
                  {auth?.role === 2 && (
                    <Link
                      to="/doctor/dashboard"
                      className="block px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700"
                    >
                      Doctor dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="block w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 text-gray-700"
                  >
                    Đổi mật khẩu
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md hover:bg-red-50 text-red-600"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-3">
                  <Link
                    to="/login"
                    className="block w-full py-2 text-center rounded-md border border-blue-600 text-blue-600"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full py-2 text-center rounded-md bg-blue-600 text-white"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChangePasswordModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </header>
  );
};

export default Header;