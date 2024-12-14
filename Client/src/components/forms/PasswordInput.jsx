import React, { useState } from 'react';
import * as Yup from 'yup';

function PasswordInput({
    label = 'Password',
    id = 'password',
    name = 'password',
    placeholder = 'Enter your password',
    mainBackground = 'bg-white',
    borderRadius = 'rounded-full',
    labelColor = 'text-labelGreen',
    borderColor = 'border-gray-300',
    textColor = 'text-labelGreen',
    focusBorderColor = 'focus:ring-borderGreen',
    errorMessage = 'Invalid password',
    value,
    margin = "my-4",
    onChange,
}) {
    const [isValid, setIsValid] = useState(true);
    const [errorText, setErrorText] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const passwordSchema = Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[@$!%*?&#]/, 'Password must contain at least one special character');

    const handleChange = async (e) => {
        const inputValue = e.target.value;

        try {
            await passwordSchema.validate(inputValue);
            setIsValid(true);
            setErrorText('');
        } catch (err) {
            setIsValid(false);
            setErrorText(err.message);
        }

        onChange(inputValue);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`flex flex-col space-y-2 ${margin}`}>
            <label htmlFor={id} className={`text-sm font-medium ${labelColor}`}>
                {label}
            </label>
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    className={`px-4 py-2 w-full ${borderColor} ${mainBackground} ${textColor} ${borderRadius} shadow-sm focus:outline-none
                        focus:ring-1 ${focusBorderColor} ${!isValid ? 'border-red-500' : ''}`}
                />
                {/* Toggle password visibility */}
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500"
                >
                    {showPassword ? 'Hide' : 'Show'}
                </button>
            </div>
            {/* Error message if invalid */}
            {!isValid && <p className="text-sm text-red-500">{errorText}</p>}
        </div>
    );
}

export default PasswordInput;
