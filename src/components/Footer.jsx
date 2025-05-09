import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Heart,
} from "lucide-react";

const Footer = () => (
  <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Company Info */}
        <div className="space-y-5">
          <div className="flex items-center">
            <Heart className="text-pink-300 mr-2" size={24} />
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              HealthCare
            </h3>
          </div>
          <p className="text-blue-100 leading-relaxed">
            Nền tảng kết nối bệnh nhân với bác sĩ và phòng khám hàng đầu Việt Nam
          </p>
          <div className="flex space-x-4">
            <a href="#" className="p-2 bg-blue-700 rounded-full hover:bg-blue-500 transition" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="#" className="p-2 bg-blue-700 rounded-full hover:bg-pink-400 transition" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#" className="p-2 bg-blue-700 rounded-full hover:bg-blue-400 transition" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="#" className="p-2 bg-blue-700 rounded-full hover:bg-blue-900 transition" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-6 pb-2 border-b border-blue-400 inline-block">
            Liên kết nhanh
          </h4>
          <ul className="space-y-3">
            {[
              { name: "Trang chủ", href: "/" },
              { name: "Về chúng tôi", href: "/about" },
              { name: "Dịch vụ", href: "/services" },
              { name: "Bác sĩ", href: "/doctors" },
              { name: "Phòng khám", href: "/clinics" },
              { name: "Blog sức khỏe", href: "/blog" },
            ].map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-blue-100 hover:text-white transition flex items-center group"
                >
                  <span className="w-1 h-1 bg-white rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Specialties */}
        <div>
          <h4 className="text-lg font-semibold mb-6 pb-2 border-b border-blue-400 inline-block">
            Chuyên khoa
          </h4>
          <ul className="space-y-3">
            {[
              "Tim mạch",
              "Thần kinh",
              "Tiêu hóa",
              "Nhi khoa",
              "Da liễu",
              "Xương khớp",
              "Tai mũi họng",
              "Mắt",
            ].map((specialty) => (
              <li key={specialty}>
                <a
                  href="#"
                  className="text-blue-100 hover:text-white transition flex items-center group"
                >
                  <span className="w-1 h-1 bg-white rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {specialty}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-6 pb-2 border-b border-blue-400 inline-block">
            Liên hệ
          </h4>
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin size={18} className="text-white mt-1 mr-3 flex-shrink-0" />
              <span className="text-blue-100">Số 77, Đường Duy Tân, Cầu Giấy, Hà Nội</span>
            </div>
            <div className="flex items-center">
              <Phone size={18} className="text-white mr-3" />
              <a
                href="tel:19001077"
                className="text-blue-100 hover:text-white transition"
              >
                1900 1077
              </a>
            </div>
            <div className="flex items-center">
              <Mail size={18} className="text-white mr-3" />
              <a
                href="mailto:contact@77bookingcare.com"
                className="text-blue-100 hover:text-white transition"
              >
                contact@77bookingcare.com
              </a>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-700 rounded-lg">
            <p className="text-sm text-blue-100">
              Đăng ký nhận bản tin sức khỏe hàng tuần
            </p>
            <div className="mt-2 flex">
              <input
                type="email"
                placeholder="Email của bạn"
                className="px-3 py-2 bg-blue-100 text-blue-900 rounded-l-md focus:outline-none w-full"
              />
              <button className="bg-white text-blue-800 hover:bg-blue-100 px-4 py-2 rounded-r-md transition">
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-blue-400 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-blue-100 text-sm mb-4 md:mb-0">
          &copy; 2024 Health Care. Bảo lưu mọi quyền.
        </p>
        <div className="flex space-x-6">
          <a href="#" className="text-blue-100 hover:text-white text-sm transition">
            Điều khoản dịch vụ
          </a>
          <a href="#" className="text-blue-100 hover:text-white text-sm transition">
            Chính sách bảo mật
          </a>
          <a href="#" className="text-blue-100 hover:text-white text-sm transition">
            Chính sách cookie
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
