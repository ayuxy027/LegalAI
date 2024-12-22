import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

interface PrivateRouteProps {
  element: JSX.Element;
  requiredRole?: string;
}

const PrivateRoute = ({ element, requiredRole }: PrivateRouteProps) => {
  const token = Cookies.get("authToken");
  const userRole = Cookies.get("userRole");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole?.toLowerCase() !== requiredRole.toLowerCase()) {
    return <Navigate to="/forbidden" />;
  }

  return element;
};

export default PrivateRoute;
