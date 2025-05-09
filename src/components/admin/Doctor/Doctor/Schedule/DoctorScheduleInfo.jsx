import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
const DoctorScheduleInfo = ({ doctor }) => {
  const navigate = useNavigate()
  return (
    <div className="bg-blue-50 p-4  space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-900">Giá khám</h4>
          <p className="text-blue-600 font-semibold">
            {doctor?.doctor?.consultation_fee
              ? new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                  minimumFractionDigits: 0,
                }).format(doctor.doctor.consultation_fee)
              : "Chưa có giá khám"}
          </p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Các phòng khám</h4>
          <div className="space-y-2">
            {doctor?.doctor?.clinics?.length > 0 ? (
              doctor.doctor.clinics.map(clinic => (
                <div key={clinic.id} className="border-b pb-2">
                  <p className="font-medium text-blue-600 cursor-pointer" onClick={() =>navigate(`/clinics/${clinic.id}`)}>{clinic.name}</p>
                  <p className="text-sm">{clinic.address}</p>
                </div>
              ))
            ) : (
              <p>Chưa có thông tin phòng khám</p>
            )}
          </div>
        </div>
      </div>
  
      {/* Phần bảo hiểm giữ nguyên */}
      <div>
        <h4 className="font-medium text-gray-900">Loại bảo hiểm áp dụng</h4>
        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 mt-1">
          <li>Bảo hiểm y tế nhà nước</li>
          <li>
            Áp dụng với Bảo hiểm y tế hạng 3 
          </li>
          <li className="mt-2 font-medium">Bảo hiểm bảo lãnh</li>
          <li>
            Đối với các đơn vị bảo hiểm không bảo lãnh trực tiếp: Bệnh viện xuất
            hoá đơn tài chính (hoá đơn điện tử) và hỗ trợ bệnh nhân hoàn thiện hồ
            sơ
          </li>
        </ul>
      </div>
    </div>
  );
}
export default DoctorScheduleInfo;



