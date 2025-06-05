import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

import { getBookingDetail } from "@/api/appointment.api";
import useAuthToken from "@/utils/userAuthToken";
import AppointmentDetail from "./AppointmentDetail";
import NoAppointment from "./NoAppointment";
import { useDispatch, useSelector } from "react-redux";
import { setBooking } from "@/store/appointment.slice";

const ViewBookingDetail = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const dispatch = useDispatch();
  const booking = useSelector((state) => state.appointment.currentBooking);
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
        dispatch(setBooking(res.DT));
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
        <NoAppointment />
      </>
    );
  }

  return (
    <div className="container mx-auto p-6 mt-20 bg-white shadow-md rounded-lg">
      {/* Breadcrumb */}

      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-sm">
          <li className="flex items-center">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center group"
            >
              <Home
                size={16}
                className="mr-2 text-blue-500 group-hover:text-blue-700 transition-colors"
              />
              <span className="font-medium">Trang chủ</span>
            </Link>
          </li>
          {auth.role === 3 && (
            <>
              <li className="flex items-center">
                <ChevronRight
                  size={16}
                  className="text-gray-400 mx-1"
                  aria-hidden="true"
                />
              </li>

              <li
                className="flex items-center cursor-pointer"
                onClick={() => navigate(`/${auth.userId}/appointments`)}
              >
                <span className="text-blue-700 hover:text-blue-800 font-medium">
                  Lịch khám của tôi
                </span>
              </li>
            </>
          )}

          <li className="flex items-center">
            <ChevronRight
              size={16}
              className="text-gray-400 mx-1"
              aria-hidden="true"
            />
          </li>
          <li className="flex items-center">
            <span className="text-gray-700 font-medium">
              Lịch khám #{booking.appointment.id}
            </span>
          </li>
        </ol>
      </nav>

      <AppointmentDetail fetch={fetchBookingDetail} booking={booking} />
    </div>
  );
};

export default ViewBookingDetail;
