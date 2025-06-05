import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoutes";
import PrivateRoute from "./PrivateRoutes";
import Loading from "@/components/Loading";
import Layout from "@/components/Layout";
import DashboardLayout from "@/components/admin/DashboardLayout";

// Lazy-loaded components
const HomePage = lazy(() => import("@/pages/HomePage"));
const UserProfile = lazy(() => import("@/components/UserProfile"));
const DoctorProfile = lazy(() => import("@/components/admin/Doctor/Doctor/DoctorProfile"));
const ClinicDetail = lazy(() => import("@/components/admin/Doctor/Clinic/ClinicDetail"));
const DashboardAdmin = lazy(() => import("@/components/admin/Dashboard/DashboardAdmin"));
const UserList = lazy(() => import("@/components/admin/User/UserList"));
const CreateNewUser = lazy(() => import("@/components/admin/User/CreateNewUser"));
const DoctorList = lazy(() => import("@/components/admin/Doctor/Doctor/DoctorList"));
const ClinicList = lazy(() => import("@/components/admin/Doctor/Clinic/ClinicList"));
const ClinicCreate = lazy(() => import("@/components/admin/Doctor/Clinic/ClinicCreate"));
const ClinicUpdate = lazy(() => import("@/components/admin/Doctor/Clinic/ClinicUpdate"));
const SpecializationList = lazy(() => import("@/components/admin/Doctor/Specializations/SpecializationList"));
const AddSpecialization = lazy(() => import("@/components/admin/Doctor/Specializations/AddSpecialization"));
const DetailSpecialization = lazy(() => import("@/components/admin/Doctor/Specializations/DetailSpecialization"));
const UpdateSpecialization = lazy(() => import("@/components/admin/Doctor/Specializations/UpdateSpecializations"));
const UpdateDoctor = lazy(() => import("@/components/admin/Doctor/Doctor/UpdateDoctor"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const ListSpecialization = lazy(() => import("@/components/client/ListSpecialization"));
const ListClinics = lazy(() => import("@/components/client/ListClinics"));
const ListDoctor = lazy(() => import("@/components/client/ListDoctor"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));
const ConfirmCodePage = lazy(() => import("@/pages/ConfirmCodePage"));
const ListHealthHandBook = lazy(() => import("@/components/client/ListHealthHandBook"));
const HealthHandbookDetail = lazy(() => import("@/components/client/HealthHandbookDetail"));
const EditHandBook = lazy(() => import("@/components/admin/Doctor/HandleBook/EditHandBook"));
const MyHandBookList = lazy(() => import("@/components/admin/Doctor/HandleBook/MyHandBookList"));
const CreateNewHandBook = lazy(() => import("@/components/admin/Doctor/HandleBook/CreateNewHandBook"));
const MyBooking = lazy(() => import("@/components/client/MyBooking"));
const ViewBookingDetail = lazy(() => import("@/components/client/BookingDetail/ViewBookingDetail"));
const AppointmentList = lazy(() => import("@/components/admin/Doctor/Appointment/AppointmentList"));
const UnAuthorized = lazy(() => import("@/pages/UnAuthorizedPage"));
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const PaymentFail = lazy(() => import("@/pages/PaymentFail"));
const PaymentList = lazy(() => import("@/components/client/Payment/PaymentList"));
const PaymentDetail = lazy(() => import("@/components/client/Payment/PaymentDetail"));
const CreateMeeting = lazy(() => import("@/components/admin/Doctor/Meet/CreateMeeting"));

const AppRoutes = () => {
  return (
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
          <Route path="/:userId/lich-su-thanh-toan" element={<PaymentList />} />
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
          <Route index path="users" element={<UserList />} />
          <Route path="users/create" element={<CreateNewUser />} />
          <Route path="users/:userId" element={<UserProfile />} />
          <Route path="payment-history" element={<PaymentList />} />
        </Route>

        <Route
          path="/doctor"
          element={
            <PrivateRoute allowedRoles={[1, 2]}>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="clinics" element={<ClinicList />} />
          <Route path="appointments" element={<AppointmentList />} />
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
          <Route path="" element={<DoctorList />} />
          <Route path=":doctorId" element={<DoctorProfile />} />
        </Route>

        <Route path="/unauthorized" element={<UnAuthorized />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;