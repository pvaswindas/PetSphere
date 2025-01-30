import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { updateAccountDetails } from "../../../../utils/admin-utils/accountRetrieveUpdate";

function PersonalInfo({
    profile,
    setSnackbarMessage,
    setSnackbarOpen,
    setSnackbarAlertType,
    fetchUser
}) {
    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const toggleEdit = () => {
        if (isEditing) {
            reset();
        }
        setIsEditing(!isEditing);
    };

    const transition = "transition-shadow transition-transform"

    const onSubmit = async (data) => {
        try {
            await updateAccountDetails(profile.user.id, data)
            toggleEdit();
            fetchUser()
            setSnackbarMessage("Account details updated successfully");
            setSnackbarAlertType("success")
            setSnackbarOpen(true);
        } catch (error) {
            setSnackbarMessage("Failed to save the change")
            setSnackbarAlertType("error")
            setSnackbarOpen(true);
        }
    };

    return (
        <div
        className="relative w-full max-w-md h-64 mx-auto"
        style={{ perspective: "1000px" }}
        >
            <div
                className={`relative w-full h-full bg-pastelBlue lg:shadow-lg rounded-xl lg:hover:shadow-xl 
                    ${transition} duration-300 ${ isEditing ? "rotate-y-180" : ""}`}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Front Side (View Mode) */}
                <div
                    className="absolute w-full h-full backface-hidden p-4"
                    style={{
                        backfaceVisibility: "hidden",
                    }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-md font-semibold text-white">
                            Personal & Contact Information
                        </h2>
                        <button
                            onClick={toggleEdit}
                            className="text-softSkyBlue hover:underline text-xs"
                        >
                            Edit
                        </button>
                    </div>
                    <div className="text-sm space-y-2 text-softSkyBlue">
                        <p>
                            <span className="font-medium text-softSkyBlue80">Name:</span>{" "}
                            {profile?.user.name}
                        </p>
                        <p>
                            <span className="font-medium text-softSkyBlue80">Username:</span>{" "}
                            @{profile?.user.username}
                        </p>
                        <p>
                            <span className="font-medium text-softSkyBlue80">Bio:</span>{" "}
                            {profile?.bio}
                        </p>
                        <p>
                            <span className="font-medium text-softSkyBlue80">Email:</span>{" "}
                            {profile?.user.email}
                        </p>
                        <p>
                            <span className="font-medium text-softSkyBlue80">Phone:</span>{" "}
                            {profile?.user.mobile_no}
                        </p>
                    </div>
                </div>

                {/* Back Side (Edit Mode) */}
                <div
                    className="absolute w-full h-full backface-hidden p-4 bg-pastelBlue rounded-xl transform rotate-y-180"
                    style={{
                        backfaceVisibility: "hidden",
                    }}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-md font-semibold text-white">Edit Profile</h2>
                            <button
                                type="button"
                                onClick={toggleEdit}
                                className="text-softSkyBlue hover:underline text-xs"
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="text-xs space-y-4 text-gray-600">
                            <div>
                                <label className="font-medium text-softSkyBlue80">Email:</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="off"
                                    {...register("email", { required: "Email is required" })}
                                    defaultValue={profile?.user.email}
                                    className="block w-full p-2 rounded focus:outline-none focus:ring-0"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="font-medium text-softSkyBlue80">Mobile with Country Code:</label>
                                <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    id="mobile_no"
                                    name="mobile_no"
                                    placeholder="Enter mobile number"
                                    autoComplete="off"
                                    onKeyPress={(e) => {
                                        if (!/^[0-9+]$/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                    {...register("mobile_no", {
                                        required: "Phone number with country code is required",
                                        pattern: {
                                            value: /^\+\d{1,4}[0-9]{10}$/,
                                            message: "Enter a valid mobile number with country code (e.g., +911234567890)",
                                        },
                                    })}
                                    defaultValue={profile?.user.mobile_no}
                                    className="block w-full p-2 rounded focus:outline-none focus:ring-0"
                                />
                                </div>
                                {errors.mobile_no && (
                                    <p className="text-red-500 text-xs mt-1">{errors.mobile_no.message}</p>
                                )}
                            </div>
                            <div className="flex justify-end py-2">
                                <button
                                    type="submit"
                                    className="text-white py-1 px-1 rounded hover:underline"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PersonalInfo;
