import { useState, useEffect } from "react";
import { format, parseISO, isAfter } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Video,
  Calendar,
  Clock,
  ExternalLink,
  Search,
  UserPlus,
  User,
  Monitor,
  Loader2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAuth } from "@/utils/getAuth";
import CreateMeeting from "./CreateMeeting";

// Demo data
const mockMeetings = [
  {
    id: 1,
    patientName: "Nguyễn Văn A",
    patientId: "PT12345",
    patientAvatar: "",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
    date: "2025-05-15T14:30:00",
    duration: 30,
    reason: "Tư vấn sau điều trị",
    status: "scheduled",
  },
  {
    id: 2,
    patientName: "Trần Thị B",
    patientId: "PT23456",
    patientAvatar: "",
    meetingUrl: "https://meet.google.com/klm-nopq-rst",
    date: "2025-05-10T09:00:00",
    duration: 45,
    reason: "Đánh giá tình trạng bệnh",
    status: "completed",
  },
  {
    id: 3,
    patientName: "Lê Văn C",
    patientId: "PT34567",
    patientAvatar: "",
    meetingUrl: "https://meet.google.com/uvw-xyz-123",
    date: "2025-05-20T16:15:00",
    duration: 20,
    reason: "Theo dõi tình trạng sức khỏe",
    status: "scheduled",
  },
  {
    id: 4,
    patientName: "Phạm Thị D",
    patientId: "PT45678",
    patientAvatar: "",
    meetingUrl: "https://meet.google.com/456-789-abc",
    date: "2025-05-09T10:45:00",
    duration: 30,
    reason: "Tư vấn dinh dưỡng",
    status: "cancelled",
  },
];

const TelemedicineSchedule = ({ doctorId }) => {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMeetings(mockMeetings);
      setFilteredMeetings(mockMeetings);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMeetings(meetings);
    } else {
      const filtered = meetings.filter(meeting =>
        meeting.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMeetings(filtered);
    }
  }, [searchTerm, meetings]);

  const joinMeeting = (meetingUrl) => {
    window.open(meetingUrl, "_blank");
  };

  const handleCreateMeeting = (patient) => {
    setSelectedPatient(patient);
    setIsCreateMeetingOpen(true);
  };

  const fetchAllMeetingList = () => {
    // Here you would typically make an API call to refresh the meetings
    // For now, we'll just simulate it with the mock data
    setIsLoading(true);
    setTimeout(() => {
      setMeetings(mockMeetings);
      setFilteredMeetings(mockMeetings);
      setIsLoading(false);
    }, 500);
  };

  const getUpcomingMeetings = () => {
    return filteredMeetings.filter(meeting => 
      meeting.status === "scheduled" && 
      isAfter(parseISO(meeting.date), new Date())
    );
  };

  const getPastMeetings = () => {
    return filteredMeetings.filter(meeting => 
      meeting.status === "completed" || 
      meeting.status === "cancelled" ||
      !isAfter(parseISO(meeting.date), new Date())
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Đang tải lịch khám trực tuyến...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Lịch khám trực tuyến</h2>
          <p className="text-gray-500 mt-1">
            Danh sách các cuộc hẹn khám trực tuyến qua Google Meet
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white gap-2"
          onClick={() => setIsCreateMeetingOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Tạo cuộc họp mới
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Tìm kiếm theo tên bệnh nhân hoặc lý do khám..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-600" />
            Cuộc hẹn sắp tới
          </h3>
          
          {getUpcomingMeetings().length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Monitor className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Không có cuộc hẹn khám trực tuyến nào sắp tới</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getUpcomingMeetings().map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  isUpcoming={true}
                  onJoin={joinMeeting}
                  onCreateMeeting={handleCreateMeeting}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-gray-600" />
            Cuộc hẹn đã diễn ra
          </h3>
          
          {getPastMeetings().length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Monitor className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Không có cuộc hẹn khám trực tuyến nào đã diễn ra</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getPastMeetings().map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  isUpcoming={false}
                  onJoin={joinMeeting}
                  onCreateMeeting={handleCreateMeeting}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Meeting Dialog */}
      <CreateMeeting 
        open={isCreateMeetingOpen} 
        onOpenChange={() => setIsCreateMeetingOpen(false)}
        fetchAllMeetingList={fetchAllMeetingList}
        selectedPatient={selectedPatient}
      />
    </div>
  );
};

// Meeting Card Component
const MeetingCard = ({ meeting, isUpcoming, onJoin, onCreateMeeting }) => {
  const getMeetingStatusBadge = (status) => {
    switch (status) {
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Đã lên lịch
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Đã hoàn thành
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Đã hủy
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            Không xác định
          </Badge>
        );
    }
  };

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${
      isUpcoming ? "border-blue-200" : "border-gray-200"
    }`}>
      <CardHeader className={`p-4 ${
        isUpcoming ? "bg-blue-50" : "bg-gray-50"
      }`}>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={meeting.patientAvatar} alt={meeting.patientName} />
              <AvatarFallback className="bg-blue-100 text-blue-800">
                {meeting.patientName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-medium">
                {meeting.patientName}
              </CardTitle>
              <CardDescription>
                {meeting.duration} phút
              </CardDescription>
            </div>
          </div>
          {getMeetingStatusBadge(meeting.status)}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
          <span>
            {format(parseISO(meeting.date), "EEEE, dd/MM/yyyy", { locale: vi })}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-blue-600" />
          <span>{format(parseISO(meeting.date), "HH:mm", { locale: vi })}</span>
        </div>
        <div className="flex items-start text-sm">
          <User className="h-4 w-4 mr-2 text-blue-600 mt-0.5" />
          <span>{meeting.reason}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="w-full space-y-2">
          {isUpcoming ? (
            <>
              <Button 
                className="w-full gap-2"
                onClick={() => onJoin(meeting.meetingUrl)}
              >
                <Video className="h-4 w-4" />
                Tham gia cuộc gọi
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => onCreateMeeting(meeting)}
              >
                <Plus className="h-4 w-4" />
                Đặt lịch khám mới
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => onJoin(meeting.meetingUrl)}
              >
                <ExternalLink className="h-4 w-4" />
                Xem lại thông tin cuộc gọi
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => onCreateMeeting(meeting)}
              >
                <Plus className="h-4 w-4" />
                Đặt lịch khám mới
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TelemedicineSchedule;