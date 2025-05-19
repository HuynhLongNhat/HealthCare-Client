/* eslint-disable react/prop-types */
import { Trash, AlertTriangle, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const DeleteModal = ({
  show,
  handleClose,
  data,
  handleDelete,
  fetch,
}) => {
  const confirmDelete = async () => {
    try {
      const res = await handleDelete();
      if (res && res?.EC === 0) {
        toast.success(res.EM);
        handleClose();
        fetch();
      } else if (res && res?.EC === -1) {
        toast.error(res.EM);
        handleClose();
      }
    } catch (error) {
      console.error("Error deleting", error);
      toast.error("Đã xảy ra lỗi trong quá trình xóa.");
    }
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 text-lg">
            <AlertTriangle className="w-5 h-5" />
            Xác nhận xóa {data?.name || data?.full_name || data?.room_name}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            Bạn có chắc chắn muốn thực hiện thao tác này không? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex items-center gap-1"
          >
            <X size={16} />
            Đóng
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            className="flex items-center gap-1"
          >
            <Check size={16} />
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
