import ScheduleItem from "./ScheduleItem";

const ScheduleList = ({ schedules, onUpdate , fetch }) => {
  return (
    <div className="space-y-4">
      {schedules.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Chưa có lịch khám nào được đặt
        </div>
      ) : (
        schedules.map((schedule) => (
          <ScheduleItem
            key={schedule.id}
            schedule={schedule}
            onUpdate={onUpdate}
            fetch={fetch}
          />
        ))
      )}
    </div>
  );
};

export default ScheduleList;