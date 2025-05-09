/* eslint-disable react/prop-types */
import { Clock, Calendar, Trash, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { deleteScheduleById } from "@/api/doctor.api";
import DeleteModal from "@/components/DeleteModal";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { getAuth } from "@/utils/getAuth";

dayjs.extend(customParseFormat);
const ScheduleItem = ({ schedule, onBook, fetch }) => {
      const [showDeleteModal, setShowDeleteModal] = useState(false);
      const [dataToDelete, setDataToDelete] = useState(null);
      const auth = getAuth()
  const statusConfig = {
    AVAILABLE: {
      text: "Có thể đặt",
      class: "bg-green-100 text-green-800 border-green-200",
      icon: <BookOpen className="h-3 w-3" />
    },
    full: {
      text: "Đã đầy",
      class: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: <Clock className="h-3 w-3" />
    },
    canceled: {
      text: "Đã hủy",
      class: "bg-red-100 text-red-800 border-red-200",
      icon: <Trash className="h-3 w-3" />
    },
  };

  const currentStatus = statusConfig[schedule.status] || statusConfig.AVAILABLE;
   
  const handleDeleteSchedule = (schedule) => { 
    setDataToDelete(schedule);
    setShowDeleteModal(true);
  }
    const handleDelete = () =>{
        return  deleteScheduleById(dataToDelete?.id)
      }
  return (
    <div className="border rounded-xl overflow-hidden transition-all hover:shadow-md bg-white group">
      <div className="flex flex-col sm:flex-row justify-between p-5 gap-4">
        <div className={cn(
          "flex items-center gap-4 min-w-[180px]",
          "border-r border-gray-100 pr-4"
        )}>
          <div className={cn(
            "flex flex-col items-center justify-center p-3 rounded-xl border",
            "bg-blue-50 text-blue-700 w-14 border-blue-100"
          )}>
            <Calendar size={18} className="mb-1 text-blue-600" />
            <span className="text-sm font-medium">
              {new Date(schedule.date).toLocaleDateString('vi-VN', { day: '2-digit' })}
            </span>
            <span className="text-xs">
              {new Date(schedule.date).toLocaleDateString('vi-VN', { month: 'short' })}
            </span>
          </div>

          <div className="flex flex-col">
            <h3 className="font-medium text-gray-900">
              {new Date(schedule.date).toLocaleDateString('vi-VN', { weekday: 'long' })}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Clock size={14} className="text-blue-500" />
              <span>
              {dayjs(schedule.time_start, 'HH:mm:ss').format('HH:mm')} - {dayjs(schedule.time_end, 'HH:mm:ss').format('HH:mm')}

               </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          <div className="flex-1">
            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border",
              currentStatus.class
            )}>
              {currentStatus.icon}
              {currentStatus.text}
            </div>
          </div>

          <div className="flex gap-2">
            {schedule.status === "AVAILABLE" && (
              <Button 
                onClick={() => onBook(schedule)}
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4"
                size="sm"
              >
                <BookOpen className="h-4 w-4" />
                Đặt lịch
              </Button>
            )}
           {auth.role !== 3 && (
            <Button 
              variant="outline"
              onClick={() => handleDeleteSchedule(schedule)}
              className="p-2 text-red-600 hover:bg-red-50 border-red-200 hover:border-red-300"
              size="sm"
            >
              <Trash className="h-4 w-4" />
            </Button> )}
          </div>
        </div>
      </div>
      {schedule.note && (
        <div className="px-5 pb-4 pt-2 border-t border-gray-100 bg-gray-50 text-sm text-gray-600">
          <p>{schedule.note}</p>
        </div>
      )}
      {dataToDelete && 
        <DeleteModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          data={dataToDelete}
          handleDelete={handleDelete}
          fetch={fetch}
        
        />
}
    </div>
  );
};

export default ScheduleItem;