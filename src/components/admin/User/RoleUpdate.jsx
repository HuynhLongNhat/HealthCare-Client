/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const RoleUpdate = ({
  user,
  showRoleMenu,
  roles,
  onRoleClick,
  onRoleUpdate,
  onClose,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleRoleSelect = (role) => {
    if (user?.role.id === role.id) {
      return;
    }
    setSelectedRole(role);
    setShowConfirmModal(true);
    onRoleClick(null);
  };

  const handleConfirmRoleUpdate = async () => {
    await onRoleUpdate(user, selectedRole);
    setShowConfirmModal(false);
  };
  return (
    <>
      <div className="relative" ref={menuRef}>
        <AnimatePresence>
          {showRoleMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, type: "spring", stiffness: 300 }}
              className="absolute z-50 right-0 mt-2 w-64 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-sm"
              style={{
                transform: "translateY(0%)",
              }}
            >
              <div className="p-2">
                {roles.map((role) => (
                  <motion.button
                    key={role.id}
                    onClick={() => handleRoleSelect(role)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-sm transition-all duration-200 hover:bg-gray-50"
                  >
                    <span
                      className={`flex-shrink-0 h-2.5 w-2.5 rounded-full ${
                        role.id === 1
                          ? "bg-purple-500"
                          : role.id === 2
                          ? "bg-blue-500"
                          : "bg-green-500"
                      }`}
                    />

                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {role.label}
                      </span>
                      {role.id === 1
                        ? "Quản trị hệ thống"
                        : role.id === 2
                        ? "Bác sĩ chuyên môn"
                        : "Người dùng hệ thống"}
                    </div>

                    {user?.role.id === role.id && (
                      <span className="absolute right-4">
                        <Check size={16} className="text-green-500" />
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Xác nhận thay đổi Role
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-3">
              Bạn có chắc chắn muốn thay đổi role của user{" "}
              <span className="font-medium text-gray-900">
                {user?.fullname}
              </span>{" "}
              thành{" "}
              <span
                className={`font-medium ${
                  selectedRole?.id === "admin"
                    ? "text-purple-600"
                    : selectedRole?.id === "teacher"
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                {selectedRole?.label}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <X size={16} className="mr-2" />
              Hủy
            </button>
            <button
              onClick={handleConfirmRoleUpdate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <Check size={16} className="mr-2" />
              Xác nhận
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoleUpdate;
