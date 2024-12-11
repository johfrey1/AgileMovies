import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("refresh_token");
  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
