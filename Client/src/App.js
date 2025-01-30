import React, { useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
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
import AddPetStory from "./pages/user-ui/post/AddPetStory";
import PostDisplay from "./pages/user-ui/profile/PostDisplay";

import AdminLoginPage from "./pages/admin-ui/auth/AdminLoginPage";
import AdminDashboard from "./pages/admin-ui/dashboard/AdminDashboard";
import PetCatalogManager from "./pages/admin-ui/pet-management/PetCatalogManager";
import AnnouncementsManager from "./pages/admin-ui/update-management/AnnouncementsManager";
import Landing from "./pages/Landing";
import AddPetListing from "./pages/user-ui/post/AddPetListing";
import MapExplorer from "./pages/user-ui/MapExplorer";
import ExplorePage from "./pages/user-ui/ExplorePage";
import SubscriptionPage from "./pages/user-ui/subscription/SubscriptionPage";
import PaymentSuccessPage from "./components/user/subscription/PaymentSuccessPage";
import PaymentCancelPage from "./components/user/subscription/PaymentCancelPage";
import ForgotPassword from "./pages/user-ui/auth/ForgotPassword";
import FindYourAccount from "./pages/user-ui/auth/FindYourAccount";
import MobileVerificationPage from "./pages/user-ui/profile/MobileVerificaionPage";
import MobileNumberPage from "./pages/user-ui/profile/MobileNumberPage";
import UserManagePage from "./pages/admin-ui/user-management/UserManagePage";
import UserDetailedViewPage from "./pages/admin-ui/user-management/UserDetailedViewPage";
import Feed from "./pages/user-ui/feed/Feed";
import Messaging from "./pages/user-ui/chat/Messaging";
import Chat from "./pages/user-ui/chat/Chat";

function App() {
  const location = useLocation();

  useEffect(() => {
      if (location.pathname === "/") {
          document.body.classList.remove("overflow-hidden");
          document.body.classList.add("overflow-y-auto");
      } else {
          document.body.classList.add("overflow-hidden");
          document.body.classList.remove("overflow-y-auto");
      }
  }, [location]);
  return (
    <div className="bg-white lg:bg-gray-100 h-screen">
      <Routes>
        {/* Landing Route */}
        <Route path="/" element={<RestrictedRoute><Landing /></RestrictedRoute>} />

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

        <Route path="/reset-password" element={<RestrictedRoute><ForgotPassword /></RestrictedRoute>} />
        <Route path="/find-your-account" element={<RestrictedRoute><FindYourAccount /></RestrictedRoute>} />

        {/* User Protected Routes */}
        <Route 
          path="/profile/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path=":username" element={<Profile />} />
                <Route path="edit" element={<EditProfile />} />
                <Route path="edit/:dynamicString" element={<EditFieldPage />} />
                <Route path="mobile-number" element={<MobileNumberPage />} />
                <Route path="verify-mobile-number" element={<MobileVerificationPage />} />
                <Route path="edit/username" element={<EditUsernamePage />} />
                <Route path="add-pet-story" element={<AddPetStory />} />
                <Route path="add-pet-listing" element={<AddPetListing />} />
                <Route path="mapexplore" element={<MapExplorer />} />
              </Routes>
            </ProtectedRoute>
          } 
        />

        <Route path="post/:slug" element={ <ProtectedRoute><PostDisplay /></ProtectedRoute> } />

        <Route path="/feed" element={ <ProtectedRoute><Feed /></ProtectedRoute>} />

        <Route path="/messages" element={ <ProtectedRoute><Messaging /></ProtectedRoute>} />
        <Route path="/messages/chat" element={ <ProtectedRoute><Chat /></ProtectedRoute>} />

        <Route path="explore" element={ <ProtectedRoute><ExplorePage /></ProtectedRoute> } />
        <Route path="subscriptions" element={ <ProtectedRoute><SubscriptionPage /></ProtectedRoute> } />
        <Route path="subscriptions/success" element={ <ProtectedRoute><PaymentSuccessPage /></ProtectedRoute> } />
        <Route path="subscriptions/cancel" element={ <ProtectedRoute><PaymentCancelPage /></ProtectedRoute> } />


        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <div className="overflow-y-auto h-screen">
              <Routes>
                <Route path="login" element={<AdminRestrictedRoute><AdminLoginPage /></AdminRestrictedRoute>} />
                <Route path="" element={<AdminOnlyRoute><AdminDashboard /></AdminOnlyRoute>} />
                <Route path="manage/pets" element={<AdminOnlyRoute><PetCatalogManager /></AdminOnlyRoute>} />
                <Route path="manage/updates" element={<AdminOnlyRoute><AnnouncementsManager /></AdminOnlyRoute>} />
                <Route path="manage/users" element={<AdminOnlyRoute><UserManagePage /></AdminOnlyRoute>} />
                <Route path="manage/users/view/:userId" element={<AdminOnlyRoute><UserDetailedViewPage /></AdminOnlyRoute>} />
              </Routes>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

