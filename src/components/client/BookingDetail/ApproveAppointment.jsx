/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  Loader2,

} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { approvalAppointment } from "@/api/appointment.api";
import { toast } from "react-toastify";

const ApproveAppointment = ({ show, handleClose, data, fetch }) => {
  const [isLoading, seIsLoading] = useState(false);

// approvalAppointment
  const handleApprove = async () => {
    try {
      seIsLoading(true)
        const res = await approvalAppointment(data.appointment.id);
        if (res.EC === 0) {
            toast.success(res.EM)
            handleClose()
            fetch()
            seIsLoading(false)
        }
        else {
            toast.error(res.EM)
        }
    } catch (error) {
      console.error("Error approving appointment:", error);
    } finally {
      seIsLoading(false);
    }
  };

  return (
    <>
      {/* Approval Dialog */}
      <Dialog
        open={show}
        onOpenChange={() => {
          handleClose();
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <Check className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle>Xác nhận phê duyệt lịch hẹn</DialogTitle>
                <DialogDescription>
                  Xem xét thông tin lịch hẹn trước khi phê duyệt
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

        
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleClose()}
              disabled={isLoading}
            >
              Đóng
            </Button>
            <Button
              variant="info"
              onClick={handleApprove}
              disabled={isLoading}
            >
            {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span className="text-[15px]">Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      <span className="text-[15px]">Xác nhận</span>
                    </>
                  )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApproveAppointment;
