import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  X,
  Loader2,
  Camera,
  Check,
  Edit,
  Lock,
  Globe,
  UserCircle,
  Home,
} from "lucide-react";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import { getUserProfile, updateUserProfile } from "@/api/auth.api";
import {  Link, useParams } from "react-router-dom";
import { getDistricts, getProvinces, getWards } from "@/api/address.api";
import { Button } from "./ui/button";
import useAuthToken from "@/utils/userAuthToken";

const UserProfile = () => {
  const { userId } = useParams();
  const auth = useAuthToken();
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    profile_picture: "",
  });
  const [initialAddressParts, setInitialAddressParts] = useState({
    street: "",
    ward: "",
    district: "",
    province: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await getProvinces();
      setProvinces(data);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        const data = await getDistricts(selectedProvince);
        setDistricts(data);
        setWards([]);
        setSelectedDistrict("");
        setSelectedWard("");
      };
      fetchDistricts();
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        const data = await getWards(selectedDistrict);
        setWards(data);
        setSelectedWard("");
      };
      fetchWards();
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (
      selectedProvince ||
      selectedDistrict ||
      selectedWard ||
      streetAddress !== initialAddressParts.street
    ) {
      const provinceName =
        provinces.find((p) => p.value === selectedProvince)?.label || "";
      const districtName =
        districts.find((d) => d.value === selectedDistrict)?.label || "";
      const wardName = wards.find((w) => w.value === selectedWard)?.label || "";

      const completeAddress = [
        streetAddress,
        wardName,
        districtName,
        provinceName,
      ]
        .filter(Boolean)
        .join(", ");

      setFormData((prev) => ({ ...prev, address: completeAddress }));
      setFullAddress(completeAddress);
    }
  }, [
    streetAddress,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    provinces,
    districts,
    wards,
    initialAddressParts,
  ]);

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const res = await getUserProfile(userId);
      if (res && res.EC === 0) {
        const userData = res.DT;
        setUserData(userData);
        setAvatar(userData.profile_picture || "");

        setFormData({
          fullname: userData.full_name || "",
          username: userData.username || "",
          email: userData.email || "",
          dob: userData.dob ? moment(userData.dob).format("YYYY-MM-DD") : "",
          gender: userData.gender || "",
          phone: userData.phone_number || "",
          address: userData.address || "",
          profile_picture: userData.profile_picture || "",
        });
        setFullAddress(userData.address || "");

        // Tách địa chỉ thành các phần: street, ward, district, province
        if (userData.address) {
          const parts = userData.address.split(",").map((part) => part.trim());
          const [street, ward, district, province] = [
            parts[0] || "",
            parts[1] || "",
            parts[2] || "",
            parts[3] || "",
          ];

          setStreetAddress(street);
          setInitialAddressParts({ street, ward, district, province });

          // Tìm giá trị value tương ứng để set cho dropdown nếu cần
          const findValue = (list, label) =>
            list.find((item) => item.label === label)?.value || "";

          setSelectedProvince(findValue(provinces, province));
          setSelectedDistrict(findValue(districts, district));
          setSelectedWard(findValue(wards, ward));
        }
      }
    } catch (error) {
      toast.error("Không thể tải thông tin người dùng");
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_DB
        }/image/upload`,
        formData
      );
      setAvatarUrl(response.data.secure_url);
    } catch (error) {
      toast.error("Lỗi khi tải ảnh lên");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullname.trim())
      newErrors.fullname = "Họ và tên không được để trống";
    if (!formData.username.trim())
      newErrors.username = "Tên người dùng không được để trống";
    if (!formData.email.trim()) newErrors.email = "Email không được để trống";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updateData = {
        full_name: formData.fullname,
        username: formData.username,
        email: formData.email,
        gender: formData.gender,
        phone_number: formData.phone,
        address: formData.address,
        dob: formData.dob ? formData.dob : null,
        profile_picture: avatarUrl || avatar,
      };
      const response = await updateUserProfile(userId, updateData);
      if (response?.EC === 0) {
        await fetchUserProfile();
        toast.success("Cập nhật thông tin thành công");
        setIsEditing(false);
      }
      if (response.EC === -1) {
        toast.error(response.EM);
      }
      if (response.EC === -2) {
        toast.error(response.EM);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error?.details || "Đã xảy ra lỗi khi cập nhật"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      fullname: userData.full_name || "",
      username: userData.username || "",
      email: userData.email || "",
      dob: userData.dob ? moment(userData.dob).format("YYYY-MM-DD") : "",
      gender: userData.gender || "",
      phone: userData.phone_number || "",
      address: userData.address || "",
      profile_picture: userData.profile_picture || "",
    });
    setErrors({});
  };

  return (
    <div className="container mx-auto p-6 mt-20 bg-white shadow-md rounded-lg">
      <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
        <ol className="list-reset flex">
          <li>
            <Link to="/" className="text-blue-600 hover:underline">
              <Home size={18} />
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-500">Thông tin cá nhân</li>
        </ol>
      </nav>
      <div className="max-w-7xl mt-5 mx-auto  dark:bg-gray-800 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="md:w-1/3 relative bg-gradient-to-b from-blue-600 to-indigo-700 dark:from-gray-700 dark:to-gray-800 p-6 md:p-8 flex flex-col items-center">
          <div className="relative group mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white/20 overflow-hidden">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                  <UserCircle className="text-gray-400 w-20 h-20" />
                </div>
              )}
            </div>

            {isEditing && (
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="text-white w-8 h-8" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">
              {userData?.full_name || "Chưa cập nhật"}
            </h2>
            <p className="text-blue-200 text-sm">@{userData?.username}</p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-sm">
              {userData?.role_id === 1
                ? "👑 Admin"
                : userData?.role_id === 2
                ? "👨⚕ Bác sĩ"
                : "👤 Người dùng"}
            </div>
          </div>

          <div className="mt-8 w-full space-y-4">
            <div className="flex items-center text-white/80">
              <Lock className="w-5 h-5 mr-2" />
              <span>
                Tham gia: {moment(userData?.createdAt).format("DD/MM/YYYY")}
              </span>
            </div>
            <div className="flex items-center text-white/80">
              <Globe className="w-5 h-5 mr-2" />
              <span>{userData?.address || "Chưa cập nhật địa chỉ"}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Chỉnh sửa hồ sơ
                </h3>
                <Button variant="ghost" onClick={cancelEdit}>
                  <X className="w-5 h-5 text-red-500 " />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.fullname ? "border-red-500" : "border-gray-300"
                    } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                  />
                  {errors.fullname && (
                    <p className="text-red-500 text-sm">{errors.fullname}</p>
                  )}
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                    disabled={true}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Địa chỉ
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={selectedProvince}
                      onChange={(e) =>
                        setSelectedProvince(Number(e.target.value))
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {provinces.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>

                    {/* Quận/Huyện */}
                    <select
                      value={selectedDistrict}
                      onChange={(e) =>
                        setSelectedDistrict(Number(e.target.value))
                      }
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      disabled={!selectedProvince}
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>

                    {/* Phường/Xã */}
                    <select
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(Number(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      disabled={!selectedDistrict}
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.map((w) => (
                        <option key={w.value} value={w.value}>
                          {w.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Nhập số nhà, tên đường..."
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  {/* Display full address preview */}
                  {fullAddress && (
                    <div className="mt-3 p-3 bg-blue-50 text-blue-800 rounded-lg">
                      <p className="text-sm font-medium">Địa chỉ đầy đủ:</p>
                      <p>{fullAddress}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-8 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Check className="w-5 h-5 mr-2" />
                  )}
                  Lưu thay đổi
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Huỷ bỏ
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Thông tin cá nhân
                </h3>
                {Number(userId) === Number(auth?.userId) && (
                  <Button onClick={() => setIsEditing(true)} variant="ghost">
                    <Edit className="w-5 h-5 text-blue-500" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={Mail} label="Email" value={userData?.email} />
                <InfoItem
                  icon={Phone}
                  label="Số điện thoại"
                  value={userData?.phone_number}
                />
                <InfoItem
                  icon={Calendar}
                  label="Ngày sinh"
                  value={
                    userData?.dob
                      ? moment(userData.dob).format("DD/MM/YYYY")
                      : ""
                  }
                />
                <InfoItem
                  icon={User}
                  label="Giới tính"
                  value={userData?.gender}
                />
                <InfoItem
                  icon={MapPin}
                  label="Địa chỉ"
                  value={userData?.address}
                  fullWidth
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value, fullWidth }) => (
  <div
    className={`flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-xl ${
      fullWidth ? "md:col-span-2" : ""
    }`}
  >
    <div className="p-3 bg-white dark:bg-gray-600 rounded-lg shadow-sm mr-4">
      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="font-medium text-gray-800 dark:text-white">
        {value || "Chưa cập nhật"}
      </p>
    </div>
  </div>
);

export default UserProfile;
