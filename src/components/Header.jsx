import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Menu,
  X,
  Calendar,
  Home,
  Stethoscope,
  Contact,
  Building2,
  Key,
  LogOut,
  LogIn,
  Sun,
  Moon,
  ChevronDown,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import ChangePasswordModal from "./ChangePassword";
import useAuthToken from "@/utils/userAuthToken";
import logo from "@/assets/logo-min.jpg";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const auth = useAuthToken();
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { to: "/", icon: Home, label: "Trang chủ" },
    { to: "/clinics", icon: Building2, label: "Cơ sở y tế" },
    { to: "/specializations", icon: Calendar, label: "Chuyên khoa" },
    { to: "/doctors", icon: Stethoscope, label: "Bác sĩ" },
     { to: "/cam-nang-suc-khoe", icon: FileText, label: "Cẩm nang sức khỏe" },
  ];

  const profileItems = auth
    ? [
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
              {
                to: `/doctor/${auth.userId}/handbooks`,
                icon: FileText,
                label: "Bài viết của tôi",
              },
            ]
          : []),
      ]
    : [];

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 bg-white border-b `}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left side */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform hover:scale-[0.98]"
          >
            <div className="relative w-10 h-10 flex items-center justify-center">
              <img
                src={logo}
                alt="HealthCare Logo"
                className="w-full h-full rounded-full object-cover border-2 border-primary shadow-lg"
              />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent hidden sm:block">
              HealthCare
            </h1>
          </Link>

          {/* Main Navigation - Center */}
          <nav className="hidden md:flex items-center gap-0.5 mx-4">
            {navItems.map((item) => (
              <Button
                key={item.to}
                asChild
                variant="ghost"
                className={`gap-1.5 rounded-lg px-4 ${
                  location.pathname === item.to
                    ? "bg-accent text-primary font-medium"
                    : "hover:bg-accent/30 text-foreground/80"
                }`}
              >
                <Link to={item.to}>
                  <item.icon className="h-[15px] w-[15px]" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            ))}
          </nav>

          {/* Right side - User & Dark Mode */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-accent/30"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {auth ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 hover:bg-accent/30 px-2 py-1.5 rounded-lg cursor-pointer">
                    <span className="hidden lg:inline font-medium text-sm">
                      {auth.full_name || auth.email.split("@")[0]}
                    </span>
                    {auth.avatar ? (
                      <Avatar className="h-8 w-8 border-2 border-primary/20">
                        <AvatarImage src={auth.avatar} />
                      </Avatar>
                    ) : (
                      <Avatar className="h-8 w-8 border-2 border-primary/20">
                        <AvatarFallback className="bg-gradient-to-r from-primary to-teal-400 text-white">
                          {auth.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-lg shadow-lg"
                >
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{auth.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {auth.role === 1
                        ? "Quản trị viên"
                        : auth.role === 2
                        ? "Bác sĩ"
                        : "Bệnh nhân"}
                    </p>
                  </div>
                  <DropdownMenuSeparator />

                  {profileItems.map((item) => (
                    <DropdownMenuItem key={item.to} asChild>
                      <Link to={item.to} className="cursor-pointer gap-2">
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  {auth?.role === 1 && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin/dashboard"
                        className="cursor-pointer gap-2"
                      >
                        <Stethoscope className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {!auth?.googleId && !auth?.facebookId && (
                    <DropdownMenuItem
                      onClick={() => setIsModalOpen(true)}
                      className="gap-2"
                    >
                      <Key className="h-4 w-4" />
                      Đổi mật khẩu
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                className="gap-2 hidden sm:flex"
                onClick={() => navigate("/login")}
              >
                <LogIn className="h-4 w-4" />
                <span>Đăng nhập</span>
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="space-y-1 px-4 pb-3 pt-2 bg-background shadow-inner">
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  asChild
                  variant="ghost"
                  className={`w-full justify-start gap-2 ${
                    location.pathname === item.to ? "bg-accent" : ""
                  }`}
                >
                  <Link to={item.to}>
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>

            <Separator />

            <div className="space-y-1 px-4 pb-3 pt-2 bg-background">
              {auth ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2.5">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={auth.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-primary to-teal-400">
                        {auth.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{auth.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {auth.role === 1
                          ? "Quản trị viên"
                          : auth.role === 2
                          ? "Bác sĩ"
                          : "Bệnh nhân"}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-1" />

                  {profileItems.map((item) => (
                    <Button
                      key={item.to}
                      asChild
                      variant="ghost"
                      className="w-full justify-start gap-2"
                    >
                      <Link to={item.to}>
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </Button>
                  ))}

                  {auth?.role === 1 && (
                    <Button
                      asChild
                      variant="ghost"
                      className="w-full justify-start gap-2"
                    >
                      <Link to="/admin/dashboard">
                        <Stethoscope className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </Button>
                  )}

                  {!auth?.googleId && !auth?.facebookId && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Key className="h-4 w-4" />
                      Đổi mật khẩu
                    </Button>
                  )}

                  <Separator className="my-1" />

                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="h-4 w-4" />
                  Đăng nhập
                </Button>
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
