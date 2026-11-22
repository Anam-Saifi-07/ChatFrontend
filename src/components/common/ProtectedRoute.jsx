import { useContext } from "react";
import { Navigate, useLocation } from "react-router";
import { Tokencontext } from "../../context/ChatContext";

function ProtectedRoute({ children }) {
  const { token } = useContext(Tokencontext);
  const location = useLocation();
  const storedToken = localStorage.getItem("token");

  // User is authenticated only if token exists in state or localStorage
  const isAuthenticated = Boolean(token || storedToken);

  if (!isAuthenticated) {
    // Redirect to login page, replacing history so unauthorized URL isn't retained
    return <Navigate to="/joinRoom" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
