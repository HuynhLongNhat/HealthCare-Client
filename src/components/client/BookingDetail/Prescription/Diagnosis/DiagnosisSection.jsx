/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  Stethoscope,
  Clock,
  Edit,
  Trash,
  Plus,
  AlertCircle,
  FileText,
  Activity,
  ListChecks,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import moment from "moment";
import EditDiagnosis from "./EditDiagnosis";
import AddNewDiagnosis from "./AddNewDiagnosis";
import { useParams } from "react-router-dom";
import {
  deleteDiagnosis,
  getDiagnosisByAppointmentId,
} from "@/api/appointment.api";
import DeleteModal from "./DeleteModal";
import { toast } from "react-toastify";
import useAuthToken from "@/utils/userAuthToken";

const DiagnosisSection = ({booking}) => {
  const auth = useAuthToken();
  const { appointmentId } = useParams();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [isLoading] = useState(false);

  const handleDelete = () => {
    setShowDeleteModal(true);
    setDataToDelete(diagnosis);
  };

  const handleDeleteDiagnosis = async () => {
    try {
      const res = await deleteDiagnosis(dataToDelete?.diagnosis?.id);
      if (res.EC === 0) {
        setDiagnosis(null);
        toast.success(res.EM);
      } else {
        toast.error(res.EM);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setShowDeleteModal(false);
      setDataToDelete(null);
    }
  };

  const fetchDiagnosisData = async () => {
      const res = await getDiagnosisByAppointmentId(appointmentId);
      if (res.EC === 0) {
        setDiagnosis(res.DT);
      }
  };

  useEffect(() => {
    fetchDiagnosisData();
  }, [appointmentId]);

  const renderDiagnosisContent = (text, icon = null) => {
    if (!text)
      return <p className="text-gray-500 italic">Không có thông tin</p>;

    return (
      <ul className="space-y-2">
        {text.split("\n").map((item, index) => (
          <li key={index} className="flex items-start text-gray-800">
            <span className="mr-2 text-blue-500 font-bold shrink-0">
              {icon || "•"}
            </span>
            <span className="text-gray-700">{item.trim()}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Card className="mb-8 overflow-hidden border-gray-200 shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-500 p-4 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Stethoscope className="h-5 w-5" />
            Thông tin chẩn đoán
          </CardTitle>
        </div>
      </CardHeader>

      {isLoading ? (
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center py-8 text-center text-gray-600">
            <div className="h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4"></div>
            <p className="text-lg font-medium">
              Đang tải thông tin chẩn đoán...
            </p>
          </div>
        </CardContent>
      ) : diagnosis ? (
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            {/* Thông tin bác sĩ */}
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-blue-100 ring-2 ring-blue-50">
                <AvatarImage
                  src={
                    diagnosis?.appointment?.appointmentData?.doctorData
                      ?.userData?.profile_picture
                  }
                  alt={
                    diagnosis?.appointment?.appointmentData?.doctorData
                      ?.userData?.full_name
                  }
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium text-lg">
                  {diagnosis?.appointment?.appointmentData?.doctorData?.userData?.full_name
                    ?.split(" ")
                    .pop()
                    ?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-gray-900 text-base">
                  {
                    diagnosis?.appointment?.appointmentData?.doctorData
                      ?.userData?.full_name
                  }
                </h4>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 mt-1"
                >
                  {
                    diagnosis?.appointment?.appointmentData?.doctorData?.doctor
                      ?.specialization?.name
                  }
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center px-3 py-1.5 bg-blue-50 rounded-full text-sm text-blue-700 font-medium border border-blue-100">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
                {moment(diagnosis.createdAt).format("DD/MM/YYYY HH:mm")}
              </div>

              {auth &&
                (auth.role === 1 ||
                  auth.userId ===
                    booking
                      ?.doctorData?.userData?.id) && (
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setShowEditDialog(true)}
                            className="h-9 w-9 rounded-full text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:text-amber-700"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Chỉnh sửa</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={handleDelete}
                            className="h-9 w-9 rounded-full text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Xóa chẩn đoán</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
            </div>
          </div>

          <Separator className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Triệu chứng */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium text-gray-800">Triệu chứng</h4>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                {renderDiagnosisContent(diagnosis?.diagnosis?.symptoms)}
              </div>
            </div>

            {/* Kế hoạch điều trị */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-gray-800">Kế hoạch điều trị</h4>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                {renderDiagnosisContent(diagnosis?.diagnosis?.treatment_plan)}
              </div>
            </div>
          </div>

          {/* Chẩn đoán */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h4 className="font-medium text-gray-800">Chẩn đoán</h4>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
              {renderDiagnosisContent(diagnosis?.diagnosis?.diagnosis)}
            </div>
          </div>

          {/* Lưu ý */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <h4 className="font-medium text-gray-800">Lưu ý</h4>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 shadow-sm">
              {renderDiagnosisContent(diagnosis?.diagnosis?.notes)}
            </div>
          </div>
        </CardContent>
      ) : (
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <Stethoscope className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Chưa có thông tin chẩn đoán
            </h3>
            <p className="text-gray-500 max-w-md">
              Bác sĩ chưa thêm chẩn đoán bệnh nào cho lịch khám này.
            </p>

            {auth &&
              (auth.role === 1 ||
                auth.userId ===
                  booking?.doctorData
                    ?.userData?.id) && (
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="mt-6 bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Thêm chẩn đoán mới
                </Button>
              )}
          </div>
        </CardContent>
      )}

      {/* Edit Dialog */}
      {showEditDialog && (
        <EditDiagnosis
          show={showEditDialog}
          handleClose={() => setShowEditDialog(false)}
          fetch={fetchDiagnosisData}
        />
      )}

      {/* Delete Modal */}
      {dataToDelete && (
        <DeleteModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          data={dataToDelete}
          handleDelete={handleDeleteDiagnosis}
        />
      )}

      {/* Add Dialog */}
      {showAddDialog && (
        <AddNewDiagnosis
          show={showAddDialog}
          handleClose={() => setShowAddDialog(false)}
          fetch={fetchDiagnosisData}
        />
      )}
    </Card>
  );
};

export default DiagnosisSection;
