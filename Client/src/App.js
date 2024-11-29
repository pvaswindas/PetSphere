import React from "react";
import { Routes, Route } from "react-router-dom";
import UserLogin from "./pages/user-ui/UserLogin";
import UserSignUp from "./pages/user-ui/UserSignUp";
import SignUpOTP from "./pages/user-ui/SignUpOtp";

function App() {
  return (
    <div className="bg-gray-100">
      <Routes>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignUp />} />
        <Route path="/signup-otp" element={<SignUpOTP />}/>
      </Routes>
    </div>
  );
}

export default App;
