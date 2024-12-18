import React, { useState } from "react";

function TextFieldInput({
    label = 'Username',
    id = 'username',
    name = 'username',
    placeholder = 'Enter your username',
    borderRadius = 'rounded-full',
    labelColor = 'text-labelGreen',
    borderColor = 'focus:ring-borderGreen',
    mainBackground = 'bg-white',
    focusBorderColor = 'focus:ring-borderGreen',
    validationPattern = /.+/,
    errorNull = true,
    errorMessage = 'This field is required',
    textColor = "text-labelGreen",
    padding = "px-4 py-2",
    value,
    margin = "my-3",
    onChange,
}) {
    const [isValid, setIsValid] = useState(true);

    const handleChange = (e) => {
        const inputValue = e.target.value;
        setIsValid(validationPattern.test(inputValue.trim()));
        onChange(inputValue);
    };

    return (
        <div className={`flex flex-col space-y-2 ${margin}`}>
            <label htmlFor={id} className={`text-sm font-medium ${labelColor}`}>
                {label}
            </label>
            <input
                type="text"
                id={id}
                name={name}
                placeholder={placeholder}
                value={value}
                autoComplete="off"
                onChange={handleChange}
                className={`${padding} ${borderColor} ${borderRadius} ${textColor} ${mainBackground} shadow-sm focus:outline-none
                    focus:ring-1 ${focusBorderColor} ${!isValid ? 'border-red-700' : ''}`}
                maxLength={25}
            />
            {/* Show error only if errorNull is true */}
            {errorNull && !isValid && (
                <p className="text-sm text-red-700">{errorMessage}</p>
            )}
        </div>
    );
}

export default TextFieldInput;
