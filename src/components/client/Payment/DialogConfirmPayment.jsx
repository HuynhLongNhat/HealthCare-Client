import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X } from "lucide-react";

const DialogConfirmPayment = ({ open, onOpenChange, onConfirm }) => {
  const handleConfirmPayment = () => {
    onConfirm()
    onOpenChange()
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Xác nhận thanh toán
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xác nhận đã thanh toán cho bệnh nhân không?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button variant="info" onClick={() => handleConfirmPayment()}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogConfirmPayment