/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { format, parseISO, isAfter, isBefore, addMinutes } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Video,
  Calendar as CalendarIcon,
  Clock,
  Search,
  Monitor,
  Loader2,
  Plus,
  Trash2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";

import CreateMeeting from "./CreateMeeting";
import { getAllMeetingByDoctor, deleteMeeting } from "@/api/doctor.api";
import { toast } from "react-toastify";
import DeleteModal from "@/components/DeleteModal";
import useAuthToken from "@/utils/userAuthToken";

const MeetingList = () => {
  const auth = useAuthToken();
  const { doctorId } = useParams();
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);

  useEffect(() => {
    fetchMeetings();
  }, [doctorId]);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const res = await getAllMeetingByDoctor(doctorId);
      if (res.EC === 0) {
        setMeetings(res.DT);
        setFilteredMeetings(res.DT);
      }
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách cuộc họp. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMeetings(meetings);
    } else {
      const filtered = meetings.filter((meeting) =>
        meeting.room_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMeetings(filtered);
    }
  }, [searchTerm, meetings]);

  const joinMeeting = (meetingUrl) => {
    window.open(meetingUrl, "_blank");
  };

  const handleDelete = () => {
    return deleteMeeting(meetingToDelete.id);
  };

  const getMeetingsByStatus = (status) => {
    const now = new Date();

    return filteredMeetings.filter((meeting) => {
      const meetingStart = parseISO(meeting.date);
      const meetingEnd = addMinutes(meetingStart, meeting.duration);

      if (status === "upcoming") {
        return isBefore(now, meetingStart);
      } else if (status === "ongoing") {
        return isAfter(now, meetingStart) && isBefore(now, meetingEnd);
      } else if (status === "past") {
        return isAfter(now, meetingEnd);
      }
      return false;
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Đang tải lịch khám trực tuyến...</span>
      </div>
    );
  }

  const upcomingMeetings = getMeetingsByStatus("upcoming");
  const ongoingMeetings = getMeetingsByStatus("ongoing");
  const pastMeetings = getMeetingsByStatus("past");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-600 tracking-tight">
            Lịch tư vấn sức khỏe
          </h2>
          <p className="text-gray-500 mt-1">
            Danh sách các cuộc họp tư vấn sức khỏe trực tuyến
          </p>
        </div>
        {auth &&
          (auth.role === 1 || Number(auth.userId) === Number(doctorId)) && (
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all"
              onClick={() => setIsCreateMeetingOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Tạo cuộc họp mới
            </Button>
          )}
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Tìm kiếm theo tên phòng họp..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-8">
        {ongoingMeetings.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Video className="mr-2 h-5 w-5 text-blue-600 animate-pulse" />
              <span className="text-blue-600 font-semibold">Đang diễn ra</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ongoingMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  status="ongoing"
                  onJoin={joinMeeting}
                  onDelete={(meeting) => {
                    setMeetingToDelete(meeting);
                    setShowDeleteModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5 text-yellow-600" />
            <span className="text-yellow-600 font-semibold">Sắp tới</span>
          </h3>

          {upcomingMeetings.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Monitor className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Không có cuộc họp nào sắp tới</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  status="upcoming"
                  onJoin={joinMeeting}
                  onDelete={(meeting) => {
                    setMeetingToDelete(meeting);
                    setShowDeleteModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-red-600" />
            <span className="text-red-600 font-semibold">Đã kết thúc</span>
          </h3>

          {pastMeetings.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Monitor className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Không có cuộc họp nào đã kết thúc</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  status="past"
                  onJoin={joinMeeting}
                  onDelete={(meeting) => {
                    setMeetingToDelete(meeting);
                    setShowDeleteModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateMeeting
        open={isCreateMeetingOpen}
        onOpenChange={setIsCreateMeetingOpen}
        fetch={fetchMeetings}
      />

      {meetingToDelete && (
        <DeleteModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          data={meetingToDelete}
          handleDelete={handleDelete}
          fetch={fetchMeetings}
        />
      )}
    </div>
  );
};

const MeetingCard = ({ meeting, status, onJoin, onDelete }) => {
  const auth = useAuthToken();
  const { doctorId } = useParams();
  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, "HH:mm 'ngày' dd/MM/yyyy", { locale: vi });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0
      ? `${hours} giờ ${mins > 0 ? `${mins} phút` : ""}`
      : `${minutes} phút`;
  };

  const getStatusConfig = () => {
    switch (status) {
      case "ongoing":
        return {
          badgeLabel: "Đang diễn ra",
          badgeClass: "bg-blue-100 text-blue-800 border-blue-200",
          headerClass: "bg-blue-50",
          borderClass: "border-blue-200",
          buttonText: "Tham gia ngay",
          buttonClass: "bg-blue-600 hover:bg-blue-700 text-white",
          iconColor: "text-blue-600",
        };
      case "upcoming":
        return {
          badgeLabel: "Sắp diễn ra",
          badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
          headerClass: "bg-amber-50",
          borderClass: "border-amber-200",
          buttonText: "Tham gia cuộc gọi",
          buttonClass: "bg-amber-600 hover:bg-amber-700 text-white",
          iconColor: "text-amber-600",
        };
      case "past":
        return {
          badgeLabel: "Đã kết thúc",
          badgeClass: "bg-red-100 text-red-800 border-red-200",
          headerClass: "bg-gray-50",
          borderClass: "border-gray-200",
          buttonText: "Xem lại thông tin",
          buttonClass: "bg-gray-600 hover:bg-gray-700 text-white",
          iconColor: "text-gray-600",
        };
      default:
        return {
          badgeLabel: "Không xác định",
          badgeClass: "bg-gray-100 text-gray-800 border-gray-200",
          headerClass: "bg-gray-50",
          borderClass: "border-gray-200",
          buttonText: "Xem chi tiết",
          buttonClass: "bg-gray-600 hover:bg-gray-700 text-white",
          iconColor: "text-gray-600",
        };
    }
  };

  const statusConfig = getStatusConfig();
  const copyMeetLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Đã sao chép link vào clipboard!");
  };
  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-md ${statusConfig.borderClass} group`}
    >
      <CardHeader className={`p-4 ${statusConfig.headerClass}`}>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">
            {meeting.room_name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusConfig.badgeClass}`}
            >
              {statusConfig.badgeLabel}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start text-sm">
          <CalendarIcon
            className={`h-4 w-4 mr-2 ${statusConfig.iconColor} mt-0.5`}
          />
          <span>{formatDate(meeting.date)}</span>
        </div>
        <div className="flex items-start text-sm">
          <Clock className={`h-4 w-4 mr-2 ${statusConfig.iconColor} mt-0.5`} />
          <span>Thời lượng: {formatDuration(meeting.duration)}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full space-y-2">
          <div className="flex gap-2 w-full">
            {status === "ongoing" && (
              <Button
                className={`flex-1 gap-2 ${statusConfig.buttonClass}`}
                onClick={() => onJoin(meeting.meeting_url)}
              >
                <Video className="h-4 w-4" />
                {statusConfig.buttonText}
              </Button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <Button
                onClick={() => copyMeetLink(meeting?.meeting_url)}
                variant="outline"
                size="sm"
                className="text-gray-700 hover:bg-gray-100 dark:hover:bg-black"
                title="Sao chép link"
              >
                <Copy className="w-4 h-4 dark:text-white dark:hover:text-black" />
              </Button>

              {auth &&
                (auth.role === 1 ||
                  Number(auth.userId) === Number(doctorId)) && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200 transition-colors"
                    onClick={() => onDelete(meeting)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MeetingList;
