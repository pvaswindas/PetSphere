import React, { useState } from 'react'
import AdminLayout from '../../../components/admin/AdminLayout'
import ProfileHeader from '../../../components/user/Profile/ProfileHeader';
import { useDispatch, useSelector } from 'react-redux';
import FlexiCard from '../../../components/admin/common/FlexiCard';
import { formatDateTime, formatDMY } from "../../../utils/admin-utils/formatDate"
import { timeElapsed } from "../../../utils/admin-utils/formatDate"
import { useForm } from 'react-hook-form';
import AlertSnackbar from '../../../components/Snackbar/AlertSnackbar';
import { ChangePassword } from '../../../api/user';
import axiosInstance from '../../../axios/axiosinstance';
import { setProfile } from '../../../redux/slices/ProfileSlice';

function AdminProfile() {
    const activeIcon = "admin-profile";
    const [editMode, setEditMode] = useState(false)
    const [adminLogs, setAdminLogs] = useState(null)
    const dispatch = useDispatch()

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [alertType, setAlertType] = useState("error")
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);

    const profile = useSelector((state) => state.profile.profile_data);
    const dmy = formatDMY(profile?.user.date_joined)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: profile?.user.name || "",
            username: profile?.user.username || "",
            email: profile?.user.email || "",
            mobile_no: profile?.user.mobile_no || "",
        },
    });

    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        watch,
        reset: resetPasswordForm,
        formState: { errors: passwordErrors },
    } = useForm({
        defaultValues: {
            old_password: "",
            new_password: "",
            confirm_password: "",
        },
    });

    const handleEdit = () => {
        setEditMode(true)
    }

    const handleCancel = () => {
        setEditMode(false)
        resetPasswordForm({
            old_password: "",
            new_password: "",
            confirm_password: "",
        })
    }

    const handleSave = async (data) => {
        setIsProfileLoading(true);
    
        try {
            const cleanedData = Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v !== null && v !== undefined)
            );

            const endpoint = cleanedData.name 
                ? 'accounts/user-profile/' 
                : 'user/profile/';
    
            const response = await axiosInstance.patch(endpoint, cleanedData);

            dispatch(setProfile({ profile_data: response.data }));
            
            setSnackbarMessage("Profile updated successfully");
            setAlertType("success");
            setSnackbarOpen(true);

            setEditMode(false);
        } catch (error) {
            const errorMessage = error.response?.data?.detail 
                || error.response?.data?.non_field_errors 
                || "Unable to edit profile";
    
            setSnackbarMessage(errorMessage);
            setAlertType("error");
            setSnackbarOpen(true);
        } finally {
            setIsProfileLoading(false);
        }
    };

    const handlePasswordSave = async (data) => {
        setIsPasswordLoading(true)
        try {
            await ChangePassword(data)
            setSnackbarMessage("Successfully updated the password!")
            setAlertType("success")
            setSnackbarOpen(true)
            resetPasswordForm({
                old_password: "",
                new_password: "",
                confirm_password: "",
            })
        } catch (error) {
            setSnackbarMessage("Failed to update the password at the moment!")
            setAlertType("error")
            setSnackbarOpen(true)
        } finally {
            setIsPasswordLoading(false)
        }
    }

    return (
        <AdminLayout
            activeIcon={activeIcon}
            pageTitle={"Admin Profile"}
            pageDescription={"Manage your admin account settings and view essential profile details."}
            actionButton={editMode ? "Save" : "Edit"}
            buttonAction={editMode ? handleSubmit(handleSave) : handleEdit}
            secondButton={editMode ? "Cancel" : null}
            secondButtonAction={editMode ? handleCancel : null}
        >
            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type={alertType}
                onClose={() => setSnackbarOpen(false)}
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pb-10 lg:pb-0'>
                <FlexiCard>
                        <div className='flex flex-col justify-between pb-4 h-full'>
                            <div>
                                <div className='rounded-lg mb-10'>
                                    <ProfileHeader  profile={profile} isCurrentUser={true} isAdmin={true} />
                                </div>
                                {!editMode && (
                                    <div className='flex flex-col justify-center w-full items-center'>
                                        <p className='text-midnightNavy text-sm font-semibold'>
                                            {profile?.user.name}
                                        </p>
                                        <p className='text-xs'>
                                            <span className='text-black/50'>Account type : </span>
                                            <span className='text-midnightNavy font-medium opacity-90'>
                                                {(profile?.user.is_staff && profile?.user.is_superuser) ? "Administrator" : "Moderator"}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {!editMode && (
                                <div className='lg:flex w-full lg:justify-between lg:px-2'>
                                    <div className='flex flex-col justify-between gap-4'>
                                        <span>
                                            <p className='text-midnightNavy opacity-50 font-medium'>
                                                Username
                                            </p>
                                            <p className='text-midnightNavy text-sm'>
                                                {profile?.user.username}
                                            </p>
                                        </span>
                                        <span>
                                            <p className='text-midnightNavy opacity-50 font-medium'>
                                                Email
                                            </p>
                                            <p className='text-midnightNavy text-sm'>
                                                {profile?.user.email}
                                            </p>
                                        </span>
                                        <span>
                                            <p className='text-midnightNavy opacity-50 font-medium'>
                                                Mobile
                                            </p>
                                            <p className='text-midnightNavy text-sm'>
                                                {profile?.user.mobile_no ? profile?.user.mobile_no : "not added"}
                                            </p>
                                        </span>
                                        <span>
                                            <p className='text-midnightNavy opacity-50 font-medium'>
                                                Time in role
                                            </p>
                                            <p className='text-midnightNavy text-sm'>
                                                {timeElapsed(profile?.user.date_joined)}
                                            </p>
                                        </span>
                                    </div>
                                    <div className="hidden lg:flex lg:flex-col items-start justify-between">
                                        <span>
                                            <p className='text-midnightNavy opacity-50 font-medium'>
                                                Last Login
                                            </p>
                                            <p className='text-midnightNavy w-[100px] text-sm' break-words>
                                                {profile?.user.date_joined ? (
                                                    formatDateTime(profile?.user.date_joined)
                                                ) : (
                                                    "Not logged in"
                                                )}
                                            </p>
                                        </span>
                                        <div className="relative flex flex-col gap-4">
                                            <h2 className="text-midnightNavy opacity-50 font-medium">Admin since</h2>
                                            <span className="relative flex justify-center">
                                                <p className="absolute top-[-13px] left-1/2 -translate-x-1/2 text-2xl font-semibold text-deepOceanBlue">
                                                    {dmy.day} {dmy.month}
                                                </p>
                                                <p className="text-5xl font-semibold text-deepOceanBlue opacity-40">
                                                    {dmy.year}
                                                </p>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {editMode && (
                                <div className='w-full lg:px-2 pb-4'>
                                    <form className='w-full space-y-3'>
                                        <div>
                                            <label className='text-midnightNavy font-medium'>Name</label>
                                            <input {...register("name", { required: "Name is required" })} className='border rounded-xl px-3 py-2 w-full text-sm text-black/60 focus:outline-none focus:ring-1 focus:ring-gray-200' />
                                            {errors.name && <p className='text-red-500 text-xs'>{errors.name.message}</p>}
                                        </div>
                                        <div>
                                            <label className='text-midnightNavy font-medium'>Username</label>
                                            <input {...register("username", { required: "Username is required" })} className='border rounded-xl px-3 py-2 w-full text-sm text-black/60 focus:outline-none focus:ring-1 focus:ring-gray-200' />
                                            {errors.username && <p className='text-red-500 text-sm'>{errors.username.message}</p>}
                                        </div>
                                        <div>
                                            <label className='text-midnightNavy font-medium'>Email</label>
                                            <input {...register("email", { required: "Email is required" })} type='email' className='border rounded-xl px-3 py-2 w-full text-sm text-black/60 focus:outline-none focus:ring-1 focus:ring-gray-200' />
                                            {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
                                        </div>
                                        <div>
                                            <label className='text-midnightNavy font-medium'>Mobile</label>
                                            <input 
                                                {...register("mobile_no", {
                                                    pattern: {
                                                        value: /^\+\d{1,3}\d{7,12}$/,
                                                        message: "Enter a valid mobile number with country code (e.g., +914129876543)"
                                                    },
                                                    maxLength: {
                                                        value: 15,
                                                        message: "Mobile number cannot exceed 15 characters"
                                                    }
                                                })} 
                                                className='border rounded-xl px-3 py-2 w-full text-sm text-black/60 focus:outline-none focus:ring-1 focus:ring-gray-200' 
                                            />
                                            {errors.mobile_no && 
                                                <p className='text-red-500 text-sm'>{errors.mobile_no.message}</p>
                                            }
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                </FlexiCard>
                <FlexiCard
                    title={editMode ? "Change Password" : "Admin Activity"}
                    description={editMode ? "Update your account password for enhanced security." : "Track recent actions performed."}
                >
                    {!editMode && (
                        <div className='lg:px-2 h-full flex items-center justify-center'>
                            {!adminLogs ? (
                                <div>
                                    <p className='text-midnightNavy opacity-50'>No recent activity.</p>
                                </div>
                            ) : (
                                <div>

                                </div>
                            )
                        }
                        </div>
                    )}

                    {editMode && (
                        <div className='lg:p-2'>
                            <form className='w-full space-y-6' onSubmit={handlePasswordSubmit(handlePasswordSave)}>
                                <div>
                                    <label className='text-midnightNavy font-medium'>Old Password</label>
                                    <input
                                        {
                                            ...registerPassword("old_password",
                                            { required: "Old Password is required" })
                                        }
                                        type='password'
                                        className='border rounded-xl px-3 py-2 w-full text-sm text-black/60
                                        focus:outline-none focus:ring-1 focus:ring-gray-200' />
                                    {passwordErrors.old_password && 
                                        <p className='text-red-500 text-sm'>
                                            {passwordErrors.old_password.message}
                                        </p>
                                    }
                                </div>
                                <div>
                                    <label className='text-midnightNavy font-medium'>New Password</label>
                                    <input
                                        {
                                            ...registerPassword("new_password",
                                            { required: "New Password is required",
                                            minLength: 8 })
                                        }
                                        type='password'
                                        className='border rounded-xl px-3 py-2 w-full text-sm text-black/60
                                        focus:outline-none focus:ring-1 focus:ring-gray-200' />
                                    {passwordErrors.new_password &&
                                        <p className='text-red-500 text-sm'>
                                            {passwordErrors.new_password.message}
                                        </p>
                                    }
                                </div>
                                <div>
                                    <label className='text-midnightNavy font-medium'>Confirm Password</label>
                                    <input
                                        {
                                            ...registerPassword("confirm_password",
                                            { required: "Confirm Password is required",
                                            validate: value => value === watch("new_password") || "Passwords do not match" })
                                        }
                                        type='password'
                                        className='border rounded-xl px-3 py-2 w-full text-sm text-black/60
                                        focus:outline-none focus:ring-1 focus:ring-gray-200' />
                                    {passwordErrors.confirm_password &&
                                        <p className='text-red-500 text-sm'>
                                            {passwordErrors.confirm_password.message}
                                        </p>
                                        }
                                </div>
                                <button
                                    type='submit'
                                    disabled={isPasswordLoading}
                                    className="text-center flex items-center justify-center gap-1 bg-deepOceanBlue
                                    hover:bg-deep-ocean-blue-gradient-end text-white
                                    px-5 lg:px-10 py-0 h-10 rounded-full w-full"
                                >
                                    {isPasswordLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        "Change Password"
                                    )}
                                </button>
                            </form>
                        </div>
                    )}
                </FlexiCard>
            </div>
        </AdminLayout>
    )
}

export default AdminProfile