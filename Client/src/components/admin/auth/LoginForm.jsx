import React, { useState } from 'react'
import PasswordInput from '../../forms/PasswordInput'
import TextFieldInput from '../../forms/TextInput'
import Button from '../../forms/Button'
import symbolLogo from "../../../assets/logo/symbol-logo.png"
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setEmail, setProfile } from '../../../redux/slices/ProfileSlice'
import AlertSnackbar from '../../Snackbar/AlertSnackbar'
import { motion } from 'framer-motion'

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.username || !formData.password) {
            setSnackbarMessage("Username and password are required.");
            setSnackbarOpen(true)
            return;
        }
    
        try {
            setIsLoading(true);
            const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
            const response = await axios.post(`${apiBaseUrl}accounts/login/`, formData);

            if (response.status === 400) {
                setSnackbarMessage("Invalid credentials for a staff account.")
                setSnackbarOpen(true)
                return
            }
    
            const { access, refresh, profile } = response.data;
            if (!profile.user.is_staff) {
                setSnackbarMessage("Invalid credentials for a staff account.");
                setSnackbarOpen(true)
                return
            } else {
                localStorage.setItem('ACCESS_TOKEN', access);
                localStorage.setItem('REFRESH_TOKEN', refresh);
                dispatch(setProfile({ profile_data : profile }));
                dispatch(setEmail({ email: profile.user.email }));
                navigate('/admin')
            }
        } catch (err) {
            setSnackbarMessage("Login failed. Please try again.");
            setSnackbarOpen(true)
            return
        } finally {
            setIsLoading(false);
        }
    }

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { duration: 0.4 }
        }
    };
    
    const logoVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { 
            scale: 1, 
            opacity: 1,
            transition: { 
                type: "spring",
                stiffness: 260,
                damping: 20,
                duration: 0.6 
            }
        }
    };

    const buttonVariants = {
        idle: { scale: 1 },
        hover: { scale: 1.03 },
        tap: { scale: 0.97 }
    };

    return (
        <motion.div 
            className="flex items-center w-full py-10 justify-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <AlertSnackbar 
                open={snackbarOpen}
                message={snackbarMessage}
                alert_type="error"
                onClose={() => setSnackbarOpen(false)}
            />

            <motion.div 
                className="bg-blackOpacity30 p-6 rounded-2xl shadow-lg w-full max-w-sm sm:py-6 md:w-2/3"
                variants={itemVariants}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col items-center">
                    <motion.img 
                        src={symbolLogo} 
                        alt="Symbol Logo" 
                        className="w-24"
                        variants={logoVariants}
                    />
                    <motion.h2 
                        className="text-lg font-semibold text-white text-center"
                        variants={itemVariants}
                    >
                        PetSphere Admin Login
                    </motion.h2>
                    <motion.p 
                        className="font-light text-sm text-whiteOpacity05"
                        variants={itemVariants}
                    >
                        Connect and manage platform responsibilities
                    </motion.p>
                </div>
                <form onSubmit={handleSubmit}>
                    <motion.div variants={itemVariants}>
                        <TextFieldInput 
                            borderRadius="rounded-md"
                            labelColor="text-white"
                            borderColor="focus:ring-borderGreen"
                            mainBackground="bg-blackOpacity30"
                            focusBorderColor="focus:ring-borderGreen"
                            validationPattern={/.+/}
                            errorNull={true}
                            errorMessage="This field is required"
                            textColor="text-whiteOpacity05"
                            value={formData.username}
                            margin="my-5"
                            onChange={(value) => handleChange('username', value)}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <PasswordInput 
                            borderRadius="rounded-md"
                            mainBackground="bg-blackOpacity30"
                            labelColor="text-white"
                            borderColor="border-gray-300"
                            textColor="text-whiteOpacity05"
                            focusBorderColor="focus:ring-borderGreen"
                            validationPattern={/.{8,}/}
                            errorMessage="Password must be at least 8 characters"
                            value={formData.password}
                            margin="my-5"
                            onChange={(value) => handleChange("password", value)}
                        />
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                    >
                        <motion.div
                            variants={buttonVariants}
                            initial="idle"
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <Button 
                                type="submit"
                                text={isLoading ? "Logging in..." : "Login"}
                                isLoading={isLoading}
                                textColor="text-white"
                                rounded="rounded-md"
                                paddingx="px-4"
                                paddingy="py-2"
                                className="w-full my-8"
                                backgroundColor="bg-blackOpacity40"
                                isLoadingBackground="bg-blackOpacity30"
                                hoverBackgroundColor="hover:bg-blackOpacity30"
                            />
                        </motion.div>
                    </motion.div>
                </form>
            </motion.div>
        </motion.div>
    )
}

export default LoginForm