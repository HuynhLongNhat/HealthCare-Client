import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Heart,
  Calendar,
} from "lucide-react";

const quickLinks = [
  { name: "Trang chủ", href: "/" },
  { name: "Về chúng tôi", href: "/about" },
  { name: "Dịch vụ", href: "/services" },
  { name: "Bác sĩ", href: "/doctors" },
  { name: "Phòng khám", href: "/clinics" },
  { name: "Blog sức khỏe", href: "/blog" },
];

const specialties = [
  "Tim mạch",
  "Thần kinh",
  "Tiêu hóa",
  "Nhi khoa",
  "Da liễu",
  "Xương khớp",
  "Tai mũi họng",
  "Mắt",
];

const legalLinks = [
  { name: "Điều khoản dịch vụ", href: "/terms" },
  { name: "Chính sách bảo mật", href: "/privacy" },
  { name: "Chính sách cookie", href: "/cookies" },
];

const Newsletter = () => (
  <div className="mt-6">
    <p className="text-white mb-2">Nhận bản tin sức khỏe hàng tuần</p>
    <div className="flex rounded-md overflow-hidden">
      <input
        type="email"
        placeholder="Email của bạn"
        className="flex-1 px-4 py-2 text-blue-900"
      />
      <button className="bg-white text-blue-800 px-4 flex items-center justify-center">
        <Calendar className="h-5 w-5 mr-2" /> Gửi
      </button>
    </div>
  </div>
);

const Footer = () => (
  <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
    <div className="container mx-auto px-6 py-16 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center text-2xl font-bold">
            <Heart className="text-pink-300 mr-2" /> HealthCare
          </div>
          <p className="text-blue-100">
            Nền tảng kết nối bệnh nhân với bác sĩ và phòng khám hàng đầu Việt Nam
          </p>
          <div className="flex space-x-3">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 bg-blue-700 rounded-full hover:bg-opacity-80 transition"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4">Liên kết nhanh</h4>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="text-blue-100 hover:text-white">
                  • {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Specialties */}
        <div>
          <h4 className="font-semibold mb-4">Chuyên khoa</h4>
          <ul className="space-y-2">
            {specialties.map((sp) => (
              <li key={sp}>
                <a href="#" className="text-blue-100 hover:text-white">
                  • {sp}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Newsletter */}
        <div className="space-y-4">
          <h4 className="font-semibold mb-4">Liên hệ</h4>
          <div className="space-y-3 text-blue-100">
            <div className="flex items-center">
              <MapPin className="mr-3" size={18} />
              Số 77, Đường Duy Tân, Cầu Giấy, Hà Nội
            </div>
            <div className="flex items-center">
              <Phone className="mr-3" size={18} />
              <a href="tel:19001077" className="hover:text-white">
                1900 1077
              </a>
            </div>
            <div className="flex items-center">
              <Mail className="mr-3" size={18} />
              <a href="mailto:contact@77bookingcare.com" className="hover:text-white">
                contact@77bookingcare.com
              </a>
            </div>
          </div>
          <Newsletter />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-blue-400"></div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row justify-between items-center text-blue-100 text-sm space-y-4 md:space-y-0">
        <p>&copy; 2024 HealthCare. Bảo lưu mọi quyền.</p>
        <div className="flex space-x-6">
          {legalLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-white">
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
