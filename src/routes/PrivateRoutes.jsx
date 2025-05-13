// /* eslint-disable react/prop-types */
// // components/PrivateRoute.jsx
// import UnAuthorized from "@/pages/UnAuthorizedPage";
// import useAuthToken from "@/utils/userAuthToken";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children, allowedRoles }) => {
//   const auth = useAuthToken()
//   console.log("auth" , auth)

//   if (!auth) {
//     return <Navigate to="/login" />;
//   }
//   const userRole = auth.role;

//   if (allowedRoles && !allowedRoles.includes(userRole)) {
//     return <UnAuthorized />;
//   }

//   return children;
// };

// export default PrivateRoute;


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