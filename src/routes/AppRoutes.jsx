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
import ScheduleList from "@/components/admin/Doctor/Schedule/ScheduleList";
import ScheduleDetail from "@/components/admin/Doctor/Schedule/ScheduleDetail";
import NotFoundPage from "@/pages/NotFoundPage";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignUpForm";
import ConfirmCode from "@/components/ConfirmCode";
import ForgotPassword from "@/components/ForgotPassword";
import ResetPassword from "@/components/ResetPassword";
import ListSpecialization from "@/components/client/ListSpecialization";
import ListClinics from "@/components/client/ListClinics";
import ListDoctor from "@/components/client/ListDoctor";

import DashboardDoctor from "@/components/admin/Dashboard/DashboardDoctor";
import Login from "@/components/clerk/Login";
import Registers from "@/components/clerk/Registers";


const AppRoutes = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<Registers />} />
                      <Route path="/" element={<HomePage />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<SignupForm />} />
            <Route path="/verify-code" element={<ConfirmCode />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={[1, 2, 3]}>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/doctor/:doctorId" element={<DoctorProfile />} />
            <Route path="/clinics" element={<ListClinics />} />
            <Route path="/clinics/:clinicId" element={<ClinicDetail />} />
            <Route path="/specializations" element={<ListSpecialization />} />
            <Route
              path="specializations/:specializationId"
              element={<DetailSpecialization />}
            />

            <Route path="/doctors" element={<ListDoctor />} />
            <Route path="/doctor/:doctorId/clinics" element={<ClinicList />} />
            <Route path="/doctor/:doctorId/clinics/create" element={<ClinicCreate />} />
            <Route path="/doctor/:doctorId/clinics/:clinicId/update" element={<ClinicUpdate />} />


              <Route path="/doctors" element={<ListDoctor />} />


          </Route>
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={[1]}>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardAdmin />} />
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/create" element={<CreateNewUser />} />
            <Route path="users/:userId" element={<UserProfile />} />
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
              <Route path="dashboard" element={<DashboardDoctor />} />
            {/* <Route index element={<DoctorList />} /> */}

            {/* Clinics */}
            <Route path="clinics">
              <Route index element={<ClinicList />} />
              <Route path="create" element={<ClinicCreate />} />
              <Route path=":clinicId" element={<ClinicDetail />} />
              <Route path=":clinicId/update" element={<ClinicUpdate />} />
            </Route>

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
            <Route path=":doctorId/update" element={<UpdateDoctor />} />
            <Route path="doctors/all/schedules" element={<ScheduleList />} />
            <Route
              path="doctors/:doctorId/schedules/:scheduleId"
              element={<ScheduleDetail />}
            />
          </Route>

          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRoutes;
