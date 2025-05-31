/* eslint-disable react/prop-types */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Trash2,
  Pill,
  AlertCircle,
  Clock,
  Package,
  Edit,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import DeleteModal from "@/components/DeleteModal";
import { deletePrescription } from "@/api/appointment.api";
import EditPrescription from "./EditPrescription";
import useAuthToken from "@/utils/userAuthToken";

const MedicationItem = ({ medication, fetch , booking}) => {
  const auth = useAuthToken()
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dataToDelete, setDataToDelete] = useState("")
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [dataToEdit, setDataToEdit] = useState("")
  
  const getCategoryColor = (category) => {
    const formColors = {
      "Viên nén": "bg-blue-50 text-blue-700 border-blue-100",
      "Viên nang": "bg-indigo-50 text-indigo-700 border-indigo-100",
      "Viên sủi": "bg-teal-50 text-teal-700 border-teal-100",
      "Sirô": "bg-pink-50 text-pink-700 border-pink-100",
      "Thuốc tiêm": "bg-red-50 text-red-700 border-red-100",
      "Kem bôi": "bg-yellow-50 text-yellow-700 border-yellow-100",
      "Dung dịch": "bg-amber-50 text-amber-700 border-amber-100",
      "Thuốc nhỏ mắt": "bg-green-50 text-green-700 border-green-100",
      "Thuốc nhỏ mũi": "bg-cyan-50 text-cyan-700 border-cyan-100",
      "Dung dịch hít": "bg-cyan-50 text-cyan-700 border-cyan-100",

    };

    return formColors[category] || "bg-gray-50 text-gray-600 border-gray-100";
  };
  const handleDelete = (data) => { 
  setShowDeleteDialog(true);
  setDataToDelete(data)
  }
  const handleDeleteMedication = () => {
    return deletePrescription(dataToDelete.id)
  }
  const handleEdit = (data) => {
    setShowEditDialog(true);
    setDataToEdit(data)
  }
  return (
     <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl overflow-hidden bg-white shadow-sm border hover:bg-blue-50 border-gray-100  transition-all duration-300"
    >
      <motion.div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start gap-4 flex-1">
          <motion.div
            className={`p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Pill className="h-5 w-5 text-indigo-600" />
          </motion.div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3
                className="font-semibold text-gray-900 truncate min-w-[120px]"
                title={medication.medication_name}
              >
                {medication.medication_name}
              </h3>

              <Badge
                variant="outline"
                className={cn(
                  "font-normal text-xs px-2 py-0.5 rounded-full text-center",
                  "max-w-[150px] truncate",
                  getCategoryColor(medication.category)
                )}
                title={medication.category || "Không phân loại"}
              >
                {medication.category || "Không phân loại"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {medication.form && (
                <span className="text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg inline-flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  {medication.form}
                </span>
              )}
              <span className="text-xs text-gray-600 line-clamp-1 inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {medication.instructions
                  ? medication.instructions.split(" ").slice(0, 4).join(" ") +
                    "..."
                  : "Không có hướng dẫn"}
              </span>
            </div>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-50 p-2 rounded-full"
        >
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-6 py-5 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
                      Đơn vị tính
                    </p>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className="bg-white px-3 py-2 rounded-xl font-medium shadow-sm border border-gray-100 text-center"
                    >
                      {medication.unit}
                    </motion.div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
                      Số lượng
                    </p>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className="bg-white px-3 py-2 rounded-xl font-medium shadow-sm border border-gray-100 text-center"
                    >
                      {medication.quantity} {medication.unit}
                    </motion.div>
                  </div>
                </div>

                {medication.form && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
                      Dạng thuốc
                    </p>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className="bg-white px-3 py-2 rounded-xl font-medium shadow-sm border border-gray-100"
                    >
                      {medication.form}
                    </motion.div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {medication.instructions && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
                      Hướng dẫn sử dụng
                    </p>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 shadow-sm"
                    >
                      <p className="text-sm text-indigo-900">
                        {medication.instructions}
                      </p>
                    </motion.div>
                  </div>
                )}

                {medication.note && (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
                      Ghi chú
                    </p>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className="bg-amber-50 border border-amber-100 rounded-xl p-3 shadow-sm"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-800">
                          {medication.note}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
            {auth && ((auth.role === 1) || auth.userId === booking?.doctorData?.userData?.id) && (

              <>
                <Separator className="my-5" />
                <div className="flex justify-end gap-3">
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleEdit(medication)
                          }}
                          className="rounded-xl px-4 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 transition-all"
                        >
                          <Edit className="h-3.5 w-3.5 text-yellow-600 " />
                      
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Chỉnh sửa thông tin thuốc</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleDelete(medication)
                            
                          }}
                          className="border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl px-4 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                         
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Xóa thuốc khỏi đơn</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </>
              )}
          </motion.div>
        )}
      </AnimatePresence>
      {showDeleteDialog && (

    
      <DeleteModal
        show={showDeleteDialog}
        handleClose={() => setShowDeleteDialog(false)}
        handleDelete={ handleDeleteMedication }
        fetch={fetch}
        />
      )}
      
      {showEditDialog && (
        <EditPrescription
          open={showEditDialog}
          handleClose={() => setShowEditDialog(false)}
          data={dataToEdit}
          fetch={fetch}
      />
      )}
    </motion.div>
  );
};

export default MedicationItem;
