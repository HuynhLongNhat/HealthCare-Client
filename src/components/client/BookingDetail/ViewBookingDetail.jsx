import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Home } from "lucide-react";

import { getBookingDetail } from "@/api/appointment.api";
import useAuthToken from "@/utils/userAuthToken";
import AppointmentDetail from "./AppointmentDetail";
import NoAppointment from "./NoAppointment";

const ViewBookingDetail = () => {
  const { appointmentId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = useAuthToken();
  useEffect(() => {
    fetchBookingDetail();
  }, [appointmentId]);

  const fetchBookingDetail = async () => {
    setLoading(true);
    try {
      const res = await getBookingDetail(appointmentId);
      if (res.EC === 0) {
        setBooking(res.DT);
      } else {
        console.error("Error fetching booking details:", res.EM);
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 mt-20 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <>
        <NoAppointment/>
      </>
     )
  }

  return (
    <div className="container mx-auto p-6 mt-20 bg-white shadow-md rounded-lg">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="list-reset flex items-center">
          <li>
            <Link
              to="/"
              className="text-blue-600 hover:underline flex items-center"
            >
              <Home size={18} className="mr-1" />
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            {auth.role === 3 && (
              <Link
                to={`/${auth.userId}/appointments`}
                className="text-blue-600 hover:underline"
              >
                Lịch khám của tôi
              </Link>
            )}

            {auth.role === 2 && (
              <Link
                to={`/doctor/${auth.userId}`}
                className="text-blue-600 hover:underline"
              >
                Lịch khám của tôi
              </Link>
            )}

            
            {auth.role === 1 && (
              <Link
                to={`/doctor/appointments`}
                className="text-blue-600 hover:underline"
              >
                Lịch khám của tôi
              </Link>
            )}
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-500">Chi tiết lịch khám</li>
        </ol>
      </nav>
      <AppointmentDetail fetch={fetchBookingDetail} booking={booking} />
    </div>
  );
};

export default ViewBookingDetail;
