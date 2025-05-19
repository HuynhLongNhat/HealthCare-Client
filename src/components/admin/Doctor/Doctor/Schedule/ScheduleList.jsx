import useAuthToken from "@/utils/userAuthToken";
import ScheduleItem from "./ScheduleItem";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const ScheduleList = ({ schedules, onUpdate, fetch ,doctor }) => {
  const auth = useAuthToken();

  return (
    <div className="space-y-6 p-4 max-w-4xl mx-auto">
      {auth === null ? (
        <div className="text-center p-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-200 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-blue-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Vui lòng đăng nhập
          </h3>
          <p className="text-gray-500">
            Đăng nhập để xem và đặt lịch khám 
          </p>
          <Button variant="info" className="mt-2">
          <LogIn/>  Đăng nhập ngay
          </Button>
        </div>
      ) : schedules.length === 0 ? (
        <div className="text-center p-8 rounded-xl bg-white border border-gray-200 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Chưa có lịch khám nào
          </h3>
          <p className="text-gray-500 mb-4">
            Bạn chưa đặt lịch khám nào. Hãy đặt lịch ngay để trải nghiệm dịch vụ của chúng tôi
          </p>
          <button className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition duration-200 shadow-md">
            Đặt lịch ngay
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Lịch khám 
          </h2>
          <div className="grid gap-4">
            {schedules.map((schedule) => (
              <ScheduleItem
                key={schedule.id}
                doctor={doctor}
                schedule={schedule}
                onUpdate={onUpdate}
                fetch={fetch}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleList;