export const getStatusColor = (code) => {
  switch (code) {
    case 1: // Chờ xác nhận
      return "text-yellow-600";
    case 2: // Đã xác nhận
      return "text-blue-600";
    case 3: // Đã hoàn thành
      return "text-green-600";
    case 4: // Đã hủy
      return "text-gray-500";
    case 5: // Đã từ chối
      return "text-red-600";
    default:
      return "text-black";
  }
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return "Số điện thoại chưa cập nhật";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3");
  } else if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  } else {
    return phone;
  }
};

export const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hasBirthdayPassed) age -= 1;
  return age;
};

export  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
    : null;
      
 export const formatTime = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

export  const formatMoney = (value) =>
    value
      ? new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          minimumFractionDigits: 0,
        }).format(value)
      : null;