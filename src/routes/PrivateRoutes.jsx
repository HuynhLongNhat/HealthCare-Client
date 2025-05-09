/* eslint-disable react/prop-types */
// components/PrivateRoute.jsx
import UnAuthorized from "@/pages/UnAuthorizedPage";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, allowedRoles }) => {
  const auth = JSON.parse(localStorage.getItem("user"));

  if (!auth) {
    return <Navigate to="/login" />;
  }
  const userRole = auth.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <UnAuthorized />;
  }

  return children;
};

export default PrivateRoute;
