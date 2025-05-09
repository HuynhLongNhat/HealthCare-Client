import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Stethoscope } from "lucide-react";
import { resetPassword } from "@/service/authService";

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  useEffect(() => {
    if (!token) {
      setError("Token không hợp lệ hoặc đã hết hạn");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Mật khẩu không khớp");
      setLoading(false);
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword({
        token: token,
        newPassword: passwords.newPassword,
      });
      if (response.data) {
        setSuccess("Mật khẩu đã được cập nhật thành công!");

        navigate("/login");
      }
    } catch (error) {
      console.error("Reset password error:", error);

      if (error.response?.status === 400) {
        setError(
          error.response.data.message || "Token không hợp lệ hoặc đã hết hạn"
        );
      } else if (error.response?.status === 404) {
        setError("Không tìm thấy người dùng");
      } else {
        setError("Có lỗi xảy ra khi cập nhật mật khẩu. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg"
          role="alert"
        >
          <strong className="font-bold">Lỗi!</strong>
          <span className="block sm:inline ml-2">
            Token không hợp lệ hoặc đã hết hạn.
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel */}
      <div
        className="md:w-1/2 bg-primary relative hidden md:flex flex-col justify-center items-center p-12"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1631217868264-e5b90bb7e133)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-primary/70"></div>
        <div className="relative z-10 text-white text-center">
          <Stethoscope className="text-6xl mb-6 mx-auto" />
          <h2 className="text-3xl font-bold mb-4">Welcome to HealthCare</h2>
          <p className="text-xl italic">
            &ldquo;Your health is our priority. Together, we create a healthier
            tomorrow.&ldquo;
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl"
        >
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Đặt lại mật khẩu
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Vui lòng nhập mật khẩu mới của bạn
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md"
              role="alert"
            >
              <span className="block sm:inline">{success}</span>
            </motion.div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword.new ? "text" : "password"}
                    required
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="Nhập mật khẩu mới"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        new: !showPassword.new,
                      })
                    }
                  >
                    {showPassword.new ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword.confirm ? "text" : "password"}
                    required
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="Xác nhận mật khẩu mới"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirm: !showPassword.confirm,
                      })
                    }
                  >
                    {showPassword.confirm ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Cập nhật mật khẩu"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
