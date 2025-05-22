import { useNavigate } from 'react-router-dom';

const AllServiceSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Chuyên khoa",
      image: "https://cdn.bookingcare.vn/fo/w384/2023/11/01/140537-chuyen-khoa.png",
      path: "/specializations"
    },
    {
      title: "Cơ sở y tế",
      image: "https://cdn.bookingcare.vn/fo/w384/2023/11/01/141017-csyt.png",
      path: "/clinics"
    },
    {
      title: "Bác sĩ",
      image: "https://cdn.bookingcare.vn/fo/w384/2023/11/01/140234-bac-si.png",
      path: "/doctors"
    },
    {
      title: "Cẩm nang",
      image: "https://cdn.bookingcare.vn/fo/w384/2023/11/01/140319-bai-viet.png",
      path: "/cam-nang-suc-khoe"
    }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 ml-5">Dành cho bạn</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => navigate(service.path)}
            >
              <div className="relative w-64 h-64 mb-4 rounded-full overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
                <div className="absolute inset-0">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black opacity-10 transition-opacity duration-300 group-hover:opacity-20"></div>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center">{service.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllServiceSection;
