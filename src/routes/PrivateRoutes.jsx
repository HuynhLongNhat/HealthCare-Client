

import Loading from "@/components/Loading";
import useAuthToken from "@/utils/userAuthToken";
import { Navigate } from "react-router-dom";

const PrivateRoutes = ({ children, allowedRoles }) => {
  const auth = useAuthToken();

  if (auth === undefined) {
    return <Loading />;
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <></>;
};

export default PrivateRoutes;