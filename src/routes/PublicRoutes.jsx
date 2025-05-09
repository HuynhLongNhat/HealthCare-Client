import { getAuth } from "@/utils/getAuth";
import { Navigate, Outlet } from "react-router-dom";
// eslint-disable-next-line react/prop-types
const PublicRoute = () => {
  const auth = getAuth();
  if (auth) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PublicRoute;
