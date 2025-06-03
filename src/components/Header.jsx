import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Stethoscope,
  Contact,
  Building2,
  Key,
  LogOut,
  LogIn,
  Sun,
  Moon,
  FileText,
  Users,
  CalendarHeart,
  User,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import ChangePasswordModal from "./ChangePassword";
import useAuthToken from "@/utils/userAuthToken";
import logo from "@/assets/logo-min.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "@/api/auth.api";
import { setUser } from "@/store/user.slice";
const Header = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const auth = useAuthToken();
  // const [isDarkMode, setIsDarkMode] = useState(false);
  
    const displayName = userData?.full_name || auth?.full_name || auth?.email?.split("@")[0] || "GUEST";
  const displayEmail = userData?.email || auth?.email || "GUEST";
  const avatar =
    userData?.avatar || auth?.avatar || "";


    useEffect(() => {
    if (auth?.id) {
      const fetchUserData = async () => {
        try {
          const res = await getUserById(auth.id);
          if (res && res.data) {
            dispatch(setUser(res.data));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [auth?.id, dispatch]);
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
      // setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    // setIsDarkMode(!isDarkMode);
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
    { to: "/specializations", icon: Stethoscope, label: "Chuyên khoa" },
    { to: "/doctors", icon: Users, label: "Bác sĩ" },
    { to: "/cam-nang-suc-khoe", icon: FileText, label: "Cẩm nang" },
  ];
  
  const profileItems = auth
    ? [
        {
          to: `profile/${auth.userId}`,
          icon: Contact,
          label: "Thông tin cá nhân",
        },

        ...(auth.role !== 1
          ? [
              {
                to: `${auth.userId}/lich-su-thanh-toan`,
                icon: CreditCard,
                label: "Lịch sử thanh toán",
              },
            ]
          : []),

        ...(auth.role === 3
          ? [
              {
                to: `${auth.userId}/appointments`,
                icon: CalendarHeart,
                label: "Lịch khám của tôi",
              },
            ]
          : []),

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
      className={"fixed w-full top-0 z-50 transition-all duration-500 bg-white border-b dark:bg-gray-900 dark:border-gray-800 " }
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Left side */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <motion.div 
              className="relative w-10 h-10 flex items-center justify-center"
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img
                src={logo}
                alt="HealthCare Logo"
                className="w-full h-full rounded-full object-cover border-2 border-blue-300 shadow-lg"
              />
            </motion.div>
            <motion.h1 
              className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent hidden sm:block"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              HealthCare
            </motion.h1>
          </Link>

          {/* Main Navigation - Center */}
          <nav className="hidden md:flex items-center gap-1 mx-4">
            {navItems.map((item, index) => (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Button
                  asChild
                  variant="ghost"
                  className={`gap-1.5 rounded-lg px-4 transition-all duration-300 ${
                    location.pathname === item.to
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-700 dark:text-blue-400 font-medium shadow-sm"
                      : "hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-foreground/80"
                  }`}
                >
                  <Link to={item.to} className="flex items-center">
                    <item.icon className={`h-[15px] w-[15px] ${location.pathname === item.to ? 'text-blue-700 dark:text-blue-400' : 'text-blue-600/70 dark:text-blue-500/70'}`} />
                    <span className="relative">
                      {item.label}
                      {location.pathname === item.to && (
                        <motion.span
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                          layoutId="underline"
                        />
                      )}
                    </span>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </nav>

          {/* Right side - User & Dark Mode */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-blue-500" />
                )}
              </Button> */}
            </motion.div>

            {auth ? (
              <Popover>
                <PopoverTrigger asChild>
                  <motion.div 
                    className="flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1.5 rounded-lg cursor-pointer transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="hidden lg:inline font-medium text-sm">
                      {displayName}
                    </span>
                    <Avatar className="h-8 w-8 border-2 border-primary/20 transition-transform">
                      <AvatarImage src={avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
                        {auth.full_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-56 rounded-lg shadow-lg p-0 overflow-hidden border-blue-100 dark:border-blue-900"
                >
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-1  py-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                      <p className="text-sm font-medium">{ displayEmail}</p>
                      <p className="text-xs text-muted-foreground">
                        {auth.role === 1
                          ? "Quản trị viên"
                          : auth.role === 2
                          ? "Bác sĩ"
                          : "Bệnh nhân"}
                      </p>
                    </div>
                    <div className="p-1">
                      {profileItems.map((item, index) => (
                        <motion.div
                          key={item.to}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                        >
                          <Button
                            variant="ghost"
                            asChild
                            className="w-full justify-start gap-2 text-sm rounded-md"
                          >
                            <Link to={item.to} className="cursor-pointer">
                              <item.icon className="h-4 w-4 text-blue-500" />
                              {item.label}
                            </Link>
                          </Button>
                        </motion.div>
                      ))}

                      {auth?.role === 1 && (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: profileItems.length * 0.05, duration: 0.2 }}
                        >
                          <Button
                            variant="ghost"
                            asChild
                            className="w-full justify-start gap-2 text-sm rounded-md"
                          >
                            <Link to="/admin/users" className="cursor-pointer">
                              <User className="h-4 w-4 text-blue-500" />
                              Admin Dashboard
                            </Link>
                          </Button>
                        </motion.div>
                      )}

                      {!auth?.googleId && !auth?.facebookId && (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            delay: (profileItems.length + (auth?.role === 1 ? 1 : 0)) * 0.05, 
                            duration: 0.2 
                          }}
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 text-sm rounded-md"
                            onClick={() => setIsModalOpen(true)}
                          >
                            <Key className="h-4 w-4 text-blue-500" />
                            Đổi mật khẩu
                          </Button>
                        </motion.div>
                      )}

                      <Separator className="my-1 bg-blue-100 dark:bg-blue-800" />
                      
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: (profileItems.length + (auth?.role === 1 ? 1 : 0) + (!auth?.googleId && !auth?.facebookId ? 1 : 0)) * 0.05, 
                          duration: 0.2 
                        }}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 text-sm rounded-md text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4" />
                          Đăng xuất
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                </PopoverContent>
              </Popover>
            ) : (
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  variant="outline"
                  className="text-black hover:text-blue-500"
                  onClick={() => navigate("/login")}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Đăng nhập</span>
                </Button>
              </motion.div>
            )}

            {/* Mobile menu button */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5 text-blue-600" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5 text-blue-600" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden"
          >
            <motion.div
              className="space-y-1 px-4 pb-3 pt-2 bg-background shadow-inner"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { 
                  transition: { staggerChildren: 0.07, delayChildren: 0.1 } 
                },
                hidden: {}
              }}
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.to}
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: -20 }
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    asChild
                    variant="ghost"
                    className={`w-full justify-start gap-2 transition-all duration-200 ${
                      location.pathname === item.to 
                        ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 text-blue-700 dark:text-blue-400 font-medium" 
                        : ""
                    }`}
                  >
                    <Link 
                      to={item.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className={`h-4 w-4 ${location.pathname === item.to ? 'text-blue-600' : 'text-blue-500/70'}`} />
                      {item.label}
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </motion.div>

            <Separator className="bg-blue-100 dark:bg-blue-800" />

            <motion.div 
              className="space-y-1 px-4 pb-3 pt-2 bg-background"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { 
                  transition: { staggerChildren: 0.07, delayChildren: 0.3 } 
                },
                hidden: {}
              }}
            >
              {auth ? (
                <>
                  <motion.div 
                    className="flex items-center gap-3 px-2 py-2.5"
                    variants={{
                      visible: { opacity: 1, y: 0 },
                      hidden: { opacity: 0, y: -20 }
                    }}
                  >
                    <Avatar className="h-8 w-8 border-2 border-primary/20">
                      <AvatarImage src={avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-700 to-blue-500 text-white">
                        {auth.full_name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{displayEmail}</p>
                      <p className="text-xs text-muted-foreground">
                        {auth.role === 1
                          ? "Quản trị viên"
                          : auth.role === 2
                          ? "Bác sĩ"
                          : "Bệnh nhân"}
                      </p>
                    </div>
                  </motion.div>

                  <Separator className="my-1 bg-blue-100 dark:bg-blue-800" />

                  {profileItems.map((item) => (
                    <motion.div
                      key={item.to}
                      variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: -20 }
                      }}
                    >
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to={item.to}>
                          <item.icon className="h-4 w-4 text-blue-500" />
                          {item.label}
                        </Link>
                      </Button>
                    </motion.div>
                  ))}

                  {auth?.role === 1 && (
                    <motion.div
                      variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: -20 }
                      }}
                    >
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to="/admin/users">
                          <User className="h-4 w-4 text-blue-500" />
                          Admin Dashboard
                        </Link>
                      </Button>
                    </motion.div>
                  )}

                  {!auth?.googleId && !auth?.facebookId && (
                    <motion.div
                      variants={{
                        visible: { opacity: 1, y: 0 },
                        hidden: { opacity: 0, y: -20 }
                      }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                        onClick={() => {
                          setIsModalOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <Key className="h-4 w-4 text-blue-500" />
                        Đổi mật khẩu
                      </Button>
                    </motion.div>
                  )}

                  <Separator className="my-1 bg-blue-100 dark:bg-blue-800" />

                  <motion.div
                    variants={{
                      visible: { opacity: 1, y: 0 },
                      hidden: { opacity: 0, y: -20 }
                    }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </Button>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: -20 }
                  }}
                >
                  <Button
                    variant="default"
                    className="w-full gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md"
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogIn className="h-4 w-4" />
                    Đăng nhập
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ChangePasswordModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </header>
  );
};

export default Header;