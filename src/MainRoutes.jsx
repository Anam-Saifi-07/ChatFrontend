import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import JoinRoom from "./JoinRoom";
import App from "./App";
import MainLayout from "./components/layouts/MainLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";

function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/joinRoom" element={<JoinRoom />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        />
        {/* Wildcard catch-all: redirect any unknown routes to /joinRoom */}
        <Route path="*" element={<Navigate to="/joinRoom" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainRoutes;
