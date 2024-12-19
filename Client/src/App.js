import React from "react"
import { Routes, Route } from "react-router-dom"
import { GoogleOAuthProvider } from "@react-oauth/google";

import ProtectedRoute from "./routes/ProtectedRoute";
import RestrictedRoute from "./routes/RestrictedRoute";
import AdminOnlyRoute from "./routes/AdminOnlyRoute";
import AdminRestrictedRoute from "./routes/AdminRestrictedRoute";

import LoginPage from "./pages/user-ui/auth/LoginPage";
import SignupPage from "./pages/user-ui/auth/SignupPage";
import VerifyOtp from "./pages/user-ui/auth/VerifyOtp";
import CreateUsername from "./pages/user-ui/auth/CreateUsername";
import Profile from "./pages/user-ui/profile/Profile";

import EditProfile from "./pages/user-ui/profile/EditProfile";
import EditFieldPage from "./pages/user-ui/profile/EditFieldPage";
import EditUsernamePage from "./pages/user-ui/profile/EditUsernamePage";
import AddPetStory from "./pages/user-ui/AddPetStory";
import PostDisplay from "./pages/user-ui/profile/PostDisplay";

import AdminLoginPage from "./pages/admin-ui/auth/AdminLoginPage";
import AdminDashboard from "./pages/admin-ui/dashboard/AdminDashboard";
import PetCatalogManager from "./pages/admin-ui/PetCatalogManager";
import AnnouncementsManager from "./pages/admin-ui/AnnouncementsManager";
import Landing from "./pages/Landing";

function App() {
  return (
      <div className="bg-white lg:bg-gray-100 w-full p-0 m-0">
        <Routes>
          {/* Landing Route */}
          <Route path="" element={<RestrictedRoute><Landing /></RestrictedRoute>} />

          {/* Public Routes */}
          <Route path="/login" element={
            <RestrictedRoute>
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <LoginPage />
              </GoogleOAuthProvider>
            </RestrictedRoute>
          } />
          <Route path="/signup" element={
            <RestrictedRoute>
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                <SignupPage />
              </GoogleOAuthProvider>
            </RestrictedRoute>
          } />
          <Route path="/signup/otp" element={<RestrictedRoute><VerifyOtp /></RestrictedRoute>} />
          <Route path="/signup/username" element={<RestrictedRoute><CreateUsername /></RestrictedRoute>} />

          {/* User Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/edit" element={<ProtectedRoute><EditFieldPage /></ProtectedRoute>} />
          <Route path="/edit-username" element={<ProtectedRoute><EditUsernamePage /></ProtectedRoute>} />
          <Route path="/add-pet-story" element={<ProtectedRoute><AddPetStory /></ProtectedRoute>} />
          <Route path="/post/:slug" element={<ProtectedRoute><PostDisplay /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminRestrictedRoute><AdminLoginPage /></AdminRestrictedRoute>} />
          <Route path="/admin" element={<AdminOnlyRoute><AdminDashboard /></AdminOnlyRoute>} />
          <Route path="/admin/manage/pet" element={<AdminOnlyRoute><PetCatalogManager /></AdminOnlyRoute>} />
          <Route path="/admin/manage/updates" element={<AdminOnlyRoute><AnnouncementsManager /></AdminOnlyRoute>} />
        </Routes>
      </div>
  );
}

export default App;
