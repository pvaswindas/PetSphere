import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/user-ui/auth/LoginPage";
import SignupPage from "./pages/user-ui/auth/SignupPage";
import VerifyOtp from "./pages/user-ui/auth/VerifyOtp";
import CreateUsername from "./pages/user-ui/auth/CreateUsername";
import Profile from "./pages/user-ui/Profile";

function App() {
  return (
    <div className="bg-gray-100">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/otp" element={<VerifyOtp />}/>
        <Route path="/signup/username/" element={<CreateUsername />}/>
        <Route path="profile/" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
