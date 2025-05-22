import Loading from "@/components/Loading";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoutes";
import PrivateRoute from "./PrivateRoutes";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import UserProfile from "@/components/UserProfile";
import DoctorProfile from "@/components/admin/Doctor/Doctor/DoctorProfile";
import ClinicDetail from "@/components/admin/Doctor/Clinic/ClinicDetail";
import DashboardLayout from "@/components/admin/DashboardLayout";
import DashboardAdmin from "@/components/admin/Dashboard/DashboardAdmin";
import UserList from "@/components/admin/User/UserList";
import CreateNewUser from "@/components/admin/User/CreateNewUser";
import DoctorList from "@/components/admin/Doctor/Doctor/DoctorList";
import ClinicList from "@/components/admin/Doctor/Clinic/ClinicList";
import ClinicCreate from "@/components/admin/Doctor/Clinic/ClinicCreate";
import ClinicUpdate from "@/components/admin/Doctor/Clinic/ClinicUpdate";
import SpecializationList from "@/components/admin/Doctor/Specializations/SpecializationList";
import AddSpecialization from "@/components/admin/Doctor/Specializations/AddSpecialization";
import DetailSpecialization from "@/components/admin/Doctor/Specializations/DetailSpecialization";
import UpdateSpecialization from "@/components/admin/Doctor/Specializations/UpdateSpecializations";
import UpdateDoctor from "@/components/admin/Doctor/Doctor/UpdateDoctor";
import NotFoundPage from "@/pages/NotFoundPage";
import ListSpecialization from "@/components/client/ListSpecialization";
import ListClinics from "@/components/client/ListClinics";
import ListDoctor from "@/components/client/ListDoctor";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import ConfirmCodePage from "@/pages/ConfirmCodePage";
import ListHealthHandBook from "@/components/client/ListHealthHandBook";
import HealthHandbookDetail from "@/components/client/HealthHandbookDetail";
import EditHandBook from "@/components/admin/Doctor/HandleBook/EditHandBook";
import MyHandBookList from "@/components/admin/Doctor/HandleBook/MyHandBookList";
import CreateNewHandBook from "@/components/admin/Doctor/HandleBook/CreateNewHandBook";
import MyBooking from "@/components/client/MyBooking";
import ViewBookingDetail from "@/components/client/BookingDetail/ViewBookingDetail";
import AppointmentList from "@/components/admin/Doctor/Appointment/AppointmentList";
import UnAuthorized from "@/pages/UnAuthorizedPage";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentFail from "@/pages/PaymentFail";
import PaymentList from "@/components/client/Payment/PaymentList";
import PaymentDetail from "@/components/client/Payment/PaymentDetail";
import CreateMeeting from "@/components/admin/Doctor/Meet/CreateMeeting";

const AppRoutes = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="doctor/:doctorId" element={<DoctorProfile />} />
            <Route path="clinics" element={<ListClinics />} />
            <Route path="clinics/:clinicId" element={<ClinicDetail />} />
            <Route path="specializations" element={<ListSpecialization />} />
            <Route
              path="specializations/:specializationId"
              element={<DetailSpecialization />}
            />
            <Route
              path="/cam-nang-suc-khoe/:slug"
              element={<HealthHandbookDetail />}
            />
            <Route
              path="/cam-nang-suc-khoe/:slug/cap-nhat"
              element={<EditHandBook />}
            />

            <Route path="/cam-nang-suc-khoe" element={<ListHealthHandBook />} />
            <Route path="/doctors" element={<ListDoctor />} />
          </Route>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-code" element={<ConfirmCodePage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path=":userId/appointments" element={<MyBooking />} />
            <Route
              path=":userId/appointment/:appointmentId"
              element={<ViewBookingDetail />}
            />

            <Route path="/doctor/:doctorId/clinics" element={<ClinicList />} />
            <Route
              path="/doctor/:doctorId/clinics/create"
              element={<ClinicCreate />}
            />
            <Route
              path="/doctor/:doctorId/clinics/:clinicId/update"
              element={<ClinicUpdate />}
            />
            <Route
              path="/doctor/:doctorId/handbooks"
              element={<MyHandBookList />}
            />
            <Route
              path="/doctor/:doctorId/handbooks/create"
              element={<CreateNewHandBook />}
            />

            <Route path="/doctor/:doctorId/update" element={<UpdateDoctor />} />

            <Route
              path="/doctor/:doctorId/meetings/create"
              element={<CreateMeeting />}
            />
            <Route
              path="/:userId/lich-su-thanh-toan"
              element={<PaymentList />}
            />
            <Route
              path="/:userId/lich-su-thanh-toan/:paymentId"
              element={<PaymentDetail />}
            />

            <Route path="/success" element={<PaymentSuccess />} />

            <Route path="/cancel" element={<PaymentFail />} />
          </Route>
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={[1]}>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            {/* <Route index element={<DashboardAdmin />} />

            <Route path="dashboard" element={<DashboardAdmin />} /> */}

            <Route index path="users" element={<UserList />} />
            <Route path="users/create" element={<CreateNewUser />} />
            <Route path="users/:userId" element={<UserProfile />} />
            <Route path="payment-history" element={<PaymentList />} />
          </Route>

          {/* Doctor + Admin Shared Section */}
          <Route
            path="/doctor"
            element={
              <PrivateRoute allowedRoles={[1, 2]}>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            {/* <Route index element={<DoctorList />} /> */}
            <Route path="clinics" element={<ClinicList />} />
            <Route path="appointments" element={<AppointmentList />} />

            {/* Specializations */}
            <Route path="specializations" element={<SpecializationList />} />
            <Route
              path="specializations/create"
              element={<AddSpecialization />}
            />
            <Route
              path="specializations/update/:specializationId"
              element={<UpdateSpecialization />}
            />
            <Route
              path="specializations/:specializationId"
              element={<DetailSpecialization />}
            />

            {/* Doctors */}
            <Route path="" element={<DoctorList />} />
            <Route path=":doctorId" element={<DoctorProfile />} />
          </Route>

          <Route path="/unauthorized" element={<UnAuthorized />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;
