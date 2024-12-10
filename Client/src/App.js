import React from "react"
import { Routes, Route } from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google';

import LoginPage from "./pages/user-ui/auth/LoginPage"
import SignupPage from "./pages/user-ui/auth/SignupPage"
import VerifyOtp from "./pages/user-ui/auth/VerifyOtp"
import CreateUsername from "./pages/user-ui/auth/CreateUsername"
import Profile from "./pages/user-ui/profile/Profile"
import ProtectedRoute from "./routes/ProtectedRoute"
import RestrictedRoute from "./routes/RestrictedRoute"
import EditProfile from "./pages/user-ui/profile/EditProfile"
import EditFieldPage from "./pages/user-ui/profile/EditFieldPage"
import EditUsernamePage from "./pages/user-ui/profile/EditUsernamePage"
import AddPetStory from "./pages/user-ui/AddPetStory"
import PostDisplay from "./pages/user-ui/profile/PostDisplay"
import AdminLoginPage from "./pages/admin-ui/auth/AdminLoginPage";
import AdminRestrictedRoute from "./routes/AdminRestrictedRoute";
import AdminOnlyRoute from "./routes/AdminOnlyRoute";
import AdminDashboard from "./pages/admin-ui/dashboard/AdminDashboard";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="bg-white lg:bg-gray-100">
        <Routes>
          <Route path="/login" element={<RestrictedRoute><LoginPage /></RestrictedRoute>} />
          <Route path="/signup" element={<RestrictedRoute><SignupPage /></RestrictedRoute>} />
          <Route path="/signup/otp" element={<RestrictedRoute><VerifyOtp /></RestrictedRoute>} />
          <Route path="/signup/username/" element={<RestrictedRoute><CreateUsername /></RestrictedRoute>} />
          <Route path="profile/" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="edit-profile/" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="edit/" element={<ProtectedRoute><EditFieldPage /></ProtectedRoute>} />
          <Route path="edit-username/" element={<ProtectedRoute><EditUsernamePage /></ProtectedRoute>} />
          <Route path="add-pet-story/" element={<ProtectedRoute><AddPetStory /></ProtectedRoute>} />
          <Route path="/post/:slug" element={<ProtectedRoute><PostDisplay /></ProtectedRoute>} />
          
          <Route path="admin/login" element={<AdminRestrictedRoute><AdminLoginPage /></AdminRestrictedRoute>} />
          <Route path="admin/" element={<AdminOnlyRoute><AdminDashboard /></AdminOnlyRoute>} />
        </Routes>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App
