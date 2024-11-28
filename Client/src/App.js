import React from "react";
import { Routes, Route } from "react-router-dom";
import UserLogin from "./pages/user-ui/UserLogin";
import UserSignUp from "./pages/user-ui/UserSignUp";

function App() {
  return (
    <div className="bg-gray-100">
      <Routes>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignUp />} />
      </Routes>
    </div>
  );
}

export default App;
