import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/user-ui/auth/LoginPage";
import SignupPage from "./pages/user-ui/auth/SignupPage";
import VerifyOtp from "./pages/user-ui/auth/VerifyOtp";
import CreateUsername from "./pages/user-ui/auth/CreateUsername";
import Profile from "./pages/user-ui/profile/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import RestrictedRoute from "./routes/RestrictedRoute";
import EditProfile from "./pages/user-ui/profile/EditProfile";
import EditFieldPage from "./pages/user-ui/profile/EditFieldPage";
import EditUsernamePage from "./pages/user-ui/profile/EditUsernamePage";

function App() {
  return (
    <div className="bg-gray-100">
      <Routes>
        <Route path="/login" element={<RestrictedRoute><LoginPage /></RestrictedRoute>} />
        <Route path="/signup" element={<RestrictedRoute><SignupPage /></RestrictedRoute>} />
        <Route path="/signup/otp" element={<RestrictedRoute><VerifyOtp /></RestrictedRoute>}/>
        <Route path="/signup/username/" element={<RestrictedRoute><CreateUsername /></RestrictedRoute>}/>
        <Route path="profile/" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="edit-profile/" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="edit/" element={<ProtectedRoute><EditFieldPage /></ProtectedRoute>} />
        <Route path="edit-username/" element={<ProtectedRoute><EditUsernamePage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
