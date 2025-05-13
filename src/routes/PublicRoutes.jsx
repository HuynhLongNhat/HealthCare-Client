import Loading from "@/components/Loading";
import useAuthToken from "@/utils/userAuthToken";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const auth = useAuthToken();
  if (auth === undefined) {
    return (
    <Loading/>
    );
  }

  if (auth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;