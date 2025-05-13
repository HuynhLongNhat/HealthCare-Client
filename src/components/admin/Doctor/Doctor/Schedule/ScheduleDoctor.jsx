/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Plus, Calendar, MapPin, Building, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddAppointmentDialog from "./AddScheduleDialog";
import DoctorScheduleInfo from "./DoctorScheduleInfo";
import PatientNotifications from "./PatientNotifications";
import { getDoctorSchedulesByClinic } from "@/api/doctor.api";
import { useParams } from "react-router-dom";
import ScheduleList from "./ScheduleList";
import useAuthToken from "@/utils/userAuthToken";

const ScheduleDoctor = ({ doctor }) => {
  const { doctorId } = useParams();
  const [schedules, setSchedules] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedClinics, setExpandedClinics] = useState({});
  const [selectedClinic, setSelectedClinic] = useState(null);
  const auth = useAuthToken()
  useEffect(() => {
    fetchAllDoctorSchedules();
  }, [doctorId]);

  const fetchAllDoctorSchedules = async () => {
    if (!doctorId || !doctor?.doctor?.clinics?.length) return;
    
    setIsLoading(true);
    try {
      const clinicPromises = doctor.doctor.clinics.map(clinic => 
        getDoctorSchedulesByClinic(doctorId, clinic.id)
      );
      
      const results = await Promise.all(clinicPromises);
      const allSchedules = results.reduce((acc, res, index) => {
        const clinicId = doctor.doctor.clinics[index].id;
        return { ...acc, [clinicId]: res.DT };
      }, {});
      
      setSchedules(allSchedules);
      
      // Initialize expanded state for all clinics
      if (Object.keys(expandedClinics).length === 0) {
        const initialExpanded = {};
        doctor.doctor.clinics.forEach(clinic => {
          initialExpanded[clinic.id] = true;
        });
        setExpandedClinics(initialExpanded);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleClinic = (clinicId) => {
    setExpandedClinics(prev => ({
      ...prev,
      [clinicId]: !prev[clinicId]
    }));
  };

  const handleUpdateAppointment = (clinicId, updatedAppointment) => {
    setSchedules(prev => ({
      ...prev,
      [clinicId]: prev[clinicId].map(appt => 
        appt.id === updatedAppointment.id ? updatedAppointment : appt
      )
    }));
  };

  const openAddDialog = (clinicId) => {
    setSelectedClinic(clinicId);
    setIsDialogOpen(true);
  };

  return (
    <div className="">
      {/* Header section with gradient background */}
      <div className="bg-blue-50  rounded-b-3xl shadow-lg py-8 px-6 mb-8 ">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="h-7 w-7 text-blue-500" />
            <h1 className="text-2xl font-bold text-blue-500">
              Lịch làm việc bác sĩ
            </h1>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
            <DoctorScheduleInfo doctor={doctor} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6  ">
        {/* Main content - Clinics and schedules */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : doctor?.doctor?.clinics?.length > 0 ? (
            <div className="">
              {doctor.doctor.clinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md"
                >
                  <div
                    className="px-6 py-4 border-b border-gray-100 cursor-pointer transition-all"
                    onClick={() => toggleClinic(clinic.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 rounded-full p-2.5">
                          <Building className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {clinic.name}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="truncate max-w-md">
                              {clinic.address}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                          {schedules[clinic.id]?.length || 0} lịch khám
                        </span>
                        {expandedClinics[clinic.id] ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedClinics[clinic.id] && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center mb-5">
                        <div className="flex-1" />
                        {(auth === null || auth?.role !== 3) && (
                          <div className="flex justify-end mr-5">
                            <Button
                              variant="info"
                              onClick={() => openAddDialog(clinic.id)}
                            >
                              <Plus size={18} />
                              Thêm lịch mới
                            </Button>
                          </div>
                        )}
                      </div>

                      {schedules[clinic.id]?.length > 0 ? (
                        <ScheduleList
                          schedules={schedules[clinic.id]}
                          onUpdate={(updated) =>
                            handleUpdateAppointment(clinic.id, updated)
                          }
                          fetch={fetchAllDoctorSchedules}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center py-10 px-6 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                          <div className="bg-gray-100 rounded-full p-3 mb-3">
                            <Calendar className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-700 mb-2">
                            Chưa có lịch khám
                          </h3>
                          <p className="text-sm text-gray-500 max-w-md mb-4">
                            Bạn chưa có lịch khám nào tại phòng khám này. Thêm
                            lịch khám để bắt đầu.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white border border-dashed border-gray-200 rounded-xl shadow-sm">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <Building className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-3">
                Bác sĩ chưa có phòng khám
              </h3>
              <p className="text-base text-gray-500 max-w-md mb-6">
                Hiện tại bác sĩ chưa được gắn với bất kỳ phòng khám nào. Vui
                lòng liên hệ quản trị viên để cập nhật thông tin.
              </p>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm">
                Liên hệ hỗ trợ
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar - Notifications */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-6">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-4">
              <div className="bg-orange-100 rounded-full p-1.5">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Thông báo</h3>
            </div>
            <PatientNotifications />
          </div>
        </div>
      </div>

      {/* Add appointment dialog */}
      <AddAppointmentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        clinicId={selectedClinic}
        fetch={fetchAllDoctorSchedules}
      />
    </div>
  );
};

export default ScheduleDoctor;