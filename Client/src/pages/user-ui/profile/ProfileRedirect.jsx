import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Shimmer from "../../../components/Shimmer/Shimmer";

const ProfileRedirect = () => {
  const navigate = useNavigate();
  const profile = useSelector((state) => state.profile.profile_data);
  
  useEffect(() => {
    // If we have the user profile data, redirect to their profile
    if (profile?.user?.username) {
      navigate(`/profile/${profile.user.username}`);
    }
  }, [profile, navigate]);
  
  return (
    <div className="flex justify-center items-center h-screen">
      <Shimmer className="w-full max-w-lg h-64" />
    </div>
  );
};

export default ProfileRedirect;