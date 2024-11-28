import React, { useState } from 'react';

function PasswordInput({
    label = 'Password',
    id = 'password',
    name = 'password',
    placeholder = 'Enter your password',
    borderRadius = 'rounded-full',
    labelColor = 'text-labelGreen',
    borderColor = 'border-gray-300',
    textColor = 'text-labelGreen',
    focusBorderColor = 'focus:ring-borderGreen',
    validationPattern = /.{8,}/,
    errorMessage = 'Password must be at least 8 characters',
    value,
    onChange,
}) {
    const [isValid, setIsValid] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const inputValue = e.target.value;
        setIsValid(validationPattern.test(inputValue.trim()))
        onChange(inputValue)
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='flex flex-col space-y-2'>
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
                    className={`px-4 py-2 w-full ${borderColor}  ${textColor} ${borderRadius} shadow-sm focus:outline-none
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
            {/* Show error message if invalid */}
            {!isValid && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
    );
}

export default PasswordInput;
