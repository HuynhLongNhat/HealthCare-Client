/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  FileText,
  User,
  Upload,
  X,
  CheckCircle,
  Phone,
  MapPin,
  Calendar,
  Check,
} from "lucide-react";
import { calculateAge, formatPhoneNumber } from "@/utils/helpers";
import { sendPrescription } from "@/api/appointment.api";
import { toast } from "react-toastify";

const SendPrescriptionModal = ({
  open,
  onOpenChange,
  booking,
  prescription,
}) => {
    console.log("booking" , booking)
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const uploadToCloudinary = async (file) => {
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_DB;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('resource_type', 'preset_raw_upload');
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: 'POST',
          body: formData,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const handleSendPrescription = async () => {
    if (!file) {
      toast.error("Vui lòng chọn file đơn thuốc");
      return;
    }

    try {
      setIsLoading(true);
      
      // 1. Upload file to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(file);
      
      // 2. Send prescription with Cloudinary URL to server
      const res = await sendPrescription(prescription.id, {
          patientInfo: booking.patientData,
          doctorData: booking.doctorData,
          clinicData: booking.clinicData,
          scheduleData : booking.scheduleData,
        prescriptionUrl: cloudinaryUrl,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + " MB"

      });

      if (res.EC === 0) {
        toast.success("Gửi đơn thuốc thành công");
        onOpenChange(false);
        setFile(null);
        setUploadProgress(0);
      } else {
        toast.error(res.EM || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error sending prescription:", error);
      toast.error("Có lỗi xảy ra khi gửi đơn thuốc");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            Gửi đơn thuốc
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Xem lại thông tin bệnh nhân và tải lên đơn thuốc để gửi
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Info Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={booking.patientData?.profile_picture} />
                <AvatarFallback className="bg-blue-200 text-blue-700">
                  {booking.patientData.full_name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {booking.patientData?.full_name || "Không có thông tin"}
                  </h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    Bệnh nhân
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    {booking?.patientData?.dob && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        {calculateAge(booking.patientData.dob)} tuổi
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-blue-500" />
                    {booking.patientData?.gender || "N/A"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Số điện thoại
                      </p>
                      <p className="text-sm font-medium">
                        {formatPhoneNumber(booking.patientData?.phone_number) ||
                          "Không có thông tin"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Địa chỉ
                      </p>
                      <p className="text-sm font-medium">
                        {booking.patientData?.address || "Không có thông tin"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Đơn thuốc
              </h4>
              <p className="text-xs text-gray-500">
                Chỉ chấp nhận file PDF có kích thước tối đa 10MB
              </p>
            </div>

            {!file ? (
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Kéo thả file PDF vào đây
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      hoặc{" "}
                      <span className="text-blue-600 font-medium">
                        nhấp để chọn file
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900">{file.name}</p>
                      <p className="text-sm text-green-600">
                        {formatFileSize(file.size)}
                      </p>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="w-full mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-right">
                            {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {uploadProgress === 100 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : null}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-gray-500 hover:text-red-500"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                removeFile();
              }}
              disabled={isLoading}
              className="px-6"
            >
              <X className="h-4 w-4" />
              Hủy
            </Button>
            <Button
              onClick={handleSendPrescription}
              disabled={!file || isLoading}
              className="px-6 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  <span className="text-[15px]">Gửi</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendPrescriptionModal;